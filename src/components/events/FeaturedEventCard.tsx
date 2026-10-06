import Link from 'next/link'

import type { Event } from '@/payload-types'
import { Reveal } from '@/components/Reveal'
import { eventCoverUrl, eventDateParts } from '@/utilities/formatEventDate'
import { EventActions } from './EventActions'
import { EventMeta } from './EventMeta'
import { TagBadge } from './TagBadge'
import { shortDateRange } from './dateRange'

/** Large chamfered card used at the top of the Events page. */
export function FeaturedEventCard({ event }: { event: Event }) {
  const cover = eventCoverUrl(event)
  const { year } = eventDateParts(event)
  const detailHref = `/events/${event.slug}`
  const highlights = (event.highlights ?? []).filter((h) => h?.text?.trim())

  return (
    <Reveal
      as="article"
      className="chamfered-card group relative isolate overflow-hidden border border-navy-900/15 bg-white ring-1 ring-navy-900/[0.03] dark:border-ice/10 dark:bg-navy-900/60 dark:ring-ice/[0.04]"
    >
      <div className="relative z-20 grid gap-8 p-6 sm:gap-10 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14 lg:p-14">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-navy-900 px-3 py-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-ice uppercase dark:bg-ice dark:text-navy-900">
              Featured
            </span>
            {event.tag ? <TagBadge tag={event.tag} /> : null}
          </div>

          <h2 className="font-display text-2xl leading-[1.15] font-semibold tracking-tight text-balance text-navy-900 hyphens-auto sm:text-4xl sm:leading-[1.1] lg:text-5xl dark:text-ice">
            <Link
              href={detailHref}
              className="transition-colors hover:text-chathams-700 focus-visible:outline-none focus-visible:underline dark:hover:text-gold"
            >
              {event.title}
            </Link>
          </h2>

          {event.blurb ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-800/80 sm:text-lg dark:text-ice/75">
              {event.blurb}
            </p>
          ) : null}

          <EventMeta event={event} className="mt-8" />

          <EventActions event={event} className="mt-8 sm:mt-10" />
        </div>

        <aside className="relative">
          {cover ? (
            <Link
              href={detailHref}
              className="mb-6 block aspect-video w-full overflow-hidden"
              tabIndex={-1}
              aria-hidden="true"
            >
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
          <p className="font-sans text-[11px] font-semibold tracking-[0.18em] text-chathams-700 uppercase dark:text-gold">
            Save the date
          </p>
          <div className="mt-4 font-display text-5xl font-semibold text-navy-900 sm:text-6xl dark:text-ice">
            {shortDateRange(event)}
          </div>
          <div className="mt-1 font-sans text-sm tracking-wide text-navy-900/70 dark:text-ice/70">
            {year}
            {event.location ? <> &nbsp;·&nbsp; {event.location.split(',')[0]}</> : null}
          </div>

          {highlights.length > 0 ? (
            <>
              <div className="mt-6 h-px bg-navy-900/10 dark:bg-ice/10" />
              <ul className="mt-6 space-y-3 text-sm text-navy-900/80 dark:text-ice/80">
                {highlights.map((h) => (
                  <li key={h.id ?? h.text} className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                      aria-hidden="true"
                    />
                    {h.text}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </aside>
      </div>
    </Reveal>
  )
}
