import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Events } from './collections/Events'
import { BoardMembers } from './collections/BoardMembers'
import { StemPrograms } from './collections/StemPrograms'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { SiteSettings } from './SiteSettings/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { syncLumaEventsTask } from './luma/task'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      beforeDashboard: ['@/components/BeforeDashboard'],
      beforeLogin: ['@/components/BeforeLogin'],
      graphics: {
        Logo: '@/components/AdminLogo#AdminLogo',
        Icon: '@/components/AdminLogo#AdminIcon',
      },
    },
    // Replace every trace of default Payload branding (tab icon, share card, titles).
    meta: {
      titleSuffix: ' · AFCEA Rocky Mountain',
      description: 'Content management for the AFCEA Rocky Mountain Chapter website.',
      icons: [
        { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32.png' },
      ],
      openGraph: {
        siteName: 'AFCEA Rocky Mountain Chapter',
        description: 'Content management for the AFCEA Rocky Mountain Chapter website.',
        images: [{ url: '/og.png', width: 1200, height: 630, alt: 'AFCEA Rocky Mountain Chapter' }],
      },
      robots: 'noindex, nofollow',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  editor: defaultLexical,
  serverURL: getServerSideURL(),
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  collections: [Pages, Events, BoardMembers, StemPrograms, Media, Users],
  cors: [getServerSideURL()].filter(Boolean),
  plugins: [
    ...plugins,
    // Vercel Blob is used in production; locally (no token) media falls back to public/media.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  globals: [Header, Footer, SiteSettings],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const secret = process.env.CRON_SECRET
        if (!secret) return false
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [syncLumaEventsTask],
  },
})
