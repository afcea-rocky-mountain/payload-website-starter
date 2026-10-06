import type { Field } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

/**
 * Page hero. The AFCEA site uses one hero style everywhere — the "Topo" hero
 * with a generated topographic canvas behind the headline — in two heights.
 */
export const hero: Field = {
  name: 'hero',
  type: 'group',
  label: false,
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'topo',
      label: 'Type',
      required: true,
      options: [
        { label: 'None', value: 'none' },
        { label: 'Topo hero', value: 'topo' },
      ],
    },
    {
      name: 'variant',
      type: 'radio',
      defaultValue: 'short',
      admin: {
        layout: 'horizontal',
        condition: (_, { type } = {}) => type === 'topo',
      },
      options: [
        { label: 'Tall (home page)', value: 'tall' },
        { label: 'Short (interior pages)', value: 'short' },
      ],
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: { condition: (_, { type } = {}) => type === 'topo' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        condition: (_, { type } = {}) => type === 'topo',
        description: 'Main headline.',
      },
    },
    {
      name: 'highlight',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'topo',
        description:
          'Optional. A phrase inside the title to render in the accent color (blue in light mode, gold in dark). Must match the title text exactly.',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      admin: { condition: (_, { type } = {}) => type === 'topo' },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          initCollapsed: true,
          condition: (_, { type } = {}) => type === 'topo',
        },
      },
    }),
    {
      name: 'showLocationPulse',
      type: 'checkbox',
      label: 'Show "Colorado Springs · Mountain Time" pulse line under the buttons',
      defaultValue: false,
      admin: { condition: (_, { type } = {}) => type === 'topo' },
    },
  ],
}
