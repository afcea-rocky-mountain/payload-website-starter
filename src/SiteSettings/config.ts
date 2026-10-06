import type { GlobalConfig } from 'payload'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Site' },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Chapter',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'siteName', type: 'text', required: true, defaultValue: 'AFCEA Rocky Mountain Chapter', admin: { width: '50%' } },
                { name: 'shortName', type: 'text', defaultValue: 'AFCEA Rocky Mountain', admin: { width: '25%', description: 'Wordmark in the header.' } },
                { name: 'tinyName', type: 'text', defaultValue: 'AFCEA RM', admin: { width: '25%', description: 'Wordmark on small phones.' } },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              defaultValue:
                'AFCEA Rocky Mountain Chapter — unifying military, government, industry, and academia across Colorado, Wyoming, and New Mexico to advance STEM education and the cyber & defense community.',
              admin: { description: 'Default meta description and Open Graph description.' },
            },
            { name: 'ogImage', type: 'upload', relationTo: 'media', admin: { description: 'Default social share image (1200×630).' } },
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'line1', type: 'text', defaultValue: 'PO Box 63054' },
                { name: 'line2', type: 'text', defaultValue: 'Colorado Springs, CO 80962' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'contactEmail',
                  type: 'email',
                  admin: { width: '50%', description: 'General chapter inquiries. Leave blank to use the President\'s email from Board Members.' },
                },
                {
                  name: 'stemEmail',
                  type: 'email',
                  defaultValue: 'rdfontheroad@gmail.com',
                  admin: { width: '50%', description: 'STEM grant proposals (VP, Education).' },
                },
              ],
            },
            {
              name: 'regionLine',
              type: 'text',
              defaultValue: 'Colorado Springs',
              admin: { description: 'Shown next to the pulsing dot in the home hero.' },
            },
            { name: 'timezoneLabel', type: 'text', defaultValue: 'Mountain Time' },
          ],
        },
        {
          label: 'Links & integrations',
          fields: [
            { name: 'membershipUrl', type: 'text', defaultValue: 'https://www.afcea.org/site/?q=Membership', admin: { description: 'AFCEA International membership page.' } },
            {
              name: 'luma',
              type: 'group',
              label: 'Luma',
              fields: [
                { name: 'calendarUrl', type: 'text', defaultValue: 'https://luma.com/afcea-rocky-mountain', admin: { description: 'Public calendar page.' } },
                { name: 'calendarApiId', type: 'text', defaultValue: 'cal-B3ppeWVbSPa2fCP', admin: { description: 'Luma calendar id (cal-…). Used by the event sync.' } },
                { name: 'syncEnabled', type: 'checkbox', defaultValue: true, label: 'Sync events from Luma automatically' },
                { name: 'includePast', type: 'checkbox', defaultValue: true, label: 'Also import past events' },
                { name: 'lastSyncedAt', type: 'date', admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
                { name: 'lastSyncSummary', type: 'text', admin: { readOnly: true } },
              ],
            },
            {
              name: 'zeffy',
              type: 'group',
              label: 'Zeffy',
              fields: [
                { name: 'donateUrl', type: 'text', admin: { description: 'Optional general donation form URL.' } },
              ],
            },
          ],
        },
        {
          label: 'STEM',
          fields: [
            { name: 'stemTotal', type: 'number', defaultValue: 500000, admin: { description: 'Total invested, used for the "$500K+" stat.' } },
            { name: 'stemTotalYear', type: 'text', defaultValue: '2023' },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
