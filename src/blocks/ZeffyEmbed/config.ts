import type { Block } from 'payload'

export const ZeffyEmbed: Block = {
  slug: 'zeffyEmbed',
  interfaceName: 'ZeffyEmbedBlock',
  labels: { singular: 'Zeffy payment form', plural: 'Zeffy payment forms' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description:
          'Zeffy form URL, e.g. https://www.zeffy.com/embed/ticketing/… or https://www.zeffy.com/en-US/ticketing/…',
      },
    },
    { name: 'height', type: 'number', defaultValue: 1200, min: 400, max: 4000 },
  ],
}
