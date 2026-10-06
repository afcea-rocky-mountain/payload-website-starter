export const LUMA_CALENDAR = 'https://luma.com/afcea-rocky-mountain'

/**
 * Editor-owned enrichments applied to Luma-synced events whose title matches.
 * Luma is the source of truth for dates/venues; this only adds the chapter's
 * own copy (blurb, tag, featured flag, highlights) so the home/events pages
 * look like the original site right after seeding + first sync.
 */
export type LumaEnrichment = {
  match: RegExp
  data: {
    featured?: boolean
    tag?: 'Flagship' | 'STEM' | 'Networking' | 'Symposium' | 'Social' | 'Emerging Leaders' | 'Awards'
    blurb?: string
    highlights?: { text: string }[]
  }
}

export const lumaEnrichments: LumaEnrichment[] = [
  {
    match: /cyberspace symposium|RMCS/i,
    data: {
      featured: true,
      tag: 'Flagship',
      blurb:
        "The chapter's flagship annual event, convening senior leaders from government, military, industry, and academia for four days of strategic dialogue on cyberspace operations, emerging technology, and national security.",
      highlights: [
        { text: 'Four days of strategic dialogue' },
        { text: 'Senior leaders from gov, mil, industry, academia' },
        { text: 'Cyberspace, emerging tech, national security' },
      ],
    },
  },
  {
    match: /pikes? peak robotics/i,
    data: {
      tag: 'STEM',
      blurb:
        'An annual robotics showcase celebrating K-12 and collegiate teams with live demonstrations, mentorship, and STEM education programming for the next generation of engineers.',
    },
  },
  { match: /networking social|space social|afterdark/i, data: { tag: 'Social' } },
  { match: /mentor/i, data: { tag: 'Emerging Leaders' } },
  { match: /cyber connections/i, data: { tag: 'Networking' } },
]
