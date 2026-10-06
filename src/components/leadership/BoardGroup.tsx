import React from 'react'

import type { BoardMember } from '@/payload-types'
import { EYEBROW_CLS } from '@/components/SectionIntro'
import { cn } from '@/utilities/ui'

import { LeadershipCard } from './LeadershipCard'

type Props = {
  title: string
  eyebrow?: string | null
  members: BoardMember[]
  layout: 'grid' | 'feature'
}

/** Thin gradient rule between board groups. */
export function GroupDivider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto h-px w-full max-w-7xl bg-gradient-to-r from-transparent via-navy-900/10 to-transparent dark:via-ice/10"
    />
  )
}

export function BoardGroup({ title, eyebrow, members, layout }: Props) {
  if (layout === 'feature') {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-6 sm:mb-12">
          <div>
            {eyebrow ? <p className={cn(EYEBROW_CLS, 'mb-2 text-[11px] sm:text-xs')}>{eyebrow}</p> : null}
            <h2 className="font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl lg:text-5xl dark:text-ice">
              {title}
            </h2>
          </div>
          <div className="hidden h-px flex-1 translate-y-[-0.8rem] bg-gradient-to-r from-navy-900/15 to-transparent sm:block dark:from-ice/15" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:mx-auto md:max-w-2xl">
          {members.map((member, idx) => (
            <div key={member.id} className="flex w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)]">
              <LeadershipCard member={member} index={idx} size="feature" columnsPerRow={2} />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
        <div>
          {eyebrow ? <p className={cn(EYEBROW_CLS, 'mb-2 text-[11px] sm:text-xs')}>{eyebrow}</p> : null}
          <h2 className="font-display text-2xl font-semibold tracking-tight text-navy-900 sm:text-3xl lg:text-4xl dark:text-ice">
            {title}
          </h2>
        </div>
        <div className="hidden h-px flex-1 translate-y-[-0.6rem] bg-gradient-to-r from-navy-900/15 to-transparent sm:block dark:from-ice/15" />
        <span className="hidden font-sans text-xs tracking-[0.18em] text-navy-800/50 uppercase sm:inline dark:text-ice/40">
          {String(members.length).padStart(2, '0')} members
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {members.map((member, idx) => (
          <div
            key={member.id}
            className="flex w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]"
          >
            <LeadershipCard member={member} index={idx} columnsPerRow={4} />
          </div>
        ))}
      </div>
    </section>
  )
}
