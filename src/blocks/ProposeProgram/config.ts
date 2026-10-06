import type { Block } from 'payload'
import { linkGroup } from '@/fields/linkGroup'

export const ProposeProgram: Block = {
  slug: 'proposeProgram',
  interfaceName: 'ProposeProgramBlock',
  labels: { singular: 'Dark CTA card (propose a program)', plural: 'Dark CTA cards' },
  fields: [
    { name: 'anchor', type: 'text', defaultValue: 'apply', admin: { description: 'HTML id so links like #apply can scroll here.' } },
    { name: 'eyebrow', type: 'text', defaultValue: 'STEM Funding' },
    { name: 'heading', type: 'text', required: true, defaultValue: 'Propose a Program' },
    {
      name: 'body',
      type: 'textarea',
      admin: { description: 'The email below is linked automatically where it appears in this text.' },
    },
    { name: 'email', type: 'email', admin: { description: 'Leave blank to use the STEM contact email from Site Settings.' } },
    linkGroup({ overrides: { maxRows: 2 } }),
  ],
}
