import { Calendar, Clock, MapPin } from 'lucide-react'

import type { Event } from '@/payload-types'
import { formatEventDate, formatEventTime } from '@/utilities/formatEventDate'
import { cn } from '@/utilities/ui'

type Props = {
  event: Pick<Event, 'startAt' | 'endAt' | 'timezone' | 'dateDisplay' | 'location'>
  showTime?: boolean
  className?: string
  /** Larger icons/text used on the detail page. */
  size?: 'sm' | 'md'
}

/** Calendar + (clock) + map-pin rows used on cards and the detail page. */
export function EventMeta({ event, showTime = false, className, size = 'sm' }: Props) {
  const time = showTime ? formatEventTime(event) : null
  const iconCls = cn(
    'shrink-0 text-chathams-600/70 dark:text-gold/70',
    size === 'md' ? 'h-5 w-5' : 'h-4 w-4',
  )
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-6 gap-y-3 text-navy-900/80 dark:text-ice/80',
        size === 'md' ? 'text-base' : 'text-sm',
        className,
      )}
    >
      <span className="inline-flex items-center gap-2">
        <Calendar className={iconCls} aria-hidden="true" />
        <time dateTime={event.startAt} className="font-medium text-navy-900 dark:text-ice">
          {formatEventDate(event)}
        </time>
      </span>
      {time ? (
        <span className="inline-flex items-center gap-2">
          <Clock className={iconCls} aria-hidden="true" />
          {time}
        </span>
      ) : null}
      {event.location ? (
        <span className="inline-flex items-center gap-2">
          <MapPin className={iconCls} aria-hidden="true" />
          {event.location}
        </span>
      ) : null}
    </div>
  )
}
