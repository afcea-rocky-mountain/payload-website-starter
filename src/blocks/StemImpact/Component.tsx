import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { StemImpactBlock as StemImpactBlockProps } from '@/payload-types'
import { ChamferedCard } from '@/components/ChamferedCard'
import { Reveal } from '@/components/Reveal'
import { EYEBROW_CLS } from '@/components/SectionIntro'
import { DEFAULTS, getSiteSettings } from '@/utilities/getSiteSettings'

type Props = StemImpactBlockProps & { disableInnerContainer?: boolean }

function formatStemTotal(n: number): string {
  if (n >= 1000) return `$${Math.round(n / 1000)}K+`
  return `$${n}+`
}

export function partnerLabel(p: { partner: string; partnerShort?: string | null }): string {
  return p.partnerShort?.trim() || p.partner.split('(')[0].trim().split(',')[0].trim()
}

export const StemImpactBlock: React.FC<Props> = async ({
  eyebrow,
  statOverride,
  statCaption,
  aside,
  limit,
  linkLabel,
  linkPage,
}) => {
  const [payload, settings] = await Promise.all([
    getPayload({ config: configPromise }),
    getSiteSettings(0).catch(() => null),
  ])

  const { docs: programs } = await payload.find({
    collection: 'stem-programs',
    sort: ['-featured', 'order'],
    limit: limit ?? 4,
    depth: 0,
    pagination: false,
  })

  const total = statOverride ?? settings?.stemTotal ?? DEFAULTS.stemTotal

  let linkHref: string | null = null
  if (linkPage && typeof linkPage === 'object' && linkPage.slug) {
    linkHref = linkPage.slug === 'home' ? '/' : `/${linkPage.slug}`
  }

  return (
    <section className="relative overflow-hidden border-t border-navy-900/5 bg-ice py-20 sm:py-24 dark:border-ice/10 dark:bg-navy-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(201,168,92,0.10),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid grid-cols-1 items-end gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            {eyebrow ? <p className={EYEBROW_CLS}>{eyebrow}</p> : null}
            <div className="mt-4 flex items-baseline gap-4">
              <span className="font-display text-7xl leading-none font-semibold tracking-tight text-navy-900 sm:text-8xl lg:text-9xl dark:text-ice">
                {formatStemTotal(total)}
              </span>
            </div>
            {statCaption ? (
              <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-navy-800/75 sm:text-lg dark:text-ice/75">
                {statCaption}
              </p>
            ) : null}
          </div>
          {aside ? (
            <div className="lg:pb-3">
              <p className="font-sans text-base leading-relaxed text-navy-800/80 dark:text-ice/80">
                {aside}
              </p>
            </div>
          ) : null}
        </Reveal>

        {programs.length > 0 ? (
          <Reveal as="ul" stagger className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {programs.map((program) => (
              <Reveal as="li" item key={program.id} className="flex">
                <ChamferedCard className="flex h-full w-full flex-col border border-navy-900/10 bg-white/70 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-gold/40 sm:p-6 dark:border-ice/10 dark:bg-chathams-600/15 dark:hover:border-gold/40 dark:hover:bg-chathams-600/25">
                  <span className="font-sans text-xs font-semibold tracking-[0.18em] text-chathams-700 uppercase dark:text-gold">
                    {partnerLabel(program)}
                  </span>
                  <h3 className="mt-3 font-display text-lg leading-snug font-semibold tracking-tight text-navy-900 dark:text-ice">
                    {program.name}
                  </h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-navy-800/70 dark:text-ice/70">
                    {program.description}
                  </p>
                </ChamferedCard>
              </Reveal>
            ))}
          </Reveal>
        ) : null}

        {linkHref && linkLabel ? (
          <Reveal className="mt-10">
            <Link
              href={linkHref}
              className="group inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-chathams-600 transition-colors hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-chathams-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-gold dark:hover:text-gold/80"
            >
              {linkLabel}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
