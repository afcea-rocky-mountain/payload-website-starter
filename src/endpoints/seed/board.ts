import type { BoardMember } from '@/payload-types'

export type SeedBoardMember = Pick<
  BoardMember,
  'slug' | 'name' | 'postNominals' | 'role' | 'group' | 'email' | 'linkedin' | 'phone' | 'bio'
> & { photoFile?: string }

/** Chapter board roster — ported verbatim from the old site's leadership.yaml. */
export const boardSeed: SeedBoardMember[] = [
  // ── Executive Officers ──────────────────────────────────────────────────
  {
    slug: 'phil-parker',
    name: 'Phil Parker',
    postNominals: 'Lt Col, USAF (ret.)',
    role: 'President',
    group: 'exec',
    photoFile: 'phil-parker.avif',
    email: 'philparkerjr@gmail.com',
  },
  {
    slug: 'jason-simmons',
    name: 'Jason "Cueball" Simmons',
    postNominals: 'Lt Col, USAF (ret.)',
    role: 'Executive Vice President',
    group: 'exec',
    photoFile: 'jason-simmons.avif',
    email: 'Jason.Simmons@AFCEARockyMtn.org',
  },
  // ── Administration & Operations ─────────────────────────────────────────
  {
    slug: 'nikki-morgan',
    name: 'Yanikka "Nikki" Morgan',
    postNominals: 'TSgt, USSF',
    role: 'VP, Administration',
    group: 'admin',
    photoFile: 'nikki-morgan.avif',
    email: 'yaniqueone@hotmail.com',
  },
  {
    slug: 'rich-janoso',
    name: 'Rich Janoso',
    postNominals: 'Col, USAF (ret.)',
    role: 'VP, Finance',
    group: 'admin',
    photoFile: 'rich-janoso.avif',
    email: 'Rich.Janoso@gmail.com',
  },
  {
    slug: 'kristina-haley',
    name: 'Kristina Haley',
    postNominals: 'CMSgt, USAF (ret.)',
    role: 'VP, Conferences/Symposia',
    group: 'admin',
    photoFile: 'kristina-haley.avif',
    email: 'khaleysooner@gmail.com',
  },
  {
    slug: 'alisha-kelly',
    name: 'Alisha Kelly',
    role: 'VP, Memberships',
    group: 'admin',
    photoFile: 'alisha-kelly.avif',
    email: 'alisha.f.kelly@gmail.com',
  },
  {
    slug: 'anessa-funk',
    name: 'Anessa Funk',
    role: 'VP, Programs',
    group: 'admin',
    photoFile: 'anessa-funk.avif',
    email: 'anessa.funk@gmail.com',
  },
  // ── Programs & Education ────────────────────────────────────────────────
  {
    slug: 'brian-sroufe',
    name: 'Brian Sroufe',
    postNominals: 'Lt Col, USAF (ret.)',
    role: 'VP, Awards',
    group: 'programs',
    photoFile: 'brian-sroufe.avif',
    email: 'sroufe68@gmail.com',
  },
  {
    slug: 'russ-fellers',
    name: 'Russ Fellers',
    postNominals: 'Col, USAF (ret.)',
    role: 'VP, Education',
    group: 'programs',
    photoFile: 'russ-fellers.avif',
    email: 'rdfontheroad@gmail.com',
  },
  {
    slug: 'andrew-funk',
    name: 'Andrew Funk',
    role: 'VP, Emerging Leaders',
    group: 'programs',
    photoFile: 'andrew-funk.avif',
    email: 'afunk37@gmail.com',
  },
  {
    slug: 'mike-finn',
    name: 'Mike Finn',
    postNominals: 'Col, USAF (ret.)',
    role: 'VP, Endowments',
    group: 'programs',
    photoFile: 'mike-finn.avif',
    email: 'mifinn@deloitte.com',
  },
  // ── Strategy & Affairs ──────────────────────────────────────────────────
  {
    slug: 'cody-goodin',
    name: 'Cody Goodin',
    postNominals: 'MSgt, USSF',
    role: 'VP, Military Affairs',
    group: 'strategy',
    photoFile: 'cody-goodin.avif',
    // Legacy site routed contact via Stephen Basham; left blank until a direct address is confirmed.
  },
  {
    slug: 'shane-deichman',
    name: 'Shane Deichman',
    role: 'VP, Corporate Affairs',
    group: 'strategy',
    photoFile: 'shane-deichman.avif',
    email: 'Shane.Deichman@ngc.com',
  },
  {
    slug: 'shawn-murray',
    name: 'Shawn P. Murray',
    postNominals: 'Dr.',
    role: 'VP, Small Business',
    group: 'strategy',
    photoFile: 'shawn-murray.avif',
    email: 'shawn.murray@murraysecurityservices.com',
  },
  {
    slug: 'alex-morales',
    name: 'Alexander Morales',
    postNominals: 'GS-14, DAF',
    role: 'VP, Technology',
    group: 'strategy',
    photoFile: 'alex-morales.avif',
    email: 'amorales105501@gmail.com',
  },
  {
    slug: 'matt-denny',
    name: 'Matt "Mohawk" Denny',
    postNominals: 'USMC (ret.)',
    role: 'VP, Public Affairs',
    group: 'strategy',
    photoFile: 'matt-denny.avif',
    email: 'matt@denlyn.group',
  },
]
