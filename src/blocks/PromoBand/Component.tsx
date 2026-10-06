import React, { Fragment } from 'react'

import type { PromoBandBlock as PromoBandBlockProps } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Reveal } from '@/components/Reveal'
import { EYEBROW_CLS } from '@/components/SectionIntro'
import Topo from '@/components/Topo'

type Props = PromoBandBlockProps & { disableInnerContainer?: boolean }

export const PromoBandBlock: React.FC<Props> = ({ eyebrow, headingParts, body, link }) => {
  const parts = (headingParts ?? []).map((p) => p.text).filter(Boolean)

  return (
    <section className="relative isolate overflow-hidden bg-ice py-28 sm:py-32 dark:bg-navy-900">
      <Topo className="absolute inset-0 z-0" />
      {/* Top fade — dissolves topo in from the section above. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-ice to-transparent dark:from-navy-900"
      />
      {/* Bottom fade — dissolves topo out into the section below. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent to-ice dark:to-navy-900"
      />

      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            {eyebrow ? <p className={EYEBROW_CLS}>{eyebrow}</p> : null}
            {parts.length > 0 ? (
              <h2 className="mt-4 font-display text-3xl leading-[1.1] font-semibold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl dark:text-ice">
                {parts.map((text, i) => (
                  <Fragment key={i}>
                    {i > 0 ? <span className="text-chathams-600 dark:text-gold"> · </span> : null}
                    {text}
                  </Fragment>
                ))}
              </h2>
            ) : null}
            {body ? (
              <p className="mt-6 max-w-3xl font-sans text-base leading-relaxed text-navy-800/80 sm:text-lg dark:text-ice/80">
                {body}
              </p>
            ) : null}
          </div>

          {link?.label ? (
            <div className="flex">
              <CMSLink {...link} appearance={link.appearance ?? 'primary'} size="lg" />
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  )
}
