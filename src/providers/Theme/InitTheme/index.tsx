import Script from 'next/script'
import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../shared'

/**
 * Pre-paint theme apply to avoid FOUC. Mirrors the inline script from the
 * original site's index.html: stored choice wins, otherwise system preference.
 */
export const InitTheme: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    function getImplicitPreference() {
      var mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
      if (mql && typeof mql.matches === 'boolean') return mql.matches ? 'dark' : 'light'
      return null
    }
    function themeIsValid(theme) {
      return theme === 'light' || theme === 'dark'
    }
    var themeToSet = '${defaultTheme}'
    var preference = null
    try { preference = window.localStorage.getItem('${themeLocalStorageKey}') } catch (_) {}
    if (themeIsValid(preference)) {
      themeToSet = preference
    } else {
      var implicitPreference = getImplicitPreference()
      if (implicitPreference) themeToSet = implicitPreference
    }
    document.documentElement.setAttribute('data-theme', themeToSet)
  })();
  `,
      }}
      id="theme-script"
      strategy="beforeInteractive"
    />
  )
}
