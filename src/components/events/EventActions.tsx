import { CalendarPlus, ExternalLink, Ticket } from 'lucide-react'

import type { Event } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Props = {
  event: Pick<Event, 'lumaUrl' | 'zeffy' | 'slug'>
  /** When true the Zeffy button scrolls to the embedded form (#tickets) on the detail page. */
  onDetailPage?: boolean
  /** Hide the "Add to calendar" text link. */
  hideCalendar?: boolean
  className?: string
}

export function zeffyHref(
  event: Pick<Event, 'zeffy' | 'slug'>,
  onDetailPage?: boolean,
): string | null {
  const z = event.zeffy
  if (!z?.enabled || !z.url) return null
  if (z.embed) return onDetailPage ? '#tickets' : `/events/${event.slug}#tickets`
  return z.url
}

/** RSVP on Luma + optional Zeffy tickets button + "Add to calendar" text link. */
export function EventActions({ event, onDetailPage, hideCalendar, className }: Props) {
  const luma = event.lumaUrl || null
  const zeffy = zeffyHref(event, onDetailPage)
  const zeffyExternal = Boolean(zeffy && /^https?:/i.test(zeffy))
  const zeffyLabel = event.zeffy?.buttonLabel?.trim() || 'Get tickets'

  if (!luma && !zeffy) return null

  return (
    <div
      className={cn(
        'flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center',
        className,
      )}
    >
      {zeffy ? (
        <a
          href={zeffy}
          {...(zeffyExternal ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
          className="group/cta inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-sans text-sm font-semibold text-navy-900 ring-1 ring-gold transition hover:-translate-y-0.5 hover:bg-gold/90 focus-visible:ring-2 focus-visible:ring-navy-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-ice"
        >
          <Ticket className="h-4 w-4" aria-hidden="true" />
          {zeffyLabel}
        </a>
      ) : null}
      {luma ? (
        <a
          href={luma}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            'group/cta inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-semibold ring-1 transition focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:outline-none',
            zeffy
              ? 'border border-navy-900/20 bg-white/25 text-navy-900 ring-transparent backdrop-blur-sm hover:border-navy-900/40 hover:bg-white/40 dark:border-ice/20 dark:bg-navy-900/25 dark:text-ice dark:hover:border-ice/40 dark:hover:bg-navy-900/40'
              : 'bg-navy-900 text-ice ring-navy-900 hover:bg-chathams-700 hover:ring-chathams-700 dark:bg-gold dark:text-navy-900 dark:ring-gold dark:hover:bg-gold/90',
          )}
        >
          RSVP on Luma
          <ExternalLink
            className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      ) : null}
      {luma && !hideCalendar ? (
        <a
          href={luma}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-11 items-center justify-center gap-2 font-sans text-sm font-semibold text-navy-900 underline-offset-4 transition hover:underline focus-visible:underline focus-visible:outline-none sm:justify-start dark:text-ice"
        >
          Add to calendar
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        </a>
      ) : null}
    </div>
  )
}
