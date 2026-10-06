import React, { Fragment } from 'react'
import { ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react'

import type { Page, SiteSetting } from '@/payload-types'

import Button from '@/components/Button'
import { resolveLinkHref } from '@/components/Link'
import TopoHero from '@/heros/TopoHero'
import { DEFAULTS } from '@/utilities/getSiteSettings'

export type RenderHeroProps = Page['hero'] & {
  siteSettings?: SiteSetting | null
}

/**
 * Render the hero title: `highlight` phrase gets the accent color, "\n" in the
 * title becomes a desktop-only line break.
 */
export function renderHeroTitle(title: string, highlight?: string | null): React.ReactNode {
  const lines = title.split('\n')
  return lines.map((line, li) => {
    let content: React.ReactNode = line
    const hl = highlight?.trim()
    if (hl && line.includes(hl)) {
      const [before, ...rest] = line.split(hl)
      const after = rest.join(hl)
      content = (
        <>
          {before}
          <span className="text-chathams-600 dark:text-gold">{hl}</span>
          {after}
        </>
      )
    }
    return (
      <Fragment key={li}>
        {li > 0 ? <br className="hidden sm:block" /> : null}
        {li > 0 ? ' ' : null}
        {content}
      </Fragment>
    )
  })
}

export const RenderHero: React.FC<RenderHeroProps> = (props) => {
  const { type, variant, eyebrow, title, highlight, subtitle, links, showLocationPulse, siteSettings } =
    props || {}

  if (!type || type === 'none') return null

  const ctas = Array.isArray(links) ? links.filter((l) => l?.link) : []

  return (
    <TopoHero
      variant={variant === 'tall' ? 'tall' : 'short'}
      eyebrow={eyebrow}
      title={renderHeroTitle(title || siteSettings?.siteName || DEFAULTS.siteName, highlight)}
      subtitle={subtitle || undefined}
    >
      {ctas.length > 0 || showLocationPulse ? (
        <div className="flex w-full flex-col items-start gap-6">
          {ctas.length > 0 ? (
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              {ctas.map(({ link }, i) => {
                const href = resolveLinkHref(link)
                if (!href) return null
                const external = /^(https?:)?\/\//i.test(href)
                const isEvents = /event/i.test(link.label ?? '')
                const Arrow = external ? ArrowUpRight : ArrowRight
                return (
                  <Button
                    key={i}
                    href={href}
                    newTab={Boolean(link.newTab) || external}
                    variant={link.appearance ?? (i === 0 ? 'primary' : 'secondary')}
                    size="md"
                    fullWidthOnMobile
                  >
                    {isEvents ? <CalendarDays className="h-4 w-4" aria-hidden="true" /> : null}
                    {link.label}
                    <Arrow
                      className={
                        external
                          ? 'h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                          : 'h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5'
                      }
                      aria-hidden="true"
                    />
                  </Button>
                )
              })}
            </div>
          ) : null}

          {showLocationPulse ? (
            <div className="flex items-center gap-2.5 font-sans text-xs tracking-widest text-navy-800/70 uppercase dark:text-ice/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-slow-pulse absolute inline-flex h-full w-full rounded-full bg-gold opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              <span>{siteSettings?.regionLine || 'Colorado Springs'}</span>
              <span aria-hidden="true" className="opacity-40">
                ·
              </span>
              <span>{siteSettings?.timezoneLabel || 'Mountain Time'}</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </TopoHero>
  )
}
