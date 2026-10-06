import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateEvent, revalidateEventDelete } from './hooks/revalidateEvent'

export const eventTagOptions = [
  { label: 'Flagship', value: 'Flagship' },
  { label: 'STEM', value: 'STEM' },
  { label: 'Networking', value: 'Networking' },
  { label: 'Symposium', value: 'Symposium' },
  { label: 'Social', value: 'Social' },
  { label: 'Emerging Leaders', value: 'Emerging Leaders' },
  { label: 'Awards', value: 'Awards' },
]

/**
 * Events.
 *
 * Most events arrive via the Luma sync (source = "luma") and are kept in sync
 * automatically: title, dates, location, Luma URL and cover image are
 * overwritten on every sync. Everything in the "Chapter settings" tab is
 * editor-owned and never touched by the sync (featured, tag, blurb, Zeffy…).
 */
export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    startAt: true,
    endAt: true,
    dateDisplay: true,
    location: true,
    blurb: true,
    lumaUrl: true,
    featured: true,
    tag: true,
    coverImage: true,
    coverUrl: true,
    zeffy: true,
  },
  defaultSort: '-startAt',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startAt', 'location', 'featured', 'source', '_status'],
    group: 'Chapter',
    livePreview: {
      url: ({ data, req }) => generatePreviewPath({ slug: data?.slug, collection: 'events', req }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({ slug: data?.slug as string, collection: 'events', req }),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Event details',
          description: 'For Luma events these fields are refreshed by the sync.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'startAt',
                  type: 'date',
                  required: true,
                  admin: { date: { pickerAppearance: 'dayAndTime' }, width: '50%' },
                },
                {
                  name: 'endAt',
                  type: 'date',
                  admin: { date: { pickerAppearance: 'dayAndTime' }, width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'timezone',
                  type: 'text',
                  defaultValue: 'America/Denver',
                  admin: { width: '50%' },
                },
                {
                  name: 'dateDisplay',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description:
                      'Optional human override, e.g. "February 2–5, 2026" or "Date TBA". Leave blank to format from the start date.',
                  },
                },
              ],
            },
            {
              name: 'location',
              type: 'text',
              admin: { description: 'Short venue line, e.g. "The Broadmoor, Colorado Springs, CO".' },
            },
            { name: 'address', type: 'text', admin: { description: 'Full street address (optional).' } },
            {
              name: 'lumaUrl',
              type: 'text',
              admin: { description: 'RSVP link. Luma event page or any registration URL.' },
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Uploaded image. Takes priority over the Luma cover URL.' },
            },
            {
              name: 'coverUrl',
              type: 'text',
              admin: { readOnly: true, description: 'Cover image URL pulled from Luma.' },
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
              admin: { description: 'Long description shown on the event page.' },
            },
          ],
        },
        {
          label: 'Chapter settings',
          description: 'Editor-owned. Never overwritten by the Luma sync.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '33%', description: 'Show as the big card on the home and events pages.' },
                },
                {
                  name: 'hidden',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '33%', description: 'Keep in the CMS but hide from the website.' },
                },
                {
                  name: 'tag',
                  type: 'select',
                  options: eventTagOptions,
                  admin: { width: '34%', isClearable: true },
                },
              ],
            },
            {
              name: 'blurb',
              type: 'textarea',
              admin: { description: 'One or two sentences for cards. Luma does not provide this, so write it here.' },
            },
            {
              name: 'highlights',
              type: 'array',
              maxRows: 5,
              admin: { description: 'Short bullet points shown beside a featured event (e.g. "Four days of strategic dialogue").' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'zeffy',
              type: 'group',
              label: 'Zeffy payments',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Collect tickets / payments through Zeffy for this event',
                },
                {
                  name: 'url',
                  type: 'text',
                  admin: {
                    condition: (_, s) => Boolean(s?.enabled),
                    description: 'Zeffy ticketing or donation form URL.',
                  },
                },
                {
                  name: 'buttonLabel',
                  type: 'text',
                  defaultValue: 'Get tickets',
                  admin: { condition: (_, s) => Boolean(s?.enabled) },
                },
                {
                  name: 'embed',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Embed the Zeffy form on the event page (otherwise link out)',
                  admin: { condition: (_, s) => Boolean(s?.enabled) },
                },
                {
                  name: 'height',
                  type: 'number',
                  defaultValue: 1200,
                  admin: { condition: (_, s) => Boolean(s?.enabled && s?.embed) },
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    // Sidebar
    {
      name: 'source',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manual', value: 'manual' },
        { label: 'Luma', value: 'luma' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'lumaEventId',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Luma event api_id (evt-…).' },
    },
    {
      name: 'syncedAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateEvent],
    afterDelete: [revalidateEventDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 25,
  },
}
