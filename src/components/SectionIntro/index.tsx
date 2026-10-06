import type { ReactNode } from 'react'
import { cn } from '@/utilities/ui'

type Props = {
  eyebrow?: string | null
  heading?: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  size?: 'md' | 'lg'
  className?: string
  headingId?: string
  headingAs?: 'h1' | 'h2' | 'h3'
}

export const EYEBROW_CLS =
  'font-sans text-xs font-semibold tracking-[0.22em] text-chathams-700 uppercase dark:text-gold'

/** Eyebrow + display heading + optional intro — the standard section opener. */
export function SectionIntro({
  eyebrow,
  heading,
  intro,
  align = 'left',
  size = 'md',
  className,
  headingId,
  headingAs: H = 'h2',
}: Props) {
  return (
    <div className={cn(align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
      {eyebrow ? <p className={EYEBROW_CLS}>{eyebrow}</p> : null}
      {heading ? (
        <H
          id={headingId}
          className={cn(
            'mt-4 font-display leading-tight font-semibold tracking-tight text-navy-900 dark:text-ice',
            size === 'lg' ? 'text-3xl sm:text-5xl lg:text-6xl leading-[1.1]' : 'text-3xl sm:text-4xl lg:text-5xl',
          )}
        >
          {heading}
        </H>
      ) : null}
      {intro ? (
        <p
          className={cn(
            'mt-5 font-sans text-base leading-relaxed text-navy-800/75 sm:text-lg dark:text-ice/75',
            align === 'left' && 'max-w-2xl',
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  )
}
