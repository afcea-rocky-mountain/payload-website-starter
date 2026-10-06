import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Site' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'tagline',
      type: 'textarea',
      admin: { description: 'Short paragraph under the chapter name.' },
    },
    {
      name: 'affiliation',
      type: 'group',
      label: 'Affiliation line',
      fields: [
        { name: 'prefix', type: 'text', defaultValue: 'A chartered chapter of' },
        { name: 'label', type: 'text', defaultValue: 'AFCEA International' },
        { name: 'url', type: 'text', defaultValue: 'https://www.afcea.org/' },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      maxRows: 3,
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          maxRows: 8,
          fields: [link({ appearances: false })],
        },
      ],
    },
    {
      name: 'bottomNote',
      type: 'text',
      defaultValue: 'Serving Colorado · Wyoming · New Mexico',
    },
    // Kept for backwards compatibility with the starter's RowLabel component.
    {
      name: 'navItems',
      type: 'array',
      maxRows: 6,
      admin: { hidden: true },
      fields: [link({ appearances: false })],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
