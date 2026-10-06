import type { Theme } from './types'

/** Same key the original site used, so returning visitors keep their choice. */
export const themeLocalStorageKey = 'theme'

export const defaultTheme: Theme = 'light'

export const getImplicitPreference = (): Theme | null => {
  const mediaQuery = '(prefers-color-scheme: dark)'
  const mql = window.matchMedia(mediaQuery)
  const hasImplicitPreference = typeof mql.matches === 'boolean'

  if (hasImplicitPreference) {
    return mql.matches ? 'dark' : 'light'
  }

  return null
}
