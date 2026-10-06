import type { Payload } from 'payload'

import { fetchLumaEntries, lumaEventUrl, lumaLocationLine, type LumaEntry } from './client'

export type LumaSyncResult = {
  created: number
  updated: number
  skipped: number
  unpublishedMissing: number
  errors: string[]
  total: number
}

const slugify = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 80) || 'event'

/**
 * Upsert Luma events into the `events` collection.
 *
 * Sync-owned fields (overwritten every run): title, startAt, endAt, timezone,
 * location, address, lumaUrl, coverUrl, source, lumaEventId, syncedAt.
 * Editor-owned fields (never touched): featured, hidden, tag, blurb,
 * highlights, zeffy.*, description, coverImage, slug (after creation), meta.
 */
export async function syncLumaEvents(
  payload: Payload,
  opts?: {
    includePast?: boolean
    /** Set false when running outside a Next.js request (CLI) — revalidatePath needs a request store. */
    revalidate?: boolean
  },
): Promise<LumaSyncResult> {
  const disableRevalidate = opts?.revalidate === false
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const calendarApiId =
    settings?.luma?.calendarApiId || process.env.LUMA_CALENDAR_API_ID || 'cal-B3ppeWVbSPa2fCP'
  const includePast = opts?.includePast ?? settings?.luma?.includePast ?? true

  const result: LumaSyncResult = { created: 0, updated: 0, skipped: 0, unpublishedMissing: 0, errors: [], total: 0 }

  const entries: LumaEntry[] = []
  entries.push(...(await fetchLumaEntries({ calendarApiId, period: 'future' })))
  if (includePast) {
    entries.push(...(await fetchLumaEntries({ calendarApiId, period: 'past', maxPages: 4 })))
  }

  // Dedupe by event id (an event can appear in both lists around "now").
  const byId = new Map<string, LumaEntry>()
  for (const e of entries) if (e?.event?.api_id) byId.set(e.event.api_id, e)
  result.total = byId.size

  const existing = await payload.find({
    collection: 'events',
    where: { source: { equals: 'luma' } },
    limit: 1000,
    pagination: false,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })
  const existingById = new Map(existing.docs.map((d) => [d.lumaEventId, d]))
  const seen = new Set<string>()
  const now = new Date().toISOString()

  for (const entry of byId.values()) {
    const ev = entry.event
    seen.add(ev.api_id)
    try {
      const syncData = {
        title: ev.name?.trim() || 'Untitled event',
        startAt: ev.start_at,
        endAt: ev.end_at ?? null,
        timezone: ev.timezone ?? 'America/Denver',
        location: lumaLocationLine(ev) ?? null,
        address: ev.geo_address_info?.full_address ?? null,
        lumaUrl: lumaEventUrl(ev.url) ?? null,
        coverUrl: ev.cover_url ?? ev.social_image_url ?? null,
        source: 'luma' as const,
        lumaEventId: ev.api_id,
        syncedAt: now,
      }

      const current = existingById.get(ev.api_id)
      if (current) {
        const changed = (Object.keys(syncData) as (keyof typeof syncData)[]).some((k) => {
          if (k === 'syncedAt') return false
          const a = (current as unknown as Record<string, unknown>)[k]
          const b = syncData[k]
          if (k === 'startAt' || k === 'endAt') {
            return (a ? new Date(a as string).getTime() : null) !== (b ? new Date(b as string).getTime() : null)
          }
          return (a ?? null) !== (b ?? null)
        })
        if (!changed) {
          result.skipped++
          continue
        }
        await payload.update({
          collection: 'events',
          id: current.id,
          data: { ...syncData, _status: current._status ?? 'published' },
          depth: 0,
          overrideAccess: true,
          context: { disableRevalidate, lumaSync: true },
        })
        result.updated++
      } else {
        // Make the slug unique against anything already in the collection.
        const base = slugify(ev.name || ev.api_id)
        const clash = await payload.find({
          collection: 'events',
          where: { slug: { like: base } },
          limit: 50,
          depth: 0,
          pagination: false,
          overrideAccess: true,
          draft: true,
        })
        const taken = new Set(clash.docs.map((d) => d.slug))
        let slug = base
        let i = 2
        while (taken.has(slug)) slug = `${base}-${i++}`

        await payload.create({
          collection: 'events',
          data: { ...syncData, slug, _status: 'published' },
          depth: 0,
          overrideAccess: true,
          context: { disableRevalidate, lumaSync: true },
        })
        result.created++
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      result.errors.push(`${ev.api_id} (${ev.name}): ${msg}`)
      payload.logger.error({ err, lumaEventId: ev.api_id }, 'Luma sync: failed to upsert event')
    }
  }

  // Events that vanished from Luma (cancelled/deleted) are unpublished, not deleted,
  // so editors keep any blurb/Zeffy data they added.
  for (const doc of existing.docs) {
    if (doc.lumaEventId && !seen.has(doc.lumaEventId) && doc._status === 'published') {
      try {
        await payload.update({
          collection: 'events',
          id: doc.id,
          data: { _status: 'draft', syncedAt: now },
          depth: 0,
          overrideAccess: true,
          context: { disableRevalidate, lumaSync: true },
        })
        result.unpublishedMissing++
      } catch (err) {
        result.errors.push(`${doc.lumaEventId}: unpublish failed`)
      }
    }
  }

  const summary = `${result.created} created, ${result.updated} updated, ${result.skipped} unchanged, ${result.unpublishedMissing} unpublished${result.errors.length ? `, ${result.errors.length} errors` : ''}`
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { luma: { ...(settings?.luma ?? {}), lastSyncedAt: now, lastSyncSummary: summary } },
    depth: 0,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  payload.logger.info(`Luma sync: ${summary}`)

  return result
}
