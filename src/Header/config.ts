import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Site' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      maxRows: 6,
      fields: [link({ appearances: false })],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Header button',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        link({ appearances: false, overrides: { admin: { condition: (_, s) => Boolean(s?.enabled) } } }),
      ],
    },
    {
      name: 'showThemeToggle',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show light / dark mode toggle',
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
