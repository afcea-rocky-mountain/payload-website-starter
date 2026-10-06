import type { Block } from 'payload'

export const ContactBand: Block = {
  slug: 'contactBand',
  interfaceName: 'ContactBandBlock',
  labels: { singular: 'Contact band (address + email)', plural: 'Contact bands' },
  fields: [
    { name: 'addressLabel', type: 'text', defaultValue: 'Mailing Address' },
    { name: 'emailLabel', type: 'text', defaultValue: 'Email' },
    { name: 'email', type: 'email', admin: { description: 'Leave blank to use the STEM contact email from Site Settings.' } },
  ],
}
