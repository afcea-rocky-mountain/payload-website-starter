'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

import { cn } from '@/utilities/ui'

type Props = {
  children: ReactNode
  /** Column position within the row — staggers the reveal per column. */
  colIndex: number
  className?: string
}

/**
 * Client wrapper for a board member card: scroll-reveal plus a subtle hover
 * lift. Visuals come from the `.chamfered-card` utility in globals.css.
 */
export function LeadershipCardMotion({ children, colIndex, className }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.55, delay: colIndex * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className={cn(
        'chamfered-card group relative isolate flex h-full w-full flex-col overflow-hidden border transition-colors duration-300',
        'border-navy-900/10 bg-white/70 backdrop-blur-sm',
        'dark:border-ice/10 dark:bg-navy-900/40',
        'hover:border-gold/40 dark:hover:border-gold/40',
        className,
      )}
    >
      {children}
    </motion.article>
  )
}
