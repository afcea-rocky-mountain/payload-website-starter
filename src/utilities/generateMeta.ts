import type { Metadata } from 'next'

import type { Config, Event, Media, Page } from '../payload-types'

import { getServerSideURL } from './getURL'
import { SITE_NAME, mergeOpenGraph } from './mergeOpenGraph'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/og.png'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

const isEvent = (doc: Partial<Page> | Partial<Event>): doc is Partial<Event> => 'startAt' in doc

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Event> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const baseTitle = doc?.meta?.title || doc?.title
  const title = baseTitle && baseTitle !== SITE_NAME ? `${baseTitle} | ${SITE_NAME}` : SITE_NAME

  let url = '/'
  if (doc?.slug) {
    if (isEvent(doc)) url = `/events/${doc.slug}`
    else url = doc.slug === 'home' ? '/' : `/${doc.slug}`
  }

  const description =
    doc?.meta?.description || (doc && isEvent(doc) ? doc.blurb || undefined : undefined)

  return {
    description,
    openGraph: mergeOpenGraph({
      description: description || '',
      images: ogImage ? [{ url: ogImage }] : undefined,
      title,
      url,
    }),
    title: { absolute: title },
  }
}
