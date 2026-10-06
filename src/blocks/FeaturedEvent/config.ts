import type { Block } from 'payload'
import { eyebrowHeadingFields } from '@/fields/eyebrowHeading'

export const FeaturedEvent: Block = {
  slug: 'featuredEvent',
  interfaceName: 'FeaturedEventBlock',
  labels: { singular: 'Featured event', plural: 'Featured events' },
  fields: [
    ...eyebrowHeadingFields({ withIntro: false }),
    {
      name: 'mode',
      type: 'radio',
      defaultValue: 'auto',
      admin: { layout: 'horizontal' },
      options: [
        { label: 'Automatic — next event flagged "featured", else next upcoming', value: 'auto' },
        { label: 'Pick an event', value: 'manual' },
      ],
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      admin: { condition: (_, s) => s?.mode === 'manual' },
    },
    {
      name: 'viewAllLabel',
      type: 'text',
      defaultValue: 'View all events',
    },
  ],
}
