import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { revalidateStem, revalidateStemDelete } from './hooks/revalidateStem'

export const StemPrograms: CollectionConfig<'stem-programs'> = {
  slug: 'stem-programs',
  labels: { singular: 'STEM program', plural: 'STEM programs' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'partner', 'featured', 'order'],
    group: 'Chapter',
    livePreview: { url: () => '/stem-grant' },
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'partner',
      type: 'text',
      required: true,
      admin: { description: 'Partner organization, e.g. "University of Colorado Colorado Springs (UCCS)".' },
    },
    {
      name: 'partnerShort',
      type: 'text',
      admin: { description: 'Short label for compact cards, e.g. "UCCS". Defaults to the partner name before any comma or parenthesis.' },
    },
    { name: 'description', type: 'textarea', required: true },
    { name: 'link', type: 'text', admin: { description: 'Optional partner / program URL.' } },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Featured programs are shown first on the home page.' },
    },
    { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar' } },
  ],
  hooks: {
    afterChange: [revalidateStem],
    afterDelete: [revalidateStemDelete],
  },
}
