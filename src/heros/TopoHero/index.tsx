'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'framer-motion'

import Topo from '@/components/Topo'
import { cn } from '@/utilities/ui'

export interface TopoHeroProps {
  title: ReactNode
  eyebrow?: string | null
  subtitle?: ReactNode
  children?: ReactNode
  variant?: 'tall' | 'short'
  className?: string
}

const EASE = [0.22, 1, 0.36, 1] as const

const eyebrowVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE, delay: 0.05 } },
}

const titleVariants = {
  hidden: { opacity: 0, y: 26, letterSpacing: '0em' },
  show: {
    opacity: 1,
    y: 0,
    letterSpacing: '-0.02em',
    transition: { duration: 0.85, ease: EASE, delay: 0.12 },
  },
}

const subtitleVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.32 } },
}

const ctaVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE, delay: 0.47 } },
}

/**
 * Hero with the generated topographic canvas behind the headline and a
 * cursor-following spotlight. `tall` is the home page, `short` is interior.
 */
export default function TopoHero({
  title,
  eyebrow,
  subtitle,
  children,
  variant = 'tall',
  className = '',
}: TopoHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)

  // Cursor-following highlight: write x/y to CSS vars on rAF so the bloom
  // tracks the pointer without paying the React reconciliation cost.
  useEffect(() => {
    const section = sectionRef.current
    const spotlight = spotlightRef.current
    if (!section || !spotlight) return
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frameId = 0
    let targetX = 50
    let targetY = 35
    let currentX = targetX
    let currentY = targetY
    let opacity = 0

    const tick = () => {
      currentX += (targetX - currentX) * 0.15
      currentY += (targetY - currentY) * 0.15
      spotlight.style.setProperty('--spot-x', `${currentX}%`)
      spotlight.style.setProperty('--spot-y', `${currentY}%`)
      spotlight.style.opacity = String(opacity)
      frameId = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      targetX = ((e.clientX - rect.left) / rect.width) * 100
      targetY = ((e.clientY - rect.top) / rect.height) * 100
      opacity = 1
    }
    const onLeave = () => {
      opacity = 0
    }

    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    frameId = requestAnimationFrame(tick)

    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frameId)
    }
  }, [])

  const heightCls = variant === 'tall' ? 'min-h-[88svh]' : 'min-h-[56svh]'

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative isolate overflow-hidden',
        'bg-ice text-navy-900 dark:bg-navy-900 dark:text-ice',
        heightCls,
        className,
      )}
    >
      <Topo className="z-0" />

      {/* Cursor-following spotlight */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        style={{ '--spot-x': '50%', '--spot-y': '35%', opacity: 0 } as CSSProperties}
        className="pointer-events-none absolute inset-0 z-10 mix-blend-soft-light transition-opacity duration-500 bg-[radial-gradient(600px_circle_at_var(--spot-x)_var(--spot-y),rgba(201,168,92,0.35),transparent_60%)] dark:bg-[radial-gradient(600px_circle_at_var(--spot-x)_var(--spot-y),rgba(232,238,247,0.18),transparent_60%)]"
      />

      {/* Soft legibility scrim behind the headline only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_30%_45%,rgba(232,238,247,0.55),rgba(232,238,247,0)_60%)] dark:bg-[radial-gradient(ellipse_at_30%_45%,rgba(16,60,109,0.55),rgba(16,60,109,0)_60%)]"
      />
      {/* Fade into the next section. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-b from-transparent to-ice dark:to-navy-900"
      />

      <div className="relative z-20 mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-4xl">
          {eyebrow ? (
            <motion.p
              variants={eyebrowVariants}
              initial="hidden"
              animate="show"
              className="mb-5 font-sans text-xs font-semibold tracking-[0.22em] text-chathams-700 uppercase sm:text-sm dark:text-gold"
            >
              {eyebrow}
            </motion.p>
          ) : null}

          <motion.h1
            variants={titleVariants}
            initial="hidden"
            animate="show"
            className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-navy-900 sm:text-6xl lg:text-7xl lg:leading-[1.02] dark:text-ice"
          >
            {title}
          </motion.h1>

          {subtitle ? (
            <motion.div
              variants={subtitleVariants}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-2xl text-base leading-relaxed text-navy-800/80 sm:text-lg lg:text-xl dark:text-ice/80"
            >
              {subtitle}
            </motion.div>
          ) : null}

          {children ? (
            <motion.div variants={ctaVariants} initial="hidden" animate="show" className="mt-10">
              {children}
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
