import type { File, Payload, PayloadRequest } from 'payload'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import { boardSeed } from './board'
import { stemSeed } from './stem'
import { lumaEnrichments, LUMA_CALENDAR } from './events'
import { eventsPage, homePage, leadershipPage, stemGrantPage, MEMBERSHIP_URL, STEM_EMAIL } from './pages'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const MEDIA_DIR = path.resolve(dirname, 'media')

/** Seeded media is tagged with this filename prefix so re-runs can clean it up safely. */
const MEDIA_PREFIX = 'seed-'
const OG_ALT = 'AFCEA Rocky Mountain Chapter'

const ctx = { disableRevalidate: true }

async function readFile(name: string): Promise<File> {
  const data = await fs.readFile(path.join(MEDIA_DIR, name))
  const ext = path.extname(name).toLowerCase().replace('.', '')
  return {
    name: `${MEDIA_PREFIX}${name}`,
    data,
    mimetype: ext === 'png' ? 'image/png' : ext === 'jpg' ? 'image/jpeg' : `image/${ext}`,
    size: data.byteLength,
  }
}

/**
 * Seeds the original site content: pages, board members, STEM programs,
 * manually curated events, and the header/footer/site-settings globals.
 *
 * Idempotent and safe: it only deletes pages, board members, STEM programs,
 * events with source = manual, and media it uploaded itself (filename prefix
 * `seed-`). Luma-synced events, users and other media are never touched.
 */
export const seed = async ({ payload, req }: { payload: Payload; req: PayloadRequest }): Promise<void> => {
  payload.logger.info('Seeding AFCEA site content...')

  payload.logger.info('— Clearing previously seeded content...')
  await payload.db.deleteMany({ collection: 'pages', req, where: {} })
  await payload.db.deleteVersions({ collection: 'pages', req, where: {} })
  await payload.db.deleteMany({ collection: 'board-members', req, where: {} })
  await payload.db.deleteMany({ collection: 'stem-programs', req, where: {} })
  const manual = await payload.find({
    collection: 'events',
    where: { source: { equals: 'manual' } },
    limit: 500,
    depth: 0,
    pagination: false,
    draft: true,
    overrideAccess: true,
  })
  for (const ev of manual.docs) {
    await payload.delete({ collection: 'events', id: ev.id, depth: 0, overrideAccess: true, context: ctx })
  }
  const oldMedia = await payload.find({
    collection: 'media',
    where: { filename: { like: MEDIA_PREFIX } },
    limit: 500,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })
  for (const m of oldMedia.docs) {
    if (m.filename?.startsWith(MEDIA_PREFIX)) {
      await payload.delete({ collection: 'media', id: m.id, depth: 0, overrideAccess: true })
    }
  }

  payload.logger.info('— Uploading portraits and default share image...')
  const photoIds = new Map<string, number>()
  for (const member of boardSeed) {
    if (!member.photoFile) continue
    const doc = await payload.create({
      collection: 'media',
      data: { alt: `Portrait of ${member.name}` },
      file: await readFile(member.photoFile),
      overrideAccess: true,
    })
    photoIds.set(member.photoFile, doc.id)
  }
  const ogImage = await payload.create({
    collection: 'media',
    data: { alt: OG_ALT },
    file: await readFile('og-default.png'),
    overrideAccess: true,
  })

  payload.logger.info('— Seeding board members...')
  for (const [i, member] of boardSeed.entries()) {
    const { photoFile, ...rest } = member
    await payload.create({
      collection: 'board-members',
      data: {
        ...rest,
        photo: photoFile ? (photoIds.get(photoFile) ?? null) : null,
        order: i * 10,
      },
      depth: 0,
      overrideAccess: true,
      context: ctx,
    })
  }

  payload.logger.info('— Seeding STEM programs...')
  for (const [i, program] of stemSeed.entries()) {
    await payload.create({
      collection: 'stem-programs',
      data: { ...program, order: i * 10, featured: i < 4 },
      depth: 0,
      overrideAccess: true,
      context: ctx,
    })
  }

  payload.logger.info('— Enriching Luma events (blurbs, tags, featured)...')
  const lumaEvents = await payload.find({
    collection: 'events',
    where: { source: { equals: 'luma' } },
    limit: 500,
    depth: 0,
    pagination: false,
    draft: true,
    overrideAccess: true,
  })
  for (const ev of lumaEvents.docs) {
    const enrichment = lumaEnrichments.find((e) => e.match.test(ev.title))
    if (!enrichment) continue
    // Only fill fields the editor hasn't set, so re-seeding never clobbers edits.
    const data: Record<string, unknown> = {}
    if (enrichment.data.blurb && !ev.blurb) data.blurb = enrichment.data.blurb
    if (enrichment.data.tag && !ev.tag) data.tag = enrichment.data.tag
    if (enrichment.data.highlights && !(ev.highlights && ev.highlights.length)) data.highlights = enrichment.data.highlights
    if (enrichment.data.featured && !ev.featured) {
      // Feature only the soonest upcoming match.
      const isUpcoming = new Date(ev.endAt ?? ev.startAt).getTime() > Date.now() - 6 * 3600 * 1000
      if (isUpcoming) data.featured = true
    }
    if (Object.keys(data).length === 0) continue
    await payload.update({ collection: 'events', id: ev.id, data, depth: 0, overrideAccess: true, context: ctx })
  }

  payload.logger.info('— Seeding pages...')
  const stemGrant = await payload.create({
    collection: 'pages',
    data: stemGrantPage,
    depth: 0,
    overrideAccess: true,
    context: ctx,
  })
  const home = await payload.create({
    collection: 'pages',
    data: homePage({ stemGrantPageId: stemGrant.id }),
    depth: 0,
    overrideAccess: true,
    context: ctx,
  })
  const events = await payload.create({
    collection: 'pages',
    data: eventsPage,
    depth: 0,
    overrideAccess: true,
    context: ctx,
  })
  const leadership = await payload.create({
    collection: 'pages',
    data: leadershipPage,
    depth: 0,
    overrideAccess: true,
    context: ctx,
  })

  const pageRef = (id: number, label: string) => ({
    link: { type: 'reference' as const, reference: { relationTo: 'pages' as const, value: id }, label },
  })
  const external = (url: string, label: string) => ({
    link: { type: 'custom' as const, url, label, newTab: true },
  })

  payload.logger.info('— Seeding globals...')
  await payload.updateGlobal({
    slug: 'site-settings',
    depth: 0,
    overrideAccess: true,
    context: ctx,
    data: {
      siteName: 'AFCEA Rocky Mountain Chapter',
      shortName: 'AFCEA Rocky Mountain',
      tinyName: 'AFCEA RM',
      description:
        'AFCEA Rocky Mountain Chapter — unifying military, government, industry, and academia across Colorado, Wyoming, and New Mexico to advance STEM education and the cyber & defense community.',
      ogImage: ogImage.id,
      address: { line1: 'PO Box 63054', line2: 'Colorado Springs, CO 80962' },
      contactEmail: 'philparkerjr@gmail.com',
      stemEmail: STEM_EMAIL,
      regionLine: 'Colorado Springs',
      timezoneLabel: 'Mountain Time',
      membershipUrl: MEMBERSHIP_URL,
      luma: {
        calendarUrl: LUMA_CALENDAR,
        calendarApiId: 'cal-B3ppeWVbSPa2fCP',
        syncEnabled: true,
        includePast: true,
      },
      stemTotal: 500000,
      stemTotalYear: '2023',
    },
  })

  await payload.updateGlobal({
    slug: 'header',
    depth: 0,
    overrideAccess: true,
    context: ctx,
    data: {
      navItems: [
        pageRef(home.id, 'Home'),
        pageRef(events.id, 'Events'),
        pageRef(leadership.id, 'Leadership'),
        pageRef(stemGrant.id, 'STEM Grant'),
      ],
      cta: {
        enabled: true,
        link: { type: 'custom', url: MEMBERSHIP_URL, label: 'Join AFCEA', newTab: true },
      },
      showThemeToggle: true,
    },
  })

  await payload.updateGlobal({
    slug: 'footer',
    depth: 0,
    overrideAccess: true,
    context: ctx,
    data: {
      tagline:
        "Unifying the Rocky Mountain region's military, government, industry, and academic partners to advance STEM education for tomorrow's leaders.",
      affiliation: {
        prefix: 'A chartered chapter of',
        label: 'AFCEA International',
        url: 'https://www.afcea.org/',
      },
      columns: [
        {
          title: 'Chapter',
          links: [
            pageRef(home.id, 'Home'),
            pageRef(events.id, 'Events'),
            pageRef(leadership.id, 'Leadership'),
            pageRef(stemGrant.id, 'STEM Grant'),
            external(LUMA_CALENDAR, 'Luma Calendar'),
          ],
        },
        {
          title: 'AFCEA',
          links: [
            external('https://www.afcea.org/', 'AFCEA International'),
            external(MEMBERSHIP_URL, 'Membership'),
            external('https://www.afcea.org/signal-media', 'Signal Media'),
          ],
        },
      ],
      bottomNote: 'Serving Colorado · Wyoming · New Mexico',
      navItems: [],
    },
  })

  payload.logger.info('Seeded AFCEA site content successfully!')
}
