import type { ComponentProps, ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'

/**
 * Site-wide button styles (ported from the original React site).
 *
 *   primary    — gold-filled, the page's primary CTA
 *   secondary  — glassy outline that floats over Topo backgrounds
 *   solidDark  — navy-filled in light mode, gold in dark
 *   link       — plain text link (no pill)
 */
export type ButtonVariant = 'primary' | 'secondary' | 'solidDark' | 'link'
export type ButtonSize = 'md' | 'lg'

const BASE =
  'group inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold tracking-tight ' +
  'transition-all duration-300 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ice focus-visible:outline-none ' +
  'dark:focus-visible:ring-offset-navy-900'

const SIZES: Record<ButtonSize, string> = {
  md: 'min-h-11 px-6 py-3 text-sm',
  lg: 'min-h-12 px-7 py-3.5 text-sm',
}

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-gold text-navy-900 hover:-translate-y-0.5 hover:bg-gold/90 focus-visible:ring-gold',
  secondary:
    'border border-navy-900/20 bg-white/25 text-navy-900 backdrop-blur-sm hover:-translate-y-0.5 hover:border-navy-900/40 hover:bg-white/40 focus-visible:ring-navy-700 ' +
    'dark:border-ice/20 dark:bg-navy-900/25 dark:text-ice dark:hover:border-ice/40 dark:hover:bg-navy-900/40 dark:focus-visible:ring-ice',
  solidDark:
    'bg-navy-900 text-ice ring-1 ring-navy-900 hover:bg-chathams-700 hover:ring-chathams-700 focus-visible:ring-gold ' +
    'dark:bg-gold dark:text-navy-900 dark:ring-gold dark:hover:bg-gold/90',
  link:
    'rounded-none min-h-0 px-0 py-0 gap-1.5 text-chathams-600 hover:text-navy-900 focus-visible:ring-chathams-600 dark:text-gold dark:hover:text-gold/80',
}

export function buttonClasses(opts: {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidthOnMobile?: boolean
  className?: string
}) {
  const { variant = 'primary', size = 'md', fullWidthOnMobile, className } = opts
  return cn(
    BASE,
    variant === 'link' ? '' : SIZES[size],
    BUTTON_VARIANTS[variant],
    fullWidthOnMobile && 'w-full sm:w-auto',
    className,
  )
}

type CommonProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidthOnMobile?: boolean
  className?: string
}

type AnchorProps = CommonProps &
  Omit<ComponentProps<'a'>, 'className' | 'children'> & { href: string; newTab?: boolean }

type NativeProps = CommonProps &
  Omit<ComponentProps<'button'>, 'className' | 'children'> & { href?: undefined; newTab?: undefined }

export type ButtonProps = AnchorProps | NativeProps

const isExternal = (href: string) => /^(https?:)?\/\//i.test(href) || /^(mailto|tel):/i.test(href)

export default function Button(props: ButtonProps) {
  const { children, variant, size, fullWidthOnMobile, className, ...rest } = props
  const cls = buttonClasses({ variant, size, fullWidthOnMobile, className })

  if ('href' in rest && typeof rest.href === 'string') {
    const { href, newTab, ...anchorRest } = rest as AnchorProps
    const external = isExternal(href)
    const openNew = newTab ?? (external && !/^(mailto|tel):/i.test(href))
    const targetProps = openNew ? { target: '_blank', rel: 'noreferrer noopener' } : {}
    if (external || href.startsWith('#')) {
      return (
        <a href={href} {...targetProps} {...anchorRest} className={cls}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} {...targetProps} {...anchorRest} className={cls}>
        {children}
      </Link>
    )
  }

  const buttonRest = rest as ComponentProps<'button'>
  return (
    <button type="button" {...buttonRest} className={cls}>
      {children}
    </button>
  )
}
