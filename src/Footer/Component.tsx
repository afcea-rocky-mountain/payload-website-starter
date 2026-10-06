import Link from 'next/link'
import React from 'react'
import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { DEFAULTS, getSiteSettings } from '@/utilities/getSiteSettings'
import { resolveLinkHref } from '@/components/Link'
import { cn } from '@/utilities/ui'

const isExternal = (href: string) => /^(https?:)?\/\//i.test(href)

async function resolveContactEmail(fromSettings?: string | null): Promise<string> {
  if (fromSettings) return fromSettings
  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'board-members',
      where: { role: { equals: 'President' } },
      limit: 1,
      depth: 0,
      select: { email: true },
    })
    const email = res.docs?.[0]?.email
    if (email) return email
  } catch {
    /* fall through to default */
  }
  return DEFAULTS.contactEmail
}

function ExternalIcon() {
  return (
    <ArrowUpRight
      aria-hidden="true"
      className="h-3.5 w-3.5 translate-y-[1px] opacity-60 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100"
    />
  )
}

const FOOTER_LINK_CLS =
  'group inline-flex items-center gap-1.5 py-1.5 text-sm text-navy-800/75 transition-colors duration-200 hover:text-navy-900 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold rounded-sm dark:text-ice/70 dark:hover:text-ice'

function FooterLink({ href, label, newTab }: { href: string; label: string; newTab?: boolean | null }) {
  if (isExternal(href) || newTab) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={FOOTER_LINK_CLS}>
        <span>{label}</span>
        <ExternalIcon />
      </a>
    )
  }
  return (
    <Link href={href} className={FOOTER_LINK_CLS}>
      <span>{label}</span>
    </Link>
  )
}

export async function Footer() {
  const [footerData, siteSettings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getSiteSettings(0),
  ])
  const contactEmail = await resolveContactEmail(siteSettings?.contactEmail)

  const year = new Date().getFullYear()
  const siteName = siteSettings?.siteName || DEFAULTS.siteName
  const shortName = siteSettings?.shortName || DEFAULTS.shortName
  const columns = footerData?.columns || []
  const affiliation = footerData?.affiliation
  const address = siteSettings?.address

  return (
    <footer className="relative border-t border-navy-900/10 bg-ice text-navy-900 dark:border-ice/10 dark:bg-chathams-800 dark:text-ice">
      {/* Top hairline accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
      />

      <div
        className={cn(
          'mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:px-8 lg:py-20',
          columns.length >= 2 ? 'md:grid-cols-3' : columns.length === 1 ? 'md:grid-cols-2' : '',
        )}
      >
        {/* Col 1 — Brand */}
        <div className="space-y-5">
          <Link
            href="/"
            className="inline-flex items-center rounded-md focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label={`${siteName} — Home`}
          >
            <span className="font-display text-lg leading-none font-semibold tracking-tight">
              {shortName}
            </span>
          </Link>
          {footerData?.tagline ? (
            <p className="max-w-sm text-sm leading-relaxed text-navy-800/80 dark:text-ice/70">
              {footerData.tagline}
            </p>
          ) : null}
          {affiliation?.label ? (
            <p className="text-sm leading-relaxed text-navy-800/75 dark:text-ice/65">
              {affiliation.prefix ? `${affiliation.prefix} ` : ''}
              {affiliation.url ? (
                <a
                  href={affiliation.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-medium text-navy-900 underline decoration-gold/60 underline-offset-4 transition hover:decoration-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold dark:text-ice"
                >
                  {affiliation.label}
                </a>
              ) : (
                <span className="font-medium text-navy-900 dark:text-ice">{affiliation.label}</span>
              )}
              .
            </p>
          ) : null}
          <ul className="space-y-2 text-sm text-navy-800/80 dark:text-ice/70">
            {address?.line1 || address?.line2 ? (
              <li className="flex items-start gap-2">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-chathams-600 dark:text-gold"
                />
                <span>
                  {address?.line1}
                  {address?.line1 && address?.line2 ? <br /> : null}
                  {address?.line2}
                </span>
              </li>
            ) : null}
            <li className="flex items-start gap-2">
              <Mail
                aria-hidden="true"
                className="mt-1 h-4 w-4 shrink-0 text-chathams-600 dark:text-gold"
              />
              <a
                href={`mailto:${contactEmail}?subject=AFCEA%20Rocky%20Mountain%20Chapter%20Inquiry`}
                className="block break-all rounded-sm py-1 transition-colors duration-200 hover:text-navy-900 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold dark:hover:text-ice"
              >
                {contactEmail}
              </a>
            </li>
          </ul>
        </div>

        {columns.map((col, ci) => (
          <nav key={col.id ?? ci} aria-label={`${col.title} links`}>
            <h3 className="font-display text-sm font-semibold tracking-widest text-chathams-700 uppercase dark:text-gold">
              {col.title}
            </h3>
            <ul className="mt-5 space-y-3">
              {(col.links || []).map(({ link }, li) => {
                const href = resolveLinkHref(link)
                if (!href) return null
                return (
                  <li key={li}>
                    <FooterLink href={href} label={link.label} newTab={link.newTab} />
                  </li>
                )
              })}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom strip */}
      <div className="border-t border-navy-900/10 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-navy-800/65 sm:flex-row sm:items-center sm:px-6 lg:px-8 dark:text-ice/55">
          <p>
            &copy; {year} {siteName}. All rights reserved.
          </p>
          {footerData?.bottomNote ? (
            <p className="text-navy-800/55 dark:text-ice/45">{footerData.bottomNote}</p>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
