import React from 'react'

import type { MissionPillarsBlock as MissionPillarsBlockProps } from '@/payload-types'
import { ChamferedCard } from '@/components/ChamferedCard'
import { Reveal } from '@/components/Reveal'
import { SectionIntro } from '@/components/SectionIntro'
import { iconFor } from '@/components/icons'

type Props = MissionPillarsBlockProps & { disableInnerContainer?: boolean }

export const MissionPillarsBlock: React.FC<Props> = ({ eyebrow, heading, intro, pillars }) => {
  const items = pillars ?? []

  return (
    <section className="relative bg-ice py-20 sm:py-24 dark:bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionIntro eyebrow={eyebrow} heading={heading} intro={intro} align="center" />
        </Reveal>

        {items.length > 0 ? (
          <Reveal
            as="ul"
            stagger
            className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 md:gap-7 lg:grid-cols-4"
          >
            {items.map((pillar) => {
              const Icon = iconFor(pillar.icon)
              return (
                <Reveal as="li" item key={pillar.id ?? pillar.title} className="flex">
                  <ChamferedCard className="w-full border border-navy-900/10 bg-white/60 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-navy-900/30 sm:p-7 dark:border-ice/10 dark:bg-chathams-600/15 dark:hover:border-gold/40 dark:hover:bg-chathams-600/25">
                    <div className="relative">
                      <span className="inline-flex h-12 w-12 items-center justify-center bg-gold/15 text-gold ring-1 ring-gold/30">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-navy-900 dark:text-ice">
                        {pillar.title}
                      </h3>
                      <p className="mt-3 font-sans text-sm leading-relaxed text-navy-800/75 dark:text-ice/75">
                        {pillar.body}
                      </p>
                    </div>
                  </ChamferedCard>
                </Reveal>
              )
            })}
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
