import { ExternalLink } from 'lucide-react'

import type { Event, EventsGridBlock as Props } from '@/payload-types'
import { SectionIntro } from '@/components/SectionIntro'
import { EventCard } from '@/components/events/EventCard'
import { FeaturedEventCard } from '@/components/events/FeaturedEventCard'
import { getFeaturedEvent, getPastEvents, getUpcomingEvents } from '@/utilities/events'
import { DEFAULTS, getSiteSettings } from '@/utilities/getSiteSettings'

type BlockProps = Props & { disableInnerContainer?: boolean }

async function collect(scope: Props['scope'], limit: number): Promise<Event[]> {
  if (scope === 'past') return getPastEvents({ limit })
  const upcoming = await getUpcomingEvents({ limit })
  if (scope === 'upcomingThenPast' && upcoming.length < limit) {
    const past = await getPastEvents({ limit: limit - upcoming.length })
    return [...upcoming, ...past]
  }
  return upcoming
}

/** Events page: optional featured card + the "Highlights" grid. */
export const EventsGridBlock = async (props: BlockProps) => {
  const limit = props.limit ?? 12
  const [settings, featured, events] = await Promise.all([
    getSiteSettings(0),
    props.showFeatured ? getFeaturedEvent() : Promise.resolve(null),
    collect(props.scope ?? 'upcoming', limit + 1),
  ])
  const calendarUrl = settings?.luma?.calendarUrl || DEFAULTS.lumaCalendarUrl
  const rest = events.filter((e) => e.id !== featured?.id).slice(0, limit)

  return (
    <>
      {featured ? (
        <section
          aria-labelledby="featured-event-heading"
          className="relative mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24"
        >
          {/* Top fade bleeds down from the TopoHero above. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-2 z-10 h-24 bg-gradient-to-b from-ice to-transparent dark:from-navy-900"
          />
          <h2 id="featured-event-heading" className="sr-only">
            Featured event
          </h2>
          <FeaturedEventCard event={featured} />
        </section>
      ) : null}

      <section
        aria-labelledby="highlights-heading"
        className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14">
          <SectionIntro
            eyebrow={props.eyebrow}
            heading={props.heading}
            intro={props.intro}
            headingId="highlights-heading"
            className="max-w-2xl"
          />
          <a
            href={calendarUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex shrink-0 items-center gap-2 font-sans text-sm font-semibold text-navy-900 underline-offset-4 transition hover:underline focus-visible:underline focus-visible:outline-none dark:text-gold"
          >
            {props.allEventsLabel || 'All events on Luma'}
            <ExternalLink
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>

        {rest.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {rest.map((event, idx) => (
              <EventCard key={event.id} event={event} idx={idx} />
            ))}
          </div>
        ) : (
          <div className="chamfered-card border border-dashed border-navy-900/15 p-12 text-center text-navy-900/60 dark:border-ice/15 dark:text-ice/60">
            {props.emptyMessage || 'No additional events scheduled. Check Luma for the latest calendar.'}
          </div>
        )}
      </section>
    </>
  )
}
