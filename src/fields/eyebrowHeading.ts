import type { Field } from 'payload'

/**
 * Shared "section intro" fields: small uppercase eyebrow, display heading,
 * and an optional intro paragraph. Used by most AFCEA blocks.
 */
export const eyebrowHeadingFields = (opts?: {
  headingRequired?: boolean
  withIntro?: boolean
}): Field[] => {
  const fields: Field[] = [
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: { width: '40%', description: 'Small uppercase label above the heading.' },
        },
        {
          name: 'heading',
          type: 'text',
          required: opts?.headingRequired ?? false,
          admin: { width: '60%' },
        },
      ],
    },
  ]
  if (opts?.withIntro ?? true) {
    fields.push({
      name: 'intro',
      type: 'textarea',
      admin: { description: 'Optional short paragraph under the heading.' },
    })
  }
  return fields
}
