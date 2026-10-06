'use client'

import { useEffect, useRef } from 'react'
import { fbm } from '@/lib/noise'
import { cn } from '@/utilities/ui'
import { useTheme } from '@/providers/Theme'

type Palette = {
  base: string
  baseRgb: string        // pre-computed "r, g, b" for use in rgba()
  contourRgb: string
  contourAlphaBase: number
  vignetteRgb: string
  vignetteAlpha: number
  highlightRgb: string   // bright color for the cursor-bloom lines pass
}

const PALETTES: Record<'dark' | 'light', Palette> = {
  dark: {
    base: '#103C6D',
    baseRgb: '16, 60, 109',
    contourRgb: '210, 223, 238',
    contourAlphaBase: 0.18,
    vignetteRgb: '6, 24, 46',
    vignetteAlpha: 0.4,
    highlightRgb: '255, 215, 120',  // warm gold — pops against dark blue
  },
  light: {
    base: '#e8eef7',
    baseRgb: '232, 238, 247',
    contourRgb: '16, 60, 109',
    contourAlphaBase: 0.16,
    vignetteRgb: '16, 60, 109',
    vignetteAlpha: 0.12,
    highlightRgb: '16, 60, 109',   // navy — darkens the line further in light mode
  },
}

const SEED = 42.7
const SCALE = 0.0042
const NUM_LEVELS = 18
const CELL = 4
const MAX_DPR = 1

const fieldCache = new Map<string, { field: Float32Array; cols: number; rows: number; minVal: number; maxVal: number }>()

function buildField(w: number, h: number) {
  const key = `${w}x${h}`
  const cached = fieldCache.get(key)
  if (cached) return cached

  const cols = Math.ceil(w / CELL)
  const rows = Math.ceil(h / CELL)
  const field = new Float32Array(cols * rows)
  let minVal = Infinity
  let maxVal = -Infinity

  for (let iy = 0; iy < rows; iy++) {
    for (let ix = 0; ix < cols; ix++) {
      const v = fbm(ix * CELL * SCALE, iy * CELL * SCALE, SEED)
      field[iy * cols + ix] = v
      if (v < minVal) minVal = v
      if (v > maxVal) maxVal = v
    }
  }

  const entry = { field, cols, rows, minVal, maxVal }
  if (fieldCache.size > 16) fieldCache.delete(fieldCache.keys().next().value!)
  fieldCache.set(key, entry)
  return entry
}

// Shared marching-squares contour drawing for one level.
// strokeStyle and lineWidth must be set by the caller before calling this.
function drawContourLevel(
  ctx: CanvasRenderingContext2D,
  field: Float32Array,
  cols: number,
  rows: number,
  minVal: number,
  maxVal: number,
  level: number,
) {
  const range = maxVal - minVal || 1
  const getVal = (ix: number, iy: number) => (field[iy * cols + ix] - minVal) / range
  const threshold = (level + 1) / (NUM_LEVELS + 1)

  ctx.beginPath()
  for (let iy = 0; iy < rows - 1; iy++) {
    for (let ix = 0; ix < cols - 1; ix++) {
      const tl = getVal(ix, iy)
      const tr = getVal(ix + 1, iy)
      const br = getVal(ix + 1, iy + 1)
      const bl = getVal(ix, iy + 1)

      const config =
        (tl >= threshold ? 8 : 0) |
        (tr >= threshold ? 4 : 0) |
        (br >= threshold ? 2 : 0) |
        (bl >= threshold ? 1 : 0)

      if (config === 0 || config === 15) continue

      const x = ix * CELL
      const y = iy * CELL
      const s = CELL

      let ax = 0, ay = 0, bx = 0, by = 0
      let cx = 0, cy = 0, dx = 0, dy = 0
      let secondSeg = false

      switch (config) {
        case 1:
          ax = x + ((threshold - bl) / (br - bl)) * s; ay = y + s
          bx = x; by = y + ((threshold - tl) / (bl - tl)) * s
          break
        case 2:
          ax = x + s; ay = y + ((threshold - tr) / (br - tr)) * s
          bx = x + ((threshold - bl) / (br - bl)) * s; by = y + s
          break
        case 3:
          ax = x + s; ay = y + ((threshold - tr) / (br - tr)) * s
          bx = x; by = y + ((threshold - tl) / (bl - tl)) * s
          break
        case 4:
          ax = x + ((threshold - tl) / (tr - tl)) * s; ay = y
          bx = x + s; by = y + ((threshold - tr) / (br - tr)) * s
          break
        case 5:
          ax = x + ((threshold - tl) / (tr - tl)) * s; ay = y
          bx = x; by = y + ((threshold - tl) / (bl - tl)) * s
          cx = x + s; cy = y + ((threshold - tr) / (br - tr)) * s
          dx = x + ((threshold - bl) / (br - bl)) * s; dy = y + s
          secondSeg = true
          break
        case 6:
          ax = x + ((threshold - tl) / (tr - tl)) * s; ay = y
          bx = x + ((threshold - bl) / (br - bl)) * s; by = y + s
          break
        case 7:
          ax = x + ((threshold - tl) / (tr - tl)) * s; ay = y
          bx = x; by = y + ((threshold - tl) / (bl - tl)) * s
          break
        case 8:
          ax = x; ay = y + ((threshold - tl) / (bl - tl)) * s
          bx = x + ((threshold - tl) / (tr - tl)) * s; by = y
          break
        case 9:
          ax = x + ((threshold - bl) / (br - bl)) * s; ay = y + s
          bx = x + ((threshold - tl) / (tr - tl)) * s; by = y
          break
        case 10:
          ax = x; ay = y + ((threshold - tl) / (bl - tl)) * s
          bx = x + ((threshold - bl) / (br - bl)) * s; by = y + s
          cx = x + ((threshold - tl) / (tr - tl)) * s; cy = y
          dx = x + s; dy = y + ((threshold - tr) / (br - tr)) * s
          secondSeg = true
          break
        case 11:
          ax = x + s; ay = y + ((threshold - tr) / (br - tr)) * s
          bx = x + ((threshold - tl) / (tr - tl)) * s; by = y
          break
        case 12:
          ax = x; ay = y + ((threshold - tl) / (bl - tl)) * s
          bx = x + s; by = y + ((threshold - tr) / (br - tr)) * s
          break
        case 13:
          ax = x + ((threshold - bl) / (br - bl)) * s; ay = y + s
          bx = x + s; by = y + ((threshold - tr) / (br - tr)) * s
          break
        case 14:
          ax = x; ay = y + ((threshold - tl) / (bl - tl)) * s
          bx = x + ((threshold - bl) / (br - bl)) * s; by = y + s
          break
        default:
          continue
      }

      ctx.moveTo(ax, ay)
      ctx.lineTo(bx, by)
      if (secondSeg) {
        ctx.moveTo(cx, cy)
        ctx.lineTo(dx, dy)
      }
    }
  }
  ctx.stroke()
}

// Normal full render: base fill + contour lines + top fade + vignette.
function renderCanvas(ctx: CanvasRenderingContext2D, w: number, h: number, theme: 'dark' | 'light') {
  const p = PALETTES[theme]

  ctx.fillStyle = p.base
  ctx.fillRect(0, 0, w, h)

  const { field, cols, rows, minVal, maxVal } = buildField(w, h)

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (let level = 0; level < NUM_LEVELS; level++) {
    const alpha = p.contourAlphaBase + Math.sin(level * 0.5) * 0.08
    ctx.strokeStyle = `rgba(${p.contourRgb}, ${alpha})`
    ctx.lineWidth = 1.4 + Math.sin(level * 0.8) * 0.5
    drawContourLevel(ctx, field, cols, rows, minVal, maxVal, level)
  }

  // Top edge fade — blends topo in from the top so there's no hard-cut line
  // at the header boundary. Paints base color to transparent over top ~20%.
  const fadeH = Math.min(h * 0.22, 160)
  const topFade = ctx.createLinearGradient(0, 0, 0, fadeH)
  topFade.addColorStop(0, p.base)
  topFade.addColorStop(1, `rgba(${p.baseRgb}, 0)`)
  ctx.fillStyle = topFade
  ctx.fillRect(0, 0, w, fadeH)

  // Vignette
  const vignette = ctx.createRadialGradient(
    w * 0.5, h * 0.5, Math.min(w, h) * 0.2,
    w * 0.5, h * 0.5, Math.max(w, h) * 0.75,
  )
  vignette.addColorStop(0, `rgba(${p.vignetteRgb}, 0)`)
  vignette.addColorStop(1, `rgba(${p.vignetteRgb}, ${p.vignetteAlpha})`)
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, w, h)
}

// Highlight-only render: draws contour lines in a bright accent color on a
// transparent canvas. The caller applies a cursor-radius mask via
// destination-in, so only lines near the pointer remain visible.
// This canvas is composited on top with mix-blend-mode: screen so ONLY
// the lines get brightened — the background is unchanged.
function renderHighlightLines(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  theme: 'dark' | 'light',
) {
  const p = PALETTES[theme]
  const { field, cols, rows, minVal, maxVal } = buildField(w, h)

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Dark mode: light accent lines composited via `screen` (brightens).
  // Light mode: dark accent lines composited via `multiply` (darkens/deepens).
  // Opacity is higher in light mode because multiply is less dramatic than screen.
  const lineOpacity = theme === 'dark' ? 0.45 : 0.75

  for (let level = 0; level < NUM_LEVELS; level++) {
    ctx.strokeStyle = `rgba(${p.highlightRgb}, ${lineOpacity})`
    ctx.lineWidth = 1.8
    drawContourLevel(ctx, field, cols, rows, minVal, maxVal, level)
  }
}

type TopoProps = {
  /** Override the theme; by default the current site theme is used. */
  theme?: 'dark' | 'light'
  className?: string
}

/**
 * Generated topographic contour backdrop (marching squares over fBm noise)
 * with a cursor-following highlight canvas. Fills its positioned parent.
 */
export default function Topo({ theme: themeProp, className }: TopoProps) {
  const { theme: siteTheme } = useTheme()
  const theme: 'dark' | 'light' = themeProp ?? (siteTheme === 'light' ? 'light' : 'dark')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const highlightRef = useRef<HTMLCanvasElement | null>(null)
  const themeRef = useRef(theme)
  themeRef.current = theme

  // Main canvas — redraws when theme or size changes.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let frameId = 0
    let lastKey = ''

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const rect = canvas.getBoundingClientRect()
      const cssW = Math.round(rect.width)
      const cssH = Math.round(rect.height)
      if (cssW === 0 || cssH === 0) return

      const w = Math.round(cssW * dpr)
      const h = Math.round(cssH * dpr)
      const key = `${w}x${h}|${themeRef.current}`
      if (key === lastKey) return
      lastKey = key

      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) return
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      if (reducedMotion) {
        const p = PALETTES[themeRef.current]
        const g = ctx.createLinearGradient(0, 0, cssW, cssH)
        g.addColorStop(0, p.base)
        g.addColorStop(1, themeRef.current === 'dark' ? '#0d3158' : '#d2dfee')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, cssW, cssH)
        return
      }

      renderCanvas(ctx, cssW, cssH, themeRef.current)
    }

    const schedule = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(draw)
    }

    let resizeTimer: ReturnType<typeof setTimeout> | null = null
    const ro = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(schedule, 80)
    })
    ro.observe(canvas)
    schedule()

    return () => {
      ro.disconnect()
      cancelAnimationFrame(frameId)
      if (resizeTimer) clearTimeout(resizeTimer)
    }
  }, [theme])

  // Highlight canvas — cursor-following bloom that only brightens topo lines.
  // Uses mix-blend-mode: screen so transparent areas pass through unchanged.
  useEffect(() => {
    const canvas = canvasRef.current
    const highlight = highlightRef.current
    if (!canvas || !highlight) return

    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return

    // Listen on the parent section so we catch pointer events on content
    // overlaid above the canvas (which has lower z-index).
    const parent = canvas.parentElement
    if (!parent) return

    const cursor = { x: 0, y: 0, active: false }
    let lx = 0, ly = 0 // lerped position
    let hlKey = ''

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      cursor.x = e.clientX - rect.left
      cursor.y = e.clientY - rect.top
      cursor.active = true
    }
    const onLeave = () => { cursor.active = false }

    parent.addEventListener('pointermove', onMove, { passive: true })
    parent.addEventListener('pointerleave', onLeave, { passive: true })

    let frameId = 0

    const draw = () => {
      frameId = requestAnimationFrame(draw)

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const rect = canvas.getBoundingClientRect()
      const cssW = Math.round(rect.width)
      const cssH = Math.round(rect.height)
      if (cssW === 0 || cssH === 0) return

      const w = Math.round(cssW * dpr)
      const h = Math.round(cssH * dpr)
      const key = `${w}x${h}|${themeRef.current}`
      if (highlight.width !== w || highlight.height !== h || key !== hlKey) {
        highlight.width = w
        highlight.height = h
        hlKey = key
        lx = cursor.x
        ly = cursor.y
      }

      const ctx = highlight.getContext('2d', { alpha: true })
      if (!ctx) return
      ctx.setTransform(1, 0, 0, 1, 0, 0)

      ctx.clearRect(0, 0, w, h)

      if (!cursor.active) return

      // Smooth lerp toward cursor
      lx += (cursor.x - lx) * 0.12
      ly += (cursor.y - ly) * 0.12

      ctx.scale(dpr, dpr)

      // 1. Draw bright lines (full canvas)
      renderHighlightLines(ctx, cssW, cssH, themeRef.current)

      // 2. Mask to cursor radius using destination-in so ONLY the lines
      //    within ~220px of the cursor remain visible.
      ctx.globalCompositeOperation = 'destination-in'
      const radius = 220
      const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, radius)
      grad.addColorStop(0,    'rgba(255,255,255,0.7)')
      grad.addColorStop(0.45, 'rgba(255,255,255,0.35)')
      grad.addColorStop(1,    'rgba(255,255,255,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, cssW, cssH)
      ctx.globalCompositeOperation = 'source-over'
    }

    frameId = requestAnimationFrame(draw)

    return () => {
      parent.removeEventListener('pointermove', onMove)
      parent.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frameId)
    }
  }, [theme])

  const cls = ['absolute inset-0 block h-full w-full', className].filter(Boolean).join(' ')

  return (
    <>
      <canvas ref={canvasRef} className={cls} aria-hidden="true" />
      {/* Highlight canvas composited via screen: lines near cursor glow,
          background (transparent canvas pixels) is unchanged. */}
      <canvas
        ref={highlightRef}
        className={cn(cls, 'mix-blend-multiply dark:mix-blend-screen')}
        aria-hidden="true"
      />
    </>
  )
}
