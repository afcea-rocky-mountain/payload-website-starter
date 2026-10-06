import type { Block } from 'payload'

export const boardGroupOptions = [
  { label: 'Executive Officers', value: 'exec' },
  { label: 'Administration & Operations', value: 'admin' },
  { label: 'Programs & Education', value: 'programs' },
  { label: 'Strategy & Affairs', value: 'strategy' },
]

export const LeadershipBoard: Block = {
  slug: 'leadershipBoard',
  interfaceName: 'LeadershipBoardBlock',
  labels: { singular: 'Leadership board', plural: 'Leadership boards' },
  fields: [
    {
      name: 'groups',
      type: 'array',
      admin: {
        description: 'Sections to render, in order. Members come from the Board Members collection.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'group', type: 'select', options: boardGroupOptions, required: true, admin: { width: '40%' } },
            { name: 'eyebrow', type: 'text', admin: { width: '30%' } },
            { name: 'title', type: 'text', required: true, admin: { width: '30%' } },
          ],
        },
        {
          name: 'layout',
          type: 'radio',
          defaultValue: 'grid',
          admin: { layout: 'horizontal' },
          options: [
            { label: 'Four-up grid', value: 'grid' },
            { label: 'Large two-up (executive)', value: 'feature' },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Get involved card',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'eyebrow', type: 'text', defaultValue: 'Get involved' },
        { name: 'heading', type: 'text', defaultValue: 'Interested in serving the chapter?' },
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            'Reach out to the board to learn about open volunteer roles, committee opportunities, and how to support our mission across Colorado, Wyoming, and New Mexico.',
        },
        { name: 'buttonLabel', type: 'text', defaultValue: 'Contact the Board' },
        {
          name: 'email',
          type: 'email',
          admin: { description: 'Leave blank to use the President\'s email from Board Members.' },
        },
      ],
    },
  ],
}
