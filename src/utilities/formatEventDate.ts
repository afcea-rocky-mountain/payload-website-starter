import type { Event } from '@/payload-types'

const TZ_FALLBACK = 'America/Denver'

type Parts = { day: string; month: string; year: string }

/** "02", "FEB", "2026" for the big date stack. Uses the event's timezone. */
export function eventDateParts(ev: Pick<Event, 'startAt' | 'timezone'>): Parts {
  const d = new Date(ev.startAt)
  if (Number.isNaN(d.getTime())) return { day: 'TBD', month: '', year: '' }
  const tz = ev.timezone || TZ_FALLBACK
  const day = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: tz }).format(d)
  const month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: tz }).format(d).toUpperCase()
  const year = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: tz }).format(d)
  return { day, month, year }
}

/**
 * Human date line for cards: honors `dateDisplay` override, otherwise
 * "February 2–5, 2026" for multi-day, "October 15, 2026" for single day.
 */
export function formatEventDate(ev: Pick<Event, 'startAt' | 'endAt' | 'timezone' | 'dateDisplay'>): string {
  if (ev.dateDisplay?.trim()) return ev.dateDisplay.trim()
  const tz = ev.timezone || TZ_FALLBACK
  const start = new Date(ev.startAt)
  if (Number.isNaN(start.getTime())) return 'Date TBA'
  const end = ev.endAt ? new Date(ev.endAt) : null
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', { timeZone: tz, ...o })
  const sameDay =
    !end ||
    fmt({ year: 'numeric', month: '2-digit', day: '2-digit' }).format(start) ===
      fmt({ year: 'numeric', month: '2-digit', day: '2-digit' }).format(end)
  if (sameDay) return fmt({ month: 'long', day: 'numeric', year: 'numeric' }).format(start)
  const sameMonth =
    fmt({ year: 'numeric', month: '2-digit' }).format(start) === fmt({ year: 'numeric', month: '2-digit' }).format(end!)
  if (sameMonth) {
    return `${fmt({ month: 'long' }).format(start)} ${fmt({ day: 'numeric' }).format(start)}–${fmt({ day: 'numeric' }).format(end!)}, ${fmt({ year: 'numeric' }).format(start)}`
  }
  return `${fmt({ month: 'short', day: 'numeric' }).format(start)} – ${fmt({ month: 'short', day: 'numeric', year: 'numeric' }).format(end!)}`
}

/** "6:00 PM MT" style time line, or null when no meaningful time. */
export function formatEventTime(ev: Pick<Event, 'startAt' | 'endAt' | 'timezone'>): string | null {
  const tz = ev.timezone || TZ_FALLBACK
  const start = new Date(ev.startAt)
  if (Number.isNaN(start.getTime())) return null
  const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz, timeZoneName: 'short' })
  const parts = fmt.formatToParts(start)
  const time = parts.filter((p) => p.type !== 'timeZoneName' && p.type !== 'literal' || p.value.trim() !== '' ).map((p) => p.value).join('').trim()
  const tzName = parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
  if (/^12:00 AM/i.test(time)) return null // midnight == "all day" from Luma
  if (ev.endAt) {
    const end = new Date(ev.endAt)
    const endStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }).format(end)
    return `${time.replace(tzName, '').trim()} – ${endStr} ${tzName}`.replace(/\s+/g, ' ')
  }
  return time
}

export const isUpcoming = (ev: Pick<Event, 'startAt' | 'endAt'>, now = new Date()): boolean => {
  const end = ev.endAt ? new Date(ev.endAt) : new Date(ev.startAt)
  return end.getTime() >= now.getTime() - 6 * 60 * 60 * 1000 // keep showing until 6h after end
}

/** Resolve the best cover image URL (uploaded media first, then Luma cover). */
export function eventCoverUrl(ev: Pick<Event, 'coverImage' | 'coverUrl'>): string | null {
  const m = ev.coverImage
  if (m && typeof m === 'object' && m.url) return m.sizes?.large?.url || m.url
  return ev.coverUrl || null
}
