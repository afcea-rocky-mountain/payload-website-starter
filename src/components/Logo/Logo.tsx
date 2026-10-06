import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  /** Wordmark text; defaults to the chapter name. */
  label?: string
}

/** Text wordmark used wherever a logo slot exists (header, footer, admin bar). */
export const Logo = ({ className, label = 'AFCEA Rocky Mountain' }: Props) => {
  return (
    <span
      className={clsx(
        'font-display text-lg leading-none font-semibold tracking-tight text-navy-900 dark:text-ice',
        className,
      )}
    >
      {label}
    </span>
  )
}
