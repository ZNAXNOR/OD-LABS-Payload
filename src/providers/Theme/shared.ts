import type { Theme } from './types'

export const themeLocalStorageKey = 'payload-theme'
export const defaultTheme: Theme = 'od-light'

export const getImplicitPreference = (): Theme => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return defaultTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'od-dark' : 'od-light'
}
