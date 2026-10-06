import React from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import type { Event, Page } from '@/payload-types'
import Button, { type ButtonSize, type ButtonVariant } from '@/components/Button'
import { cn } from '@/utilities/ui'

export type CMSLinkType = {
  appearance?: 'inline' | ButtonVariant | null
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'events'
    value: Page | Event | string | number
  } | null
  size?: ButtonSize | null
  type?: 'custom' | 'reference' | null
  url?: string | null
  /** Hide the trailing arrow icon. */
  noIcon?: boolean
  fullWidthOnMobile?: boolean
}

/** Resolve a CMS link field to an href. */
export function resolveLinkHref(link: Pick<CMSLinkType, 'type' | 'reference' | 'url'>): string | null {
  const { type, reference, url } = link
  if (type === 'reference' && reference && typeof reference.value === 'object' && reference.value?.slug) {
    const slug = reference.value.slug
    if (reference.relationTo === 'events') return `/events/${slug}`
    return slug === 'home' ? '/' : `/${slug}`
  }
  return url || null
}

const isExternal = (href: string) => /^(https?:)?\/\//i.test(href)

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const { appearance = 'inline', children, className, label, newTab, size, noIcon, fullWidthOnMobile } = props
  const href = resolveLinkHref(props)
  if (!href) return null

  const external = isExternal(href)
  const openNew = Boolean(newTab) || external

  if (appearance === 'inline' || !appearance) {
    const Comp = external ? 'a' : Link
    return (
      <Comp
        href={href}
        className={cn(className)}
        {...(openNew ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {label}
        {children}
      </Comp>
    )
  }

  const Icon = external ? ArrowUpRight : ArrowRight
  return (
    <Button
      href={href}
      newTab={openNew}
      variant={appearance}
      size={size ?? 'md'}
      className={className}
      fullWidthOnMobile={fullWidthOnMobile}
    >
      {label}
      {children}
      {!noIcon && (
        <Icon
          className={cn(
            'h-4 w-4 transition-transform duration-300',
            external ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : 'group-hover:translate-x-0.5',
          )}
          aria-hidden="true"
        />
      )}
    </Button>
  )
}
