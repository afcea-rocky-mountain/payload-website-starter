import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

export const SITE_NAME = 'AFCEA Rocky Mountain Chapter'
export const SITE_DESCRIPTION =
  'AFCEA Rocky Mountain Chapter — unifying military, government, industry, and academia across Colorado, Wyoming, and New Mexico to advance STEM education and the cyber & defense community.'
export const OG_DESCRIPTION =
  'Unifying the Rocky Mountain cyber and defense community. Events, leadership, and STEM grants.'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: OG_DESCRIPTION,
  images: [
    {
      url: `${getServerSideURL()}/og.png`,
      width: 1200,
      height: 630,
    },
  ],
  siteName: SITE_NAME,
  title: SITE_NAME,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
