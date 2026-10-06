import type { RequiredDataFromCollectionSlug } from 'payload'

import { LUMA_CALENDAR } from './events'

export const MEMBERSHIP_URL = 'https://www.afcea.org/site/?q=Membership'
export const STEM_EMAIL = 'rdfontheroad@gmail.com'

type PageData = RequiredDataFromCollectionSlug<'pages'>

const custom = (
  url: string,
  label: string,
  appearance: 'primary' | 'secondary' | 'solidDark' | 'link',
  newTab = false,
) => ({ link: { type: 'custom' as const, url, label, appearance, newTab } })

export const homePage = ({ stemGrantPageId }: { stemGrantPageId: number }): PageData => ({
  title: 'Home',
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'topo',
    variant: 'tall',
    eyebrow: 'AFCEA Rocky Mountain Chapter',
    title: 'The Rocky Mountain\nCyber and Defense community.',
    highlight: 'Cyber and Defense',
    subtitle:
      'A leader in the Colorado Springs region, bringing together military, government, industry, and academia to advance STEM education and the next generation of technical leaders. Serving Colorado, Wyoming, and New Mexico.',
    links: [
      custom('/events', 'Upcoming Events', 'primary'),
      custom(MEMBERSHIP_URL, 'Become a Member', 'secondary', true),
    ],
    showLocationPulse: true,
  },
  layout: [
    {
      blockType: 'missionPillars',
      eyebrow: 'Our Mission',
      heading: 'Four communities. One regional force for STEM.',
      intro:
        "We unify the area's military, government, industry, and academic partners to advance the continuing education of today's young leaders in science, technology, engineering, math, and computer science fields.",
      pillars: [
        {
          icon: 'shield',
          title: 'Military',
          body: 'Connecting active-duty, Guard, Reserve, and retired service members across NORTHCOM, NORAD, Space Force, and Air Force communities of the Rocky Mountain region.',
        },
        {
          icon: 'landmark',
          title: 'Government',
          body: 'Convening federal civilians and mission partners across NORTHCOM, NORAD, Space Force, and the broader interagency advancing national security in the region.',
        },
        {
          icon: 'briefcase',
          title: 'Industry',
          body: 'Bringing together primes, small businesses, and emerging tech firms shaping cyberspace operations, defense systems, and dual-use innovation.',
        },
        {
          icon: 'graduationCap',
          title: 'Academia',
          body: 'Partnering with UCCS, K-12 educators, and STEM programs to invest in the next generation of cyber, engineering, and technical leaders.',
        },
      ],
    },
    {
      blockType: 'featuredEvent',
      eyebrow: "What's Next",
      heading: 'On the chapter calendar next.',
      mode: 'auto',
      viewAllLabel: 'View all events',
    },
    {
      blockType: 'stemImpact',
      eyebrow: 'STEM Impact',
      statCaption:
        'invested in STEM education across the Rocky Mountain region in 2023, including scholarships, classroom grants, and youth programs.',
      aside:
        'Every dollar funds a learner, an educator, or a program building the technical workforce our region and our nation needs next.',
      limit: 4,
      linkLabel: 'See all programs',
      linkPage: stemGrantPageId,
    },
    {
      blockType: 'promoBand',
      eyebrow: 'Flagship Event',
      headingParts: [{ text: 'RMCS26' }, { text: 'The Broadmoor' }, { text: 'February 2–5, 2026' }],
      body:
        'Four days where senior leaders from across the Department of Defense, federal agencies, industry, and academia gather to shape the future of cyberspace operations, emerging technology, and national security.',
      link: { type: 'custom', url: LUMA_CALENDAR, label: 'Reserve your spot', appearance: 'primary', newTab: true },
    },
    {
      blockType: 'ctaBand',
      style: 'centered',
      eyebrow: 'Join the chapter',
      heading: 'Join the mission for 2026.',
      intro:
        'Meet the people building cyber and STEM capability across Colorado, Wyoming, and New Mexico, at our events, in our programs, and through AFCEA membership.',
      links: [
        custom('/events', 'See upcoming events', 'solidDark'),
        custom(MEMBERSHIP_URL, 'Join AFCEA', 'secondary', true),
      ],
    },
  ],
  meta: {
    title: 'AFCEA Rocky Mountain Chapter',
    description:
      'Unifying the Rocky Mountain cyber and defense community. Events, leadership, and STEM grants.',
  },
})

export const eventsPage: PageData = {
  title: 'Events',
  slug: 'events',
  _status: 'published',
  hero: {
    type: 'topo',
    variant: 'short',
    eyebrow: 'Calendar',
    title: 'Upcoming Events',
    subtitle:
      'Network with the Rocky Mountain chapter at our monthly events, technical symposia, and STEM showcases.',
    links: [
      custom(LUMA_CALENDAR, 'View full calendar on Luma', 'solidDark', true),
      custom(LUMA_CALENDAR, 'Open on Luma', 'secondary', true),
    ],
  },
  layout: [
    {
      blockType: 'eventsGrid',
      showFeatured: true,
      eyebrow: 'Highlights',
      heading: "What's on the chapter calendar",
      intro:
        'From monthly networking to STEM outreach and emerging-leader mixers, our calendar reflects the breadth of the Rocky Mountain community we serve across Colorado, Wyoming, and New Mexico.',
      scope: 'upcoming',
      limit: 12,
      allEventsLabel: 'All events on Luma',
      emptyMessage: 'No additional events scheduled. Check Luma for the latest calendar.',
    },
    {
      blockType: 'ctaBand',
      style: 'splitTopo',
      eyebrow: 'Stay connected',
      heading: "Don't miss the next one.",
      intro:
        'Follow the chapter on Luma to get notified about RMCS, monthly networking, STEM showcases, and emerging-leader programs.',
      links: [custom(LUMA_CALENDAR, 'Follow the chapter on Luma', 'primary', true)],
    },
  ],
  meta: {
    title: 'Upcoming Events',
    description:
      'Network with the AFCEA Rocky Mountain chapter at our monthly events, technical symposia, and STEM showcases.',
  },
}

export const leadershipPage: PageData = {
  title: 'Leadership',
  slug: 'leadership',
  _status: 'published',
  hero: {
    type: 'topo',
    variant: 'short',
    eyebrow: 'The Board',
    title: 'Chapter Leadership',
    subtitle:
      'A volunteer board of military, government, industry, and academic leaders advancing the Rocky Mountain mission.',
  },
  layout: [
    {
      blockType: 'leadershipBoard',
      groups: [
        { group: 'exec', eyebrow: 'Leading the chapter', title: 'Executive Officers', layout: 'feature' },
        { group: 'admin', eyebrow: 'Group I', title: 'Administration & Operations', layout: 'grid' },
        { group: 'programs', eyebrow: 'Group II', title: 'Programs & Education', layout: 'grid' },
        { group: 'strategy', eyebrow: 'Group III', title: 'Strategy & Affairs', layout: 'grid' },
      ],
      cta: {
        enabled: true,
        eyebrow: 'Get involved',
        heading: 'Interested in serving the chapter?',
        body:
          'Reach out to the board to learn about open volunteer roles, committee opportunities, and how to support our mission across Colorado, Wyoming, and New Mexico.',
        buttonLabel: 'Contact the Board',
      },
    },
  ],
  meta: {
    title: 'Chapter Leadership',
    description:
      'Meet the volunteer board of military, government, industry, and academic leaders advancing the AFCEA Rocky Mountain mission.',
  },
}

export const stemGrantPage: PageData = {
  title: 'STEM Grant',
  slug: 'stem-grant',
  _status: 'published',
  hero: {
    type: 'topo',
    variant: 'short',
    eyebrow: 'STEM Initiatives',
    title: 'Investing in the Next Generation of Innovators',
    subtitle:
      'AFCEA Rocky Mountain Chapter funds STEM scholarships, teacher grants, and youth programs across Colorado, Wyoming, and New Mexico.',
    links: [custom('#apply', 'Apply for a Grant', 'primary')],
  },
  layout: [
    {
      blockType: 'stemPrograms',
      showImpactStat: true,
      impactEyebrow: '2023 Community Impact',
      impactCaption: 'invested in 2023 alone.',
      impactBody:
        "Our chapter directs corporate sponsorships, conference proceeds, and member contributions back into the region's classrooms, campuses, and youth programs. Every dollar advances STEM access, cyber readiness, and pathways for the engineers, operators, and innovators of tomorrow.",
      eyebrow: 'Where the Funding Goes',
      heading: 'Programs We Fund',
      intro:
        'A portfolio of partners working at every level of the STEM pipeline, from elementary literacy to workforce credentials.',
    },
    {
      blockType: 'eligibility',
      eyebrow: 'Who Can Apply',
      heading: 'Eligibility',
      intro:
        'We support educators, programs, and organizations advancing STEM across the Rocky Mountain region.',
      items: [
        { text: 'K-12 teachers, school programs, or non-profits serving students in Colorado, Wyoming, or New Mexico.' },
        { text: 'Priority for Title I schools, rural districts, and historically underserved communities.' },
        { text: 'Demonstrable impact on STEM, cybersecurity, or computer science education and workforce readiness.' },
        { text: 'Alignment with the AFCEA Rocky Mountain Chapter mission to advance the next generation of innovators.' },
      ],
    },
    {
      blockType: 'proposeProgram',
      anchor: 'apply',
      eyebrow: 'STEM Funding',
      heading: 'Propose a Program',
      body: `Email a 1-page proposal to ${STEM_EMAIL} outlining your program, audience, budget request, and intended outcomes. The chapter board reviews proposals on a rolling basis.`,
      email: STEM_EMAIL,
      links: [
        custom(`mailto:${STEM_EMAIL}?subject=STEM%20Grant%20Application`, 'Email the Chapter', 'primary'),
        custom('#programs', 'See programs we fund', 'secondary'),
      ],
    },
    {
      blockType: 'contactBand',
      addressLabel: 'Mailing Address',
      emailLabel: 'Email',
      email: STEM_EMAIL,
    },
  ],
  meta: {
    title: 'STEM Grant',
    description:
      'AFCEA Rocky Mountain Chapter funds STEM scholarships, teacher grants, and youth programs across Colorado, Wyoming, and New Mexico.',
  },
}
