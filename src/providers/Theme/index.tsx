'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import canUseDOM from '@/utilities/canUseDOM'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
  toggle: () => null,
}

const ThemeContext = createContext(initialContext)

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme)
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(
    canUseDOM ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
  )

  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (themeToSet === null) {
      try {
        window.localStorage.removeItem(themeLocalStorageKey)
      } catch {
        /* ignore */
      }
      const implicitPreference = getImplicitPreference() ?? defaultTheme
      applyTheme(implicitPreference)
      setThemeState(implicitPreference)
    } else {
      setThemeState(themeToSet)
      try {
        window.localStorage.setItem(themeLocalStorageKey, themeToSet)
      } catch {
        /* ignore */
      }
      applyTheme(themeToSet)
    }
  }, [])

  const toggle = useCallback(() => {
    const current =
      (document.documentElement.getAttribute('data-theme') as Theme | null) ??
      getImplicitPreference() ??
      defaultTheme
    setTheme(current === 'dark' ? 'light' : 'dark')
  }, [setTheme])

  // Resolve the initial theme on mount (stored choice, else system preference).
  useEffect(() => {
    let themeToSet: Theme = defaultTheme
    let preference: string | null = null
    try {
      preference = window.localStorage.getItem(themeLocalStorageKey)
    } catch {
      /* ignore */
    }

    if (themeIsValid(preference)) {
      themeToSet = preference
    } else {
      const implicitPreference = getImplicitPreference()
      if (implicitPreference) themeToSet = implicitPreference
    }

    applyTheme(themeToSet)
    setThemeState(themeToSet)
  }, [])

  // Follow system preference changes while the user hasn't pinned a choice.
  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      try {
        if (themeIsValid(window.localStorage.getItem(themeLocalStorageKey))) return
      } catch {
        /* ignore */
      }
      const next: Theme = e.matches ? 'dark' : 'light'
      applyTheme(next)
      setThemeState(next)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Sync across tabs.
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== themeLocalStorageKey) return
      if (themeIsValid(e.newValue)) {
        applyTheme(e.newValue)
        setThemeState(e.newValue)
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  return <ThemeContext value={{ setTheme, theme, toggle }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
