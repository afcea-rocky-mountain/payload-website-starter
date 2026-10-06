import React from 'react'
import { ArrowUpRight, Mail } from 'lucide-react'

import { Reveal } from '@/components/Reveal'
import { EYEBROW_CLS } from '@/components/SectionIntro'
import { cn } from '@/utilities/ui'

type Props = {
  eyebrow?: string | null
  heading?: string | null
  body?: string | null
  buttonLabel?: string | null
  email: string
}

export function GetInvolvedCta({ eyebrow, heading, body, buttonLabel, email }: Props) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-20 sm:px-6 sm:pt-12 sm:pb-24 lg:px-8">
      <Reveal
        className={cn(
          'chamfered-card relative isolate overflow-hidden border',
          'border-navy-900/10 bg-white/70 backdrop-blur-sm',
          'dark:border-ice/10 dark:bg-navy-900/50',
          'px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14',
        )}
      >
        {/* Decorative gold radial */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_85%_50%,rgba(201,168,92,0.10),transparent_70%)] dark:bg-[radial-gradient(60%_70%_at_85%_50%,rgba(201,168,92,0.18),transparent_70%)]"
        />

        <div className="flex w-full flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            {eyebrow ? <p className={cn(EYEBROW_CLS, 'mb-3 text-[11px] sm:text-xs')}>{eyebrow}</p> : null}
            <h2 className="font-display text-2xl font-semibold tracking-tight text-navy-900 sm:text-3xl lg:text-4xl dark:text-ice">
              {heading}
            </h2>
            {body ? (
              <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-navy-800/75 sm:text-lg dark:text-ice/75">
                {body}
              </p>
            ) : null}
          </div>

          <a
            href={`mailto:${email}?subject=Interested%20in%20Serving%20the%20AFCEA%20Rocky%20Mountain%20Chapter`}
            className={cn(
              'group inline-flex w-full items-center justify-center gap-3 rounded-full sm:w-auto',
              'bg-gold px-6 py-3.5 font-sans text-sm font-semibold tracking-wide text-navy-900',
              'min-h-12 transition-all duration-300',
              'hover:bg-gold/90',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ice dark:focus-visible:ring-offset-navy-900',
            )}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>{buttonLabel || 'Contact the Board'}</span>
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </Reveal>
    </section>
  )
}
