import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Event } from '../../../payload-types'

// Events appear on the home page (featured block), the events page (grid),
// and their own detail page — revalidate all three.
const revalidateAll = (slug?: string | null) => {
  revalidatePath('/')
  revalidatePath('/events')
  if (slug) revalidatePath(`/events/${slug}`)
  revalidateTag('events', 'max')
  revalidateTag('pages-sitemap', 'max')
}

/**
 * Only published changes touch the public site. Draft autosaves (including the
 * empty draft Payload creates when opening the "Create new" view) must not
 * revalidate, because that happens during a React render and Next rejects it.
 */
export const revalidateEvent: CollectionAfterChangeHook<Event> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  const wasPublished = previousDoc?._status === 'published'
  const isPublished = doc._status === 'published'

  if (isPublished || wasPublished) {
    payload.logger.info(`Revalidating event: ${doc.slug}`)
    revalidateAll(doc.slug)
    if (wasPublished && previousDoc?.slug && previousDoc.slug !== doc.slug) {
      revalidatePath(`/events/${previousDoc.slug}`)
    }
  }
  return doc
}

export const revalidateEventDelete: CollectionAfterDeleteHook<Event> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) revalidateAll(doc?.slug)
  return doc
}
