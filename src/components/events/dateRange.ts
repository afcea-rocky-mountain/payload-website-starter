import type { Event } from '@/payload-types'

const TZ_FALLBACK = 'America/Denver'

/**
 * Short "save the date" range: "Feb 2–5", "Oct 15", or "Sep 30 – Oct 2".
 * Falls back to "TBA" for unparseable dates.
 */
export function shortDateRange(ev: Pick<Event, 'startAt' | 'endAt' | 'timezone'>): string {
  const tz = ev.timezone || TZ_FALLBACK
  const start = new Date(ev.startAt)
  if (Number.isNaN(start.getTime())) return 'TBA'
  const end = ev.endAt ? new Date(ev.endAt) : null
  const fmt = (o: Intl.DateTimeFormatOptions, d: Date) =>
    new Intl.DateTimeFormat('en-US', { timeZone: tz, ...o }).format(d)
  const key = (d: Date) => fmt({ year: 'numeric', month: '2-digit', day: '2-digit' }, d)
  if (!end || key(start) === key(end)) return fmt({ month: 'short', day: 'numeric' }, start)
  const sameMonth = fmt({ year: 'numeric', month: '2-digit' }, start) === fmt({ year: 'numeric', month: '2-digit' }, end)
  if (sameMonth) return `${fmt({ month: 'short' }, start)} ${fmt({ day: 'numeric' }, start)}–${fmt({ day: 'numeric' }, end)}`
  return `${fmt({ month: 'short', day: 'numeric' }, start)} – ${fmt({ month: 'short', day: 'numeric' }, end)}`
}
