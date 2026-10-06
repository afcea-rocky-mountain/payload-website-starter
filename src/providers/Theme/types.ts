export type Theme = 'dark' | 'light'

export interface ThemeContextType {
  /** Set an explicit theme, or `null` to clear the stored choice and follow the system. */
  setTheme: (theme: Theme | null) => void
  theme?: Theme | null
  /** Flip between light and dark and remember the choice. */
  toggle: () => void
}

export function themeIsValid(string: null | string): string is Theme {
  return string ? ['dark', 'light'].includes(string) : false
}
