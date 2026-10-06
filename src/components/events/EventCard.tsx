import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { Event } from '@/payload-types'
import { Reveal } from '@/components/Reveal'
import { eventCoverUrl, eventDateParts } from '@/utilities/formatEventDate'
import { EventMeta } from './EventMeta'
import { TagBadge } from './TagBadge'
import { zeffyHref } from './EventActions'

export function EventCard({ event, idx = 0 }: { event: Event; idx?: number }) {
  const cover = eventCoverUrl(event)
  const { year } = eventDateParts(event)
  const detailHref = `/events/${event.slug}`
  const zeffy = zeffyHref(event)

  return (
    <Reveal
      as="article"
      delay={idx * 0.05}
      className="chamfered-card group relative flex h-full flex-col overflow-hidden border border-navy-900/10 bg-white transition-colors duration-300 hover:border-navy-900/30 dark:border-ice/10 dark:bg-chathams-700/20 dark:hover:border-ice/30 dark:hover:bg-chathams-700/30"
    >
      {cover ? (
        <Link href={detailHref} className="relative block aspect-video w-full overflow-hidden" tabIndex={-1} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>
      ) : null}

      <div className="relative flex flex-1 flex-col p-4 sm:p-7">
        <div className="relative flex items-center justify-between gap-3">
          {event.tag ? <TagBadge tag={event.tag} /> : <span />}
          <span className="font-sans text-[10px] font-semibold tracking-[0.18em] text-navy-900/40 uppercase dark:text-ice/40">
            {year}
          </span>
        </div>

        <h3 className="relative mt-5 font-display text-base leading-snug font-semibold tracking-tight text-navy-900 sm:text-xl md:text-2xl dark:text-ice">
          <Link
            href={detailHref}
            className="transition-colors hover:text-chathams-700 focus-visible:outline-none focus-visible:underline dark:hover:text-gold"
          >
            {event.title}
          </Link>
        </h3>

        <EventMeta event={event} className="relative mt-3 flex-col items-start gap-y-3" />

        {event.blurb ? (
          <p className="relative mt-4 line-clamp-3 text-sm leading-relaxed text-navy-800/75 dark:text-ice/70">
            {event.blurb}
          </p>
        ) : null}

        <div className="relative mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
          {event.lumaUrl ? (
            <a
              href={event.lumaUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-navy-900 transition-colors hover:text-chathams-700 focus-visible:text-chathams-700 focus-visible:outline-none dark:text-gold dark:hover:text-gold/90"
              aria-label={`RSVP for ${event.title} on Luma`}
            >
              RSVP on Luma
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          ) : null}
          {zeffy ? (
            <a
              href={zeffy}
              {...(/^https?:/i.test(zeffy) ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
              className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-gold transition-colors hover:text-gold/80 focus-visible:outline-none focus-visible:underline"
            >
              {event.zeffy?.buttonLabel?.trim() || 'Get tickets'}
            </a>
          ) : null}
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-navy-800/70 underline-offset-4 transition-colors hover:text-navy-900 hover:underline focus-visible:outline-none focus-visible:underline dark:text-ice/70 dark:hover:text-ice"
          >
            Details
          </Link>
        </div>
      </div>
    </Reveal>
  )
}
