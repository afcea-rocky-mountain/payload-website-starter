import type { Block } from 'payload'
import { eyebrowHeadingFields } from '@/fields/eyebrowHeading'

export const iconOptions = [
  { label: 'Shield (military)', value: 'shield' },
  { label: 'Landmark (government)', value: 'landmark' },
  { label: 'Briefcase (industry)', value: 'briefcase' },
  { label: 'Graduation cap (academia)', value: 'graduationCap' },
  { label: 'Calendar', value: 'calendar' },
  { label: 'Sparkles', value: 'sparkles' },
  { label: 'Map pin', value: 'mapPin' },
  { label: 'Mail', value: 'mail' },
  { label: 'Users', value: 'users' },
  { label: 'Rocket', value: 'rocket' },
]

export const MissionPillars: Block = {
  slug: 'missionPillars',
  interfaceName: 'MissionPillarsBlock',
  labels: { singular: 'Mission pillars', plural: 'Mission pillars' },
  fields: [
    ...eyebrowHeadingFields({ headingRequired: true }),
    {
      name: 'pillars',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'icon', type: 'select', options: iconOptions, defaultValue: 'shield', admin: { width: '40%' } },
            { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
  ],
}
