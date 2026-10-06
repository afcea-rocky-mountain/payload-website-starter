import type { Block } from 'payload'
import { eyebrowHeadingFields } from '@/fields/eyebrowHeading'
import { linkGroup } from '@/fields/linkGroup'

export const CtaBand: Block = {
  slug: 'ctaBand',
  interfaceName: 'CtaBandBlock',
  labels: { singular: 'Call-to-action band', plural: 'Call-to-action bands' },
  fields: [
    ...eyebrowHeadingFields({ headingRequired: true }),
    {
      name: 'style',
      type: 'select',
      defaultValue: 'centered',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Split (text left, buttons right) on topo', value: 'splitTopo' },
        { label: 'Chamfered card', value: 'card' },
      ],
    },
    linkGroup({ overrides: { maxRows: 2 } }),
  ],
}
