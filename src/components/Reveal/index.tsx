'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

export const fadeUpStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const VIEWPORT = { once: true, margin: '-80px' } as const

type RevealProps = {
  children: ReactNode
  className?: string
  /** Element to render — 'div' (default), 'section', 'ul', 'li', 'article', 'h2', 'p'… */
  as?: 'div' | 'section' | 'ul' | 'li' | 'article' | 'h2' | 'h3' | 'p' | 'span'
  /** Stagger children that are themselves <Reveal item> elements. */
  stagger?: boolean
  /** Use as a child of a staggered parent (inherits parent's variants timing). */
  item?: boolean
  delay?: number
  id?: string
} & Omit<HTMLMotionProps<'div'>, 'children' | 'className' | 'id'>

/**
 * Scroll-into-view fade-up wrapper (framer-motion). Server components can
 * use it freely; it is the only client boundary most blocks need.
 */
export function Reveal({ children, className, as = 'div', stagger, item, delay, id, ...rest }: RevealProps) {
  const Comp = (motion as unknown as Record<string, ElementType>)[as] as ElementType
  const variants = stagger
    ? fadeUpStagger
    : delay
      ? { hidden: fadeUp.hidden, show: { ...fadeUp.show, transition: { ...fadeUp.show.transition, delay } } }
      : fadeUp
  return (
    <Comp
      id={id}
      className={className}
      variants={variants}
      {...(item ? {} : { initial: 'hidden', whileInView: 'show', viewport: VIEWPORT })}
      {...rest}
    >
      {children}
    </Comp>
  )
}
