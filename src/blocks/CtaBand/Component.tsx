import React from 'react'
import { CalendarDays } from 'lucide-react'

import type { CtaBandBlock as CtaBandBlockProps } from '@/payload-types'
import { ChamferedCard } from '@/components/ChamferedCard'
import { CMSLink } from '@/components/Link'
import { Reveal } from '@/components/Reveal'
import { EYEBROW_CLS } from '@/components/SectionIntro'
import Topo from '@/components/Topo'

type Props = CtaBandBlockProps & { disableInnerContainer?: boolean }

export const CtaBandBlock: React.FC<Props> = ({ eyebrow, heading, intro, style, links }) => {
  const items = (links ?? []).filter((l) => l?.link?.label)

  if (style === 'splitTopo') {
    return (
      <section
        aria-labelledby="final-cta-heading"
        className="relative isolate overflow-hidden bg-ice text-navy-900 dark:bg-navy-900 dark:text-ice"
      >
        <Topo className="z-0" />
        {/* Top fade — dissolves topo in from the section above. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-ice to-transparent dark:from-navy-900"
        />

        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 py-28 sm:px-6 sm:py-32 lg:px-8">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              {eyebrow ? <p className={EYEBROW_CLS}>{eyebrow}</p> : null}
              <h2
                id="final-cta-heading"
                className="mt-3 font-display text-3xl leading-tight font-semibold tracking-tight text-navy-900 sm:text-4xl lg:text-5xl dark:text-ice"
              >
                {heading}
              </h2>
              {intro ? (
                <p className="mt-4 text-base leading-relaxed text-navy-800/80 sm:text-lg dark:text-ice/80">
                  {intro}
                </p>
              ) : null}
            </div>

            {items.length > 0 ? (
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                {items.map(({ link, id }, i) => (
                  <CMSLink
                    key={id ?? i}
                    {...link}
                    appearance={link.appearance ?? 'primary'}
                    size="lg"
                    className="shrink-0"
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    )
  }

  if (style === 'card') {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-20 sm:px-6 sm:pt-12 sm:pb-24 lg:px-8">
        <Reveal>
          <ChamferedCard className="border border-navy-900/10 bg-white/70 px-6 py-10 backdrop-blur-sm sm:px-10 sm:py-12 lg:px-14 lg:py-14 dark:border-ice/10 dark:bg-navy-900/50">
            {/* Decorative gold radial */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_85%_50%,rgba(201,168,92,0.10),transparent_70%)] dark:bg-[radial-gradient(60%_70%_at_85%_50%,rgba(201,168,92,0.18),transparent_70%)]"
            />

            <div className="flex w-full flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                {eyebrow ? (
                  <p className="mb-3 font-sans text-[11px] font-semibold tracking-[0.22em] text-chathams-700 uppercase sm:text-xs dark:text-gold">
                    {eyebrow}
                  </p>
                ) : null}
                <h2 className="font-display text-2xl font-semibold tracking-tight text-navy-900 sm:text-3xl lg:text-4xl dark:text-ice">
                  {heading}
                </h2>
                {intro ? (
                  <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-navy-800/75 sm:text-lg dark:text-ice/75">
                    {intro}
                  </p>
                ) : null}
              </div>

              {items.length > 0 ? (
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  {items.map(({ link, id }, i) => (
                    <CMSLink
                      key={id ?? i}
                      {...link}
                      appearance={link.appearance ?? 'primary'}
                      size="lg"
                      fullWidthOnMobile
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </ChamferedCard>
        </Reveal>
      </section>
    )
  }

  // Default: centered band (home page "Join the mission").
  return (
    <section className="relative bg-ice py-20 sm:py-28 dark:bg-navy-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          {eyebrow ? <p className={EYEBROW_CLS}>{eyebrow}</p> : null}
          <h2 className="mt-4 font-display text-3xl leading-[1.1] font-semibold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl dark:text-ice">
            {heading}
          </h2>
          {intro ? (
            <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-relaxed text-navy-800/75 sm:text-lg dark:text-ice/75">
              {intro}
            </p>
          ) : null}

          {items.length > 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              {items.map(({ link, id }, i) => {
                const showCalendar = i === 0 && /event/i.test(link.label ?? '')
                return (
                  <CMSLink
                    key={id ?? i}
                    {...link}
                    label={null}
                    appearance={link.appearance ?? (i === 0 ? 'solidDark' : 'secondary')}
                    size="lg"
                  >
                    {showCalendar ? <CalendarDays className="h-4 w-4" aria-hidden="true" /> : null}
                    {link.label}
                  </CMSLink>
                )
              })}
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  )
}
