import React from 'react'

import type { ZeffyEmbedBlock as ZeffyEmbedBlockProps } from '@/payload-types'
import { SectionIntro } from '@/components/SectionIntro'
import { ZeffyFrame } from '@/components/ZeffyFrame'

type Props = ZeffyEmbedBlockProps & { disableInnerContainer?: boolean }

export const ZeffyEmbedBlock: React.FC<Props> = ({ heading, intro, url, height }) => {
  if (!url) return null

  return (
    <section className="relative bg-ice py-16 sm:py-20 dark:bg-navy-900">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {heading || intro ? (
          <SectionIntro heading={heading} intro={intro} align="center" className="mb-10" />
        ) : null}
        <div className="overflow-hidden border border-navy-900/10 bg-white dark:border-ice/10 dark:bg-navy-900">
          <ZeffyFrame url={url} height={height} title={heading || 'Zeffy form'} />
        </div>
      </div>
    </section>
  )
}
