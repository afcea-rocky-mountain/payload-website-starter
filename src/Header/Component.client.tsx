'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

import type { Header as HeaderType, SiteSetting } from '@/payload-types'

import ThemeToggle from '@/components/ThemeToggle'
import { resolveLinkHref } from '@/components/Link'
import { DEFAULTS } from '@/utilities/siteDefaults'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  data: HeaderType
  siteSettings?: SiteSetting | null
}

type NavItem = { href: string; label: string; newTab: boolean }

const isExternal = (href: string) => /^(https?:)?\/\//i.test(href)

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, siteSettings }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const toggleBtnRef = useRef<HTMLButtonElement>(null)
  const mobilePanelRef = useRef<HTMLDivElement>(null)

  const nav: NavItem[] = (data?.navItems || [])
    .map(({ link }) => {
      const href = resolveLinkHref(link)
      return href ? { href, label: link.label, newTab: Boolean(link.newTab) } : null
    })
    .filter((x): x is NavItem => Boolean(x))

  const ctaHref = data?.cta?.enabled !== false && data?.cta?.link ? resolveLinkHref(data.cta.link) : null
  const ctaLabel = data?.cta?.link?.label || 'Join AFCEA'
  const ctaNewTab = Boolean(data?.cta?.link?.newTab) || (ctaHref ? isExternal(ctaHref) : false)
  const showThemeToggle = data?.showThemeToggle !== false

  const shortName = siteSettings?.shortName || DEFAULTS.shortName
  const tinyName = siteSettings?.tinyName || DEFAULTS.tinyName
  const siteName = siteSettings?.siteName || DEFAULTS.siteName

  // Track scroll position for backdrop intensification.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change.
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Lock body scroll, handle Escape, and manage focus while mobile menu open.
  useEffect(() => {
    if (!mobileOpen) return

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)

    const focusTimer = window.setTimeout(() => {
      const firstLink = mobilePanelRef.current?.querySelector<HTMLElement>('a, button')
      firstLink?.focus()
    }, 60)

    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(focusTimer)
      toggleBtnRef.current?.focus()
    }
  }, [mobileOpen])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  const headerClasses = cn(
    'sticky top-0 z-50 w-full transition-all duration-300',
    'border-b',
    'pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]',
    scrolled
      ? 'border-navy-200/60 bg-ice/85 backdrop-blur-xl shadow-[0_1px_0_0_rgba(2,6,104,0.04)] dark:border-white/10 dark:bg-chathams-800/85'
      : 'border-transparent bg-ice/40 backdrop-blur-md dark:bg-chathams-800/40',
  )

  const ctaClasses = cn(
    'items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold tracking-tight transition-all duration-300',
    'bg-chathams-600 text-ice hover:-translate-y-0.5 hover:bg-chathams-700',
    'dark:bg-gold dark:text-navy-900 dark:hover:bg-[var(--color-gold-hover)]',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold',
  )

  const renderNavLink = (item: NavItem, className: string, children: React.ReactNode) => {
    if (isExternal(item.href) || item.newTab) {
      return (
        <a href={item.href} target="_blank" rel="noreferrer noopener" className={className}>
          {children}
        </a>
      )
    }
    return (
      <Link href={item.href} className={className} aria-current={isActive(item.href) ? 'page' : undefined}>
        {children}
      </Link>
    )
  }

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Chapter wordmark */}
        <Link
          href="/"
          className="group inline-flex items-center rounded-md focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          aria-label={`${siteName} — Home`}
        >
          <span className="hidden font-display text-lg leading-none font-semibold tracking-tight text-navy-900 sm:inline dark:text-ice">
            {shortName}
          </span>
          <span className="font-display text-base leading-none font-semibold tracking-tight text-navy-900 sm:hidden dark:text-ice">
            {tinyName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = isActive(item.href)
            return (
              <React.Fragment key={item.href + item.label}>
                {renderNavLink(
                  item,
                  cn(
                    'group relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                    'focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                    active
                      ? 'text-navy-900 dark:text-ice'
                      : 'text-navy-700/80 hover:text-navy-900 dark:text-ice/70 dark:hover:text-ice',
                  ),
                  <>
                    <span>{item.label}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'pointer-events-none absolute inset-x-3 -bottom-[2px] h-[2px] origin-left rounded-full bg-gold transition-transform duration-300',
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </>,
                )}
              </React.Fragment>
            )
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          {ctaHref ? (
            <a
              href={ctaHref}
              {...(ctaNewTab ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
              className={cn('hidden h-11 md:inline-flex', ctaClasses)}
            >
              {ctaLabel}
            </a>
          ) : null}
          {showThemeToggle ? <ThemeToggle /> : null}
          {/* Mobile toggle */}
          <button
            ref={toggleBtnRef}
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            className={cn(
              'relative inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden',
              'border border-navy-200/60 bg-white/70 text-navy-700 backdrop-blur transition-colors duration-200',
              'hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-ice dark:hover:bg-white/10',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold',
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="x"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.18 }}
                  className="flex"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.18 }}
                  className="flex"
                >
                  <Menu aria-hidden="true" className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobilePanelRef}
            id="mobile-nav-panel"
            key="mobile-panel"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-navy-200/60 bg-ice/95 backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-navy-900/95"
          >
            <nav
              aria-label="Mobile primary"
              className="mx-auto flex max-w-7xl flex-col gap-1 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6"
            >
              {nav.map((item, i) => {
                const active = isActive(item.href)
                return (
                  <motion.div
                    key={item.href + item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.25 }}
                  >
                    {renderNavLink(
                      item,
                      cn(
                        'block px-3 py-3 text-base font-medium transition-colors',
                        'focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                        active
                          ? 'bg-navy-100/70 text-navy-900 dark:bg-white/10 dark:text-ice'
                          : 'text-navy-700 hover:bg-navy-100/60 hover:text-navy-900 dark:text-ice/80 dark:hover:bg-white/5 dark:hover:text-ice',
                      ),
                      <span className="inline-flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="inline-block h-1.5 w-1.5 rounded-full bg-gold opacity-70"
                        />
                        {item.label}
                      </span>,
                    )}
                  </motion.div>
                )
              })}
              {ctaHref ? (
                <motion.a
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * nav.length, duration: 0.25 }}
                  href={ctaHref}
                  {...(ctaNewTab ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className={cn('mt-2 inline-flex min-h-11 w-full', ctaClasses)}
                >
                  {ctaLabel}
                </motion.a>
              ) : null}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
