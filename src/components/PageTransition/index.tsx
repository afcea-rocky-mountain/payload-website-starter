'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export interface PageTransitionProps {
  children: ReactNode
  className?: string
}

/** Enter-only page fade (App Router has no exit phase). */
export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
