import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import { unstable_cache } from 'next/cache'

import type { Event } from '@/payload-types'
import { isUpcoming } from './formatEventDate'

const UPCOMING_GRACE_MS = 6 * 60 * 60 * 1000

/** Base filter shared by every public query: published and not hidden. */
const publicWhere: Where = {
  and: [{ _status: { equals: 'published' } }, { hidden: { not_equals: true } }],
}

/** Events whose start or end is still in the (grace-adjusted) future. */
const upcomingWhere = (): Where => {
  const cutoff = new Date(Date.now() - UPCOMING_GRACE_MS).toISOString()
  return {
    and: [
      publicWhere,
      {
        or: [{ endAt: { greater_than_equal: cutoff } }, { startAt: { greater_than_equal: cutoff } }],
      },
    ],
  }
}

const pastWhere = (): Where => {
  const cutoff = new Date(Date.now() - UPCOMING_GRACE_MS).toISOString()
  return {
    and: [
      publicWhere,
      { startAt: { less_than: cutoff } },
      { or: [{ endAt: { less_than: cutoff } }, { endAt: { exists: false } }] },
    ],
  }
}

async function queryEvents(where: Where, sort: string, limit: number): Promise<Event[]> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'events',
    where,
    sort,
    limit,
    depth: 1,
    pagination: false,
    overrideAccess: false,
  })
  return result.docs
}

export const getUpcomingEvents = ({ limit = 12 }: { limit?: number } = {}) =>
  unstable_cache(
    async () => {
      const docs = await queryEvents(upcomingWhere(), 'startAt', Math.max(limit, 1) * 2)
      return docs.filter((e) => isUpcoming(e)).slice(0, limit)
    },
    ['events-upcoming', String(limit)],
    { tags: ['events'] },
  )()

export const getPastEvents = ({ limit = 12 }: { limit?: number } = {}) =>
  unstable_cache(
    async () => {
      const docs = await queryEvents(pastWhere(), '-startAt', Math.max(limit, 1) * 2)
      return docs.filter((e) => !isUpcoming(e)).slice(0, limit)
    },
    ['events-past', String(limit)],
    { tags: ['events'] },
  )()

/**
 * The event to spotlight: the soonest upcoming event flagged "featured",
 * otherwise the soonest upcoming event. Null when nothing is scheduled.
 */
export const getFeaturedEvent = () =>
  unstable_cache(
    async () => {
      const upcoming = await queryEvents(upcomingWhere(), 'startAt', 50)
      const live = upcoming.filter((e) => isUpcoming(e))
      return live.find((e) => e.featured) ?? live[0] ?? null
    },
    ['events-featured'],
    { tags: ['events'] },
  )()

export async function getEventBySlug(
  slug: string,
  { draft = false }: { draft?: boolean } = {},
): Promise<Event | null> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'events',
    draft,
    limit: 1,
    depth: 1,
    pagination: false,
    overrideAccess: draft,
    where: draft
      ? { slug: { equals: slug } }
      : { and: [{ slug: { equals: slug } }, { hidden: { not_equals: true } }] },
  })
  return result.docs?.[0] ?? null
}

export async function getEventById(id: number | string): Promise<Event | null> {
  const payload = await getPayload({ config: configPromise })
  try {
    const doc = await payload.findByID({
      collection: 'events',
      id,
      depth: 1,
      overrideAccess: false,
      disableErrors: true,
    })
    return (doc as Event | null) ?? null
  } catch {
    return null
  }
}
