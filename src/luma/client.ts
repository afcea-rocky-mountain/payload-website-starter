/**
 * Minimal client for Luma's public calendar feed.
 *
 * `https://api.lu.ma/calendar/get-items?calendar_api_id=cal-…` is the same
 * unauthenticated JSON the public calendar page uses. No API key required.
 */

export type LumaGeo = {
  city?: string | null
  region?: string | null
  region_short?: string | null
  city_state?: string | null
  address?: string | null
  full_address?: string | null
  short_address?: string | null
  description?: string | null
}

export type LumaEvent = {
  api_id: string
  name: string
  start_at: string
  end_at?: string | null
  timezone?: string | null
  url: string
  cover_url?: string | null
  social_image_url?: string | null
  location_type?: 'offline' | 'online' | string | null
  geo_address_info?: LumaGeo | null
  geo_address_visibility?: string | null
  visibility?: string | null
}

export type LumaEntry = {
  api_id: string
  start_at: string
  event: LumaEvent
  status?: string
  tags?: { name?: string }[]
}

type GetItemsResponse = {
  entries: LumaEntry[]
  has_more: boolean
  next_cursor?: string | null
}

const BASE = 'https://api.lu.ma'

export async function fetchLumaEntries(opts: {
  calendarApiId: string
  period: 'future' | 'past'
  maxPages?: number
  signal?: AbortSignal
}): Promise<LumaEntry[]> {
  const { calendarApiId, period, maxPages = 10, signal } = opts
  const out: LumaEntry[] = []
  let cursor: string | null | undefined = undefined

  for (let page = 0; page < maxPages; page++) {
    const params = new URLSearchParams({
      calendar_api_id: calendarApiId,
      period,
      pagination_limit: '50',
    })
    if (cursor) params.set('pagination_cursor', cursor)

    const res = await fetch(`${BASE}/calendar/get-items?${params.toString()}`, {
      headers: { accept: 'application/json', 'user-agent': 'afcea-rocky-mtn-site/1.0' },
      signal,
      cache: 'no-store',
    })
    if (!res.ok) {
      throw new Error(`Luma get-items (${period}) failed: HTTP ${res.status}`)
    }
    const data = (await res.json()) as GetItemsResponse
    out.push(...(data.entries ?? []))
    if (!data.has_more || !data.next_cursor) break
    cursor = data.next_cursor
  }

  return out
}

/** Luma returns either a short slug ("n4dgvloj") or a full external URL. */
export function lumaEventUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (/^https?:\/\//i.test(url)) return url
  return `https://luma.com/${url.replace(/^\/+/, '')}`
}

/** Build the short venue line shown on cards. */
export function lumaLocationLine(ev: LumaEvent): string | undefined {
  if (ev.location_type === 'online') return 'Online'
  const g = ev.geo_address_info
  if (!g) return undefined
  if (ev.geo_address_visibility === 'hidden') return g.city_state ?? undefined
  // Prefer "Venue name, City, ST" when Luma gives a description (venue name).
  const venue = g.description?.trim()
  const cityState = g.city_state?.trim() || [g.city, g.region_short].filter(Boolean).join(', ')
  if (venue && cityState) return `${venue}, ${cityState}`
  if (g.short_address && g.region_short) return `${g.short_address}, ${g.region_short}`
  return g.short_address || cityState || g.full_address || undefined
}
