import type { Block } from 'payload'
import { eyebrowHeadingFields } from '@/fields/eyebrowHeading'

export const EventsGrid: Block = {
  slug: 'eventsGrid',
  interfaceName: 'EventsGridBlock',
  labels: { singular: 'Events list', plural: 'Events lists' },
  fields: [
    {
      name: 'showFeatured',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show the featured event as a large card above the grid',
    },
    ...eyebrowHeadingFields({ headingRequired: true }),
    {
      type: 'row',
      fields: [
        {
          name: 'scope',
          type: 'select',
          defaultValue: 'upcoming',
          options: [
            { label: 'Upcoming only', value: 'upcoming' },
            { label: 'Upcoming, then recent past', value: 'upcomingThenPast' },
            { label: 'Past only', value: 'past' },
          ],
          admin: { width: '50%' },
        },
        { name: 'limit', type: 'number', defaultValue: 12, min: 1, max: 60, admin: { width: '50%' } },
      ],
    },
    { name: 'allEventsLabel', type: 'text', defaultValue: 'All events on Luma' },
    {
      name: 'emptyMessage',
      type: 'text',
      defaultValue: 'No additional events scheduled. Check Luma for the latest calendar.',
    },
  ],
}
