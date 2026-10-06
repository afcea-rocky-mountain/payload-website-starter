import type { Metadata } from 'next'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { ArrowLeft, Calendar, Clock, ExternalLink, MapPin } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import type { Event } from '@/payload-types'
import PageTransition from '@/components/PageTransition'
import TopoHero from '@/heros/TopoHero'
import RichText from '@/components/RichText'
import { ChamferedCard } from '@/components/ChamferedCard'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { Reveal } from '@/components/Reveal'
import { SectionIntro } from '@/components/SectionIntro'
import { ZeffyFrame } from '@/components/ZeffyFrame'
import { EventActions } from '@/components/events/EventActions'
import { TagBadge } from '@/components/events/TagBadge'
import { shortDateRange } from '@/components/events/dateRange'
import { getEventBySlug } from '@/utilities/events'
import {
  eventCoverUrl,
  eventDateParts,
  formatEventDate,
  formatEventTime,
} from '@/utilities/formatEventDate'
import { generateMeta } from '@/utilities/generateMeta'
import { getServerSideURL } from '@/utilities/getURL'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const events = await payload.find({
    collection: 'events',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    where: { hidden: { not_equals: true } },
  })
  return events.docs.filter((e) => Boolean(e.slug)).map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{ slug: string }>
}

const queryEvent = cache(async (slug: string): Promise<Event | null> => {
  const { isEnabled: draft } = await draftMode()
  return getEventBySlug(slug, { draft })
})

export default async function EventPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = `/events/${decodedSlug}`

  const event = await queryEvent(decodedSlug)
  if (!event) return <PayloadRedirects url={url} />

  const cover = eventCoverUrl(event)
  const date = eventDateParts(event)
  const time = formatEventTime(event)
  const showZeffy = Boolean(event.zeffy?.enabled && event.zeffy.url && event.zeffy.embed)
  const mapsHref = event.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`
    : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.startAt,
    ...(event.endAt ? { endDate: event.endAt } : {}),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    url: `${getServerSideURL()}${url}`,
    ...(cover ? { image: [cover] } : {}),
    ...(event.blurb ? { description: event.blurb } : {}),
    ...(event.location
      ? {
          location: {
            '@type': 'Place',
            name: event.location,
            ...(event.address ? { address: event.address } : {}),
          },
        }
      : {}),
    organizer: {
      '@type': 'Organization',
      name: 'AFCEA Rocky Mountain Chapter',
      url: getServerSideURL(),
    },
    ...(event.lumaUrl ? { offers: { '@type': 'Offer', url: event.lumaUrl } } : {}),
  }

  return (
    <PageTransition>
      <main id="main" className="bg-ice text-navy-900 dark:bg-navy-900 dark:text-ice">
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <TopoHero
          variant="short"
          eyebrow={event.tag || 'Event'}
          title={event.title}
          subtitle={event.blurb || undefined}
        >
          <EventActions event={event} onDetailPage />
        </TopoHero>

        <section className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Main column */}
            <div className="lg:col-span-7 xl:col-span-8">
              {cover ? (
                <Reveal className="overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt={`Cover image for ${event.title}`}
                    loading="eager"
                    decoding="async"
                    className="aspect-video w-full object-cover"
                  />
                </Reveal>
              ) : null}

              <Reveal className={cover ? 'mt-10' : ''}>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-navy-900 sm:text-3xl dark:text-ice">
                  About this event
                </h2>
                {event.description ? (
                  <RichText
                    data={event.description}
                    enableGutter={false}
                    className="mt-5 prose-headings:font-display prose-headings:tracking-tight prose-p:text-navy-800/80 dark:prose-p:text-ice/80 prose-a:text-chathams-600 dark:prose-a:text-gold"
                  />
                ) : event.blurb ? (
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-800/80 sm:text-lg dark:text-ice/80">
                    {event.blurb}
                  </p>
                ) : (
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-800/70 dark:text-ice/70">
                    Full details and registration are on Luma.
                  </p>
                )}
              </Reveal>

              <Reveal className="mt-10">
                <dl className="grid grid-cols-1 gap-6 border-t border-navy-900/10 pt-8 sm:grid-cols-2 dark:border-ice/10">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-chathams-600 dark:text-gold" aria-hidden="true" />
                    <div>
                      <dt className="font-sans text-[11px] font-semibold tracking-[0.18em] text-chathams-700 uppercase dark:text-gold">
                        Date
                      </dt>
                      <dd className="mt-1 font-medium">
                        <time dateTime={event.startAt}>{formatEventDate(event)}</time>
                      </dd>
                    </div>
                  </div>
                  {time ? (
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-chathams-600 dark:text-gold" aria-hidden="true" />
                      <div>
                        <dt className="font-sans text-[11px] font-semibold tracking-[0.18em] text-chathams-700 uppercase dark:text-gold">
                          Time
                        </dt>
                        <dd className="mt-1 font-medium">{time}</dd>
                      </div>
                    </div>
                  ) : null}
                  {event.location || event.address ? (
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-chathams-600 dark:text-gold" aria-hidden="true" />
                      <div>
                        <dt className="font-sans text-[11px] font-semibold tracking-[0.18em] text-chathams-700 uppercase dark:text-gold">
                          Location
                        </dt>
                        <dd className="mt-1 font-medium">
                          {event.location}
                          {event.address ? (
                            <span className="block text-sm font-normal text-navy-800/70 dark:text-ice/70">
                              {mapsHref ? (
                                <a
                                  href={mapsHref}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="underline decoration-gold/40 underline-offset-4 transition hover:decoration-gold"
                                >
                                  {event.address}
                                </a>
                              ) : (
                                event.address
                              )}
                            </span>
                          ) : null}
                        </dd>
                      </div>
                    </div>
                  ) : null}
                </dl>
              </Reveal>
            </div>

            {/* Sticky aside */}
            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-24">
                <ChamferedCard className="border border-navy-900/10 bg-white/70 p-6 backdrop-blur-sm sm:p-8 dark:border-ice/10 dark:bg-navy-900/40">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-sans text-[11px] font-semibold tracking-[0.18em] text-chathams-700 uppercase dark:text-gold">
                      Save the date
                    </p>
                    {event.tag ? <TagBadge tag={event.tag} /> : null}
                  </div>
                  <div className="mt-4 flex items-end gap-4">
                    <span className="font-display text-6xl leading-none font-semibold tracking-tight text-navy-900 sm:text-7xl dark:text-ice">
                      {date.day}
                    </span>
                    <div className="flex flex-col pb-1">
                      <span className="font-sans text-sm font-bold tracking-[0.3em] text-chathams-700 uppercase dark:text-gold">
                        {date.month}
                      </span>
                      <span className="font-sans text-xs tracking-widest text-navy-800/60 uppercase dark:text-ice/60">
                        {date.year}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 font-sans text-sm tracking-wide text-navy-900/70 dark:text-ice/70">
                    {shortDateRange(event)}
                    {time ? <> &nbsp;·&nbsp; {time}</> : null}
                  </div>
                  {event.location ? (
                    <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-navy-900/70 dark:text-ice/70">
                      <MapPin className="h-4 w-4 text-chathams-600 dark:text-gold" aria-hidden="true" />
                      {event.location}
                    </div>
                  ) : null}

                  <div className="mt-6 h-px bg-navy-900/10 dark:bg-ice/10" />

                  <EventActions
                    event={event}
                    onDetailPage
                    hideCalendar
                    className="mt-6 flex-col items-stretch sm:flex-col sm:items-stretch [&>a]:w-full"
                  />
                  {event.lumaUrl ? (
                    <a
                      href={event.lumaUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-4 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-navy-800/70 underline-offset-4 transition hover:text-navy-900 hover:underline dark:text-ice/70 dark:hover:text-ice"
                    >
                      View on Luma
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : null}
                </ChamferedCard>

                <Link
                  href="/events"
                  className="group mt-6 inline-flex items-center gap-2 font-sans text-sm font-semibold text-chathams-600 transition-colors hover:text-navy-900 dark:text-gold dark:hover:text-gold/80"
                >
                  <ArrowLeft
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  />
                  Back to all events
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {showZeffy ? (
          <section
            id="tickets"
            className="relative scroll-mt-24 border-t border-navy-900/5 bg-white/60 dark:border-ice/10 dark:bg-chathams-600/10"
          >
            <div className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
              <SectionIntro
                eyebrow="Tickets"
                heading="Register and pay securely through Zeffy"
                intro="Zeffy processes payments for the chapter with zero platform fees. Your receipt is emailed to you after checkout."
                align="center"
              />
              <ChamferedCard className="mt-12 border border-navy-900/10 bg-white dark:border-ice/10 dark:bg-navy-900">
                <ZeffyFrame
                  url={event.zeffy!.url!}
                  height={event.zeffy?.height}
                  title={`${event.title} — tickets`}
                />
              </ChamferedCard>
            </div>
          </section>
        ) : null}
      </main>
    </PageTransition>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const event = await queryEvent(decodeURIComponent(slug))
  const meta = await generateMeta({ doc: event as never })
  // Fall back to event fields when SEO tab is empty.
  const description = event?.meta?.description || event?.blurb || undefined
  const cover = event ? eventCoverUrl(event) : null
  return {
    ...meta,
    title: event?.meta?.title ? meta.title : event ? `${event.title} | AFCEA Rocky Mountain Chapter` : meta.title,
    description,
    openGraph: {
      ...(meta.openGraph ?? {}),
      description,
      ...(cover && !event?.meta?.image ? { images: [{ url: cover }] } : {}),
    },
  }
}
