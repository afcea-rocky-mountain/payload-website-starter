import type { Block } from 'payload'
import { link } from '@/fields/link'

export const PromoBand: Block = {
  slug: 'promoBand',
  interfaceName: 'PromoBandBlock',
  labels: { singular: 'Promo band (topo)', plural: 'Promo bands' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Flagship Event' },
    {
      name: 'headingParts',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      admin: {
        description:
          'Heading segments joined by an accent "·" separator, e.g. RMCS26 · The Broadmoor · February 2–5, 2026',
      },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'body', type: 'textarea' },
    link({ appearances: ['primary', 'secondary', 'solidDark'] }),
  ],
}
