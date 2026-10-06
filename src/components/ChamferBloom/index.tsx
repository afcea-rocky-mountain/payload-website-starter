'use client'

import { useEffect } from 'react'

function resetAllCardBlooms() {
  document.querySelectorAll<HTMLElement>('.chamfered-card').forEach((card) => {
    card.style.setProperty('--bloom-x', '-999px')
    card.style.setProperty('--bloom-y', '-999px')
  })
}

/**
 * Global tracker: sets --bloom-x / --bloom-y on the chamfered card the
 * pointer is currently inside, so the CSS ::after bloom follows the cursor.
 * Mount once in the root layout.
 */
export default function ChamferBloom() {
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e: PointerEvent) => {
      const cards = document.querySelectorAll<HTMLElement>('.chamfered-card')
      for (const card of cards) {
        const rect = card.getBoundingClientRect()
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          card.style.setProperty('--bloom-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
          card.style.setProperty('--bloom-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
        } else {
          card.style.setProperty('--bloom-x', '-999px')
          card.style.setProperty('--bloom-y', '-999px')
        }
      }
    }
    const onLeave = () => resetAllCardBlooms()

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])
  return null
}
