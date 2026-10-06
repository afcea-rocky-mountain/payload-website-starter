import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { draftMode } from 'next/headers'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import ChamferBloom from '@/components/ChamferBloom'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getServerSideURL } from '@/utilities/getURL'
import { SITE_DESCRIPTION, SITE_NAME, mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { cn } from '@/utilities/ui'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  // Variable font: full weight range plus the optical-size axis.
  weight: 'variable',
  axes: ['opsz'],
  variable: '--font-fraunces',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(inter.variable, fraunces.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicon-32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/logo.avif" rel="apple-touch-icon" />
      </head>
      <body className="flex min-h-screen flex-col bg-ice text-navy-900 dark:bg-navy-900 dark:text-ice">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-ice focus-visible:outline-2 focus-visible:outline-gold dark:focus:bg-gold dark:focus:text-navy-900"
          >
            Skip to content
          </a>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <ChamferBloom />
        </Providers>
      </body>
    </html>
  )
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e8eef7' },
    { media: '(prefers-color-scheme: dark)', color: '#01032d' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AFCEA Rocky Mtn',
  },
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
