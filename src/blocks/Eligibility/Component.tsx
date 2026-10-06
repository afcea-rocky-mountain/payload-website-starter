import React from 'react'
import { Check } from 'lucide-react'

import type { EligibilityBlock as EligibilityBlockProps } from '@/payload-types'
import { Reveal } from '@/components/Reveal'

type Props = EligibilityBlockProps & { disableInnerContainer?: boolean }

export const EligibilityBlock: React.FC<Props> = ({ eyebrow, heading, intro, items }) => {
  const list = items ?? []

  return (
    <section className="relative border-y border-navy-900/5 bg-white/60 dark:border-ice/10 dark:bg-chathams-600/10">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            {eyebrow ? (
              <p className="font-sans text-xs font-semibold tracking-[0.22em] text-chathams-700 uppercase sm:text-sm dark:text-gold">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight text-navy-900 sm:text-5xl dark:text-ice">
              {heading}
            </h2>
            {intro ? (
              <p className="mt-5 max-w-md text-base leading-relaxed text-navy-800/75 sm:text-lg dark:text-ice/70">
                {intro}
              </p>
            ) : null}
          </div>

          {list.length > 0 ? (
            <ul className="space-y-5 lg:col-span-7">
              {list.map((item, idx) => (
                <Reveal
                  as="li"
                  key={item.id ?? idx}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-5% 0px' }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-4 border border-navy-900/5 bg-ice/50 p-5 dark:border-ice/10 dark:bg-navy-900/40"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 flex-none items-center justify-center bg-gold/15 text-gold ring-1 ring-gold/30"
                  >
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <p className="text-base leading-relaxed text-navy-800/85 dark:text-ice/80">
                    {item.text}
                  </p>
                </Reveal>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  )
}
