import type { Block } from 'payload'
import { eyebrowHeadingFields } from '@/fields/eyebrowHeading'

export const StemPrograms: Block = {
  slug: 'stemPrograms',
  interfaceName: 'StemProgramsBlock',
  labels: { singular: 'STEM programs grid', plural: 'STEM programs grids' },
  fields: [
    ...eyebrowHeadingFields({ headingRequired: true }),
    {
      name: 'showImpactStat',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show the animated "$500,000+ invested" headline above the grid',
    },
    { name: 'impactEyebrow', type: 'text', defaultValue: '2023 Community Impact', admin: { condition: (_, s) => Boolean(s?.showImpactStat) } },
    { name: 'impactCaption', type: 'text', defaultValue: 'invested in 2023 alone.', admin: { condition: (_, s) => Boolean(s?.showImpactStat) } },
    { name: 'impactBody', type: 'textarea', admin: { condition: (_, s) => Boolean(s?.showImpactStat) } },
  ],
}
