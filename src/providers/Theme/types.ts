export const themes = [
  'od-dark',
  'od-light',
  'od-dark-contrast',
  'od-light-contrast',
] as const

export type Theme = (typeof themes)[number]
export type ThemePreference = Theme | 'auto'

export interface ThemeContextType {
  setTheme: (theme: Theme | null) => void
  theme: Theme
  preference: ThemePreference
}

export const themeIsValid = (value: string | null): value is Theme =>
  themes.some((theme) => theme === value)
