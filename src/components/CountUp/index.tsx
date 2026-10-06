'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useMotionValue } from 'framer-motion'

type Props = {
  to: number
  duration?: number
  /** Appended once the count finishes (default "+"). */
  suffix?: string
}

/** Animated "$0 → $500,000+" counter; respects prefers-reduced-motion. */
export function CountUp({ to, duration = 1.4, suffix = '+' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const value = useMotionValue(0)
  const [display, setDisplay] = useState('$0')

  useEffect(() => {
    if (!inView) return
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setDisplay(`$${to.toLocaleString('en-US')}${suffix}`)
      return
    }
    const controls = animate(value, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplay(`$${Math.round(latest).toLocaleString('en-US')}${latest >= to ? suffix : ''}`)
      },
    })
    return () => controls.stop()
  }, [inView, to, duration, value, suffix])

  return (
    <span ref={ref} aria-label={`$${to.toLocaleString('en-US')} or more`}>
      {display}
    </span>
  )
}

export default CountUp
