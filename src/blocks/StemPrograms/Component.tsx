import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { StemProgramsBlock as StemProgramsBlockProps } from '@/payload-types'
import { ChamferedCard } from '@/components/ChamferedCard'
import { CountUp } from '@/components/CountUp'
import { Reveal } from '@/components/Reveal'
import { DEFAULTS, getSiteSettings } from '@/utilities/getSiteSettings'

type Props = StemProgramsBlockProps & { disableInnerContainer?: boolean }

const EYEBROW =
  'font-sans text-xs font-semibold tracking-[0.22em] text-chathams-700 uppercase sm:text-sm dark:text-gold'

export const StemProgramsBlock: React.FC<Props> = async ({
  eyebrow,
  heading,
  intro,
  showImpactStat,
  impactEyebrow,
  impactCaption,
  impactBody,
}) => {
  const [payload, settings] = await Promise.all([
    getPayload({ config: configPromise }),
    showImpactStat ? getSiteSettings(0).catch(() => null) : Promise.resolve(null),
  ])

  const { docs: programs } = await payload.find({
    collection: 'stem-programs',
    sort: 'order',
    limit: 100,
    depth: 0,
    pagination: false,
  })

  const total = settings?.stemTotal ?? DEFAULTS.stemTotal

  return (
    <>
      {showImpactStat ? (
        <section className="relative overflow-hidden border-b border-navy-900/5 dark:border-ice/10">
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
              {impactEyebrow ? <p className={EYEBROW}>{impactEyebrow}</p> : null}
              <Reveal
                as="h2"
                className="mt-6 font-display text-6xl leading-none font-semibold tracking-tight text-navy-900 sm:text-7xl lg:text-8xl dark:text-ice"
              >
                <CountUp to={total} />
              </Reveal>
              {impactCaption ? (
                <p className="mt-4 font-display text-xl font-medium text-navy-800/80 sm:text-2xl dark:text-ice/80">
                  {impactCaption}
                </p>
              ) : null}
              {impactBody ? (
                <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-navy-800/75 sm:text-lg dark:text-ice/70">
                  {impactBody}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section id="programs" className="relative scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {eyebrow ? <p className={EYEBROW}>{eyebrow}</p> : null}
            <h2 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight text-navy-900 sm:text-5xl dark:text-ice">
              {heading}
            </h2>
            {intro ? (
              <p className="mt-5 text-base leading-relaxed text-navy-800/75 sm:text-lg dark:text-ice/70">
                {intro}
              </p>
            ) : null}
          </div>

          {programs.length > 0 ? (
            <ul className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
              {programs.map((program, idx) => (
                <Reveal
                  as="li"
                  key={program.id}
                  delay={Math.min(idx * 0.05, 0.3)}
                  className="flex"
                >
                  <ChamferedCard className="flex h-full w-full flex-col border border-navy-900/10 bg-white p-8 transition-colors duration-300 hover:border-gold/40 dark:border-ice/10 dark:bg-chathams-600/20 dark:hover:border-gold/40">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-px left-8 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <p className="font-sans text-[0.68rem] font-semibold tracking-[0.18em] text-chathams-700 uppercase dark:text-gold">
                      {program.partner}
                    </p>
                    <h3 className="mt-3 font-display text-2xl leading-tight font-semibold tracking-tight text-navy-900 dark:text-ice">
                      {program.name}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-navy-800/75 sm:text-base dark:text-ice/70">
                      {program.description}
                    </p>
                    {program.link ? (
                      <a
                        href={program.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-5 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-chathams-600 underline-offset-4 transition hover:underline dark:text-gold"
                      >
                        Learn more
                      </a>
                    ) : null}
                  </ChamferedCard>
                </Reveal>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  )
}
