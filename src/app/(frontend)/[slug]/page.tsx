import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import TopoHero from '@/heros/TopoHero'
import PageTransition from '@/components/PageTransition'
import Button from '@/components/Button'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import { getSiteSettings, DEFAULTS } from '@/utilities/getSiteSettings'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const MAIN_CLS = 'bg-ice text-navy-900 dark:bg-navy-900 dark:text-ice'

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug

  const [page, siteSettings] = await Promise.all([
    queryPageBySlug({ slug: decodedSlug }),
    getSiteSettings(1),
  ])

  // Unseeded database: show a friendly placeholder instead of a 404 on the home page.
  if (!page && decodedSlug === 'home') {
    return (
      <PageTransition>
        <main id="main" className={MAIN_CLS}>
          <TopoHero
            variant="tall"
            eyebrow="Getting started"
            title={siteSettings?.siteName || DEFAULTS.siteName}
            subtitle="The site is running, but no home page has been published yet. Sign in to the admin panel and use “Seed your database” on the dashboard, or create a page with the slug “home”."
          >
            <Button href="/admin" variant="primary" newTab={false}>
              Open the admin panel
            </Button>
          </TopoHero>
        </main>
      </PageTransition>
    )
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <PageTransition>
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <main id="main" className={MAIN_CLS}>
        <RenderHero {...hero} siteSettings={siteSettings} />
        <RenderBlocks blocks={layout} />
      </main>
    </PageTransition>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(
  async ({ slug }: { slug: string }): Promise<RequiredDataFromCollectionSlug<'pages'> | null> => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  },
)
