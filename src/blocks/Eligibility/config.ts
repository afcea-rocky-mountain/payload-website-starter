import type { Block } from 'payload'
import { eyebrowHeadingFields } from '@/fields/eyebrowHeading'

export const Eligibility: Block = {
  slug: 'eligibility',
  interfaceName: 'EligibilityBlock',
  labels: { singular: 'Checklist (eligibility)', plural: 'Checklists' },
  fields: [
    ...eyebrowHeadingFields({ headingRequired: true }),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
  ],
}
