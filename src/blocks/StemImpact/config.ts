import type { Block } from 'payload'

export const StemImpact: Block = {
  slug: 'stemImpact',
  interfaceName: 'StemImpactBlock',
  labels: { singular: 'STEM impact', plural: 'STEM impact' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'STEM Impact' },
    {
      name: 'statOverride',
      type: 'number',
      admin: {
        description:
          'Leave blank to use the STEM total from Site Settings. Rendered as "$500K+" style.',
      },
    },
    {
      name: 'statCaption',
      type: 'textarea',
      defaultValue:
        'invested in STEM education across the Rocky Mountain region in 2023, including scholarships, classroom grants, and youth programs.',
    },
    {
      name: 'aside',
      type: 'textarea',
      defaultValue:
        'Every dollar funds a learner, an educator, or a program building the technical workforce our region and our nation needs next.',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 4,
      min: 1,
      max: 12,
      admin: { description: 'How many programs to show (ordered by the "order" field, featured first).' },
    },
    { name: 'linkLabel', type: 'text', defaultValue: 'See all programs' },
    {
      name: 'linkPage',
      type: 'relationship',
      relationTo: 'pages',
      admin: { description: 'Page the "See all" link goes to (usually STEM Grant).' },
    },
  ],
}
