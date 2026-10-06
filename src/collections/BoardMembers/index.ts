import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { boardGroupOptions } from '../../blocks/LeadershipBoard/config'
import { revalidateBoard, revalidateBoardDelete } from './hooks/revalidateBoard'

export const BoardMembers: CollectionConfig<'board-members'> = {
  slug: 'board-members',
  labels: { singular: 'Board member', plural: 'Board members' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'group', 'order', 'email'],
    group: 'Chapter',
    livePreview: {
      url: () => '/leadership',
    },
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '60%', description: 'Nicknames in quotes are fine, e.g. Jason "Cueball" Simmons.' } },
        { name: 'postNominals', type: 'text', admin: { width: '40%', description: 'Rank / credentials, e.g. Lt Col, USAF (ret.)' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'role', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'group',
          type: 'select',
          required: true,
          options: boardGroupOptions,
          defaultValue: 'admin',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Portrait, ideally 4:5. Falls back to initials when empty.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', admin: { width: '50%' } },
        { name: 'phone', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'linkedin', type: 'text', admin: { width: '50%', description: 'Full LinkedIn profile URL.' } },
        { name: 'github', type: 'text', admin: { width: '50%', description: 'GitHub profile URL or username.' } },
      ],
    },
    { name: 'website', type: 'text', admin: { description: 'Personal or company website URL.' } },
    { name: 'bio', type: 'textarea' },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Lower numbers appear first within a group.' },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateBoard],
    afterDelete: [revalidateBoardDelete],
  },
}
