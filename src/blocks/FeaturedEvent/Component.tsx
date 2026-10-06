import Link from 'next/link'
import { ArrowRight, ArrowUpRight, CalendarDays, MapPin, Sparkles } from 'lucide-react'

import type { Event, FeaturedEventBlock as Props } from '@/payload-types'
import { Reveal } from '@/components/Reveal'
import { SectionIntro } from '@/components/SectionIntro'
import { zeffyHref } from '@/components/events/EventActions'
import { eventDateParts, formatEventDate } from '@/utilities/formatEventDate'
import { getEventById, getFeaturedEvent } from '@/utilities/events'

type BlockProps = Props & { disableInnerContainer?: boolean }

async function resolveEvent(props: Props): Promise<Event | null> {
  if (props.mode === 'manual' && props.event) {
    if (typeof props.event === 'object') return props.event
    return getEventById(props.event)
  }
  return getFeaturedEvent()
}

/** Home page "What's Next" — the big chamfered featured-event article. */
export const FeaturedEventBlock = async (props: BlockProps) => {
  const event = await resolveEvent(props)
  if (!event) return null

  const date = eventDateParts(event)
  const detailHref = `/events/${event.slug}`
  const zeffy = zeffyHref(event)

  return (
    <section className="relative border-t border-navy-900/5 bg-white py-28 sm:py-32 dark:border-ice/10 dark:bg-navy-900/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionIntro
            eyebrow={props.eyebrow ?? "What's Next"}
            heading={props.heading ?? 'On the chapter calendar next.'}
          />
          <Link
            href="/events"
            className="group inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-chathams-600 transition-colors hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-chathams-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-gold dark:hover:text-gold/80"
          >
            {props.viewAllLabel || 'View all events'}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </Reveal>

        <Reveal
          as="article"
          className="chamfered-card group relative mt-10 overflow-hidden border border-navy-900/10 bg-gradient-to-br from-ice via-white to-ice transition-colors duration-500 hover:border-navy-900/25 dark:border-ice/10 dark:from-chathams-600/30 dark:via-navy-900/60 dark:to-navy-900 dark:hover:border-ice/30"
        >
          <div className="relative grid grid-cols-1 gap-8 p-8 sm:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-12 lg:p-12">
            {/* Date stack */}
            <div className="flex flex-row items-center gap-5 lg:flex-col lg:items-start lg:gap-1">
              <div className="font-display text-6xl leading-none font-semibold tracking-tight text-navy-900 sm:text-7xl lg:text-8xl dark:text-ice">
                {date.day}
              </div>
              <div className="flex flex-col lg:mt-2">
                <span className="font-sans text-sm font-bold tracking-[0.3em] text-chathams-700 uppercase dark:text-gold">
                  {date.month}
                </span>
                <span className="font-sans text-xs tracking-widest text-navy-800/60 uppercase dark:text-ice/60">
                  {date.year}
                </span>
              </div>
            </div>

            {/* Title + meta */}
            <div className="min-w-0">
              {event.tag ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 font-sans text-xs font-semibold tracking-widest text-gold uppercase ring-1 ring-gold/30">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  {event.tag}
                </span>
              ) : null}
              <h3 className="mt-4 font-display text-2xl leading-tight font-semibold tracking-tight text-navy-900 sm:text-3xl lg:text-4xl dark:text-ice">
                <Link
                  href={detailHref}
                  className="transition-colors hover:text-chathams-700 focus-visible:outline-none focus-visible:underline dark:hover:text-gold"
                >
                  {event.title}
                </Link>
              </h3>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-sm text-navy-800/70 dark:text-ice/70">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays
                    className="h-4 w-4 text-chathams-600/70 dark:text-gold/70"
                    aria-hidden="true"
                  />
                  <time dateTime={event.startAt}>{formatEventDate(event)}</time>
                </span>
                {event.location ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin
                      className="h-4 w-4 text-chathams-600/70 dark:text-gold/70"
                      aria-hidden="true"
                    />
                    {event.location}
                  </span>
                ) : null}
              </div>
              {event.blurb ? (
                <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-navy-800/80 dark:text-ice/80">
                  {event.blurb}
                </p>
              ) : null}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4 lg:flex-col lg:items-end">
              {event.lumaUrl ? (
                <a
                  href={event.lumaUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group/cta inline-flex items-center justify-center gap-2 rounded-full bg-navy-700 px-6 py-3 font-sans text-sm font-semibold text-ice transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-900 focus-visible:ring-2 focus-visible:ring-navy-700 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-gold dark:text-navy-900 dark:hover:bg-gold/90 dark:focus-visible:ring-gold"
                >
                  RSVP on Luma
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              ) : null}
              {zeffy ? (
                <a
                  href={zeffy}
                  {...(/^https?:/i.test(zeffy) ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-sans text-sm font-semibold text-navy-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold/90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {event.zeffy?.buttonLabel?.trim() || 'Get tickets'}
                </a>
              ) : null}
              <Link
                href={detailHref}
                className="group/d inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-navy-900/70 underline-offset-4 transition-colors hover:text-navy-900 hover:underline focus-visible:outline-none focus-visible:underline dark:text-ice/70 dark:hover:text-ice"
              >
                Details
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover/d:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
