'use client'

import React, { createContext, use, useCallback, useEffect, useState } from 'react'

import type { Theme, ThemeContextType, ThemePreference } from './types'
import { themeIsValid } from './types'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: defaultTheme,
  preference: 'auto',
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === 'undefined') return defaultTheme
    const initialTheme = document.documentElement.getAttribute('data-theme')
    return themeIsValid(initialTheme) ? initialTheme : defaultTheme
  })
  const [preference, setPreference] = useState<ThemePreference>('auto')

  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (themeToSet === null) {
      window.localStorage.removeItem(themeLocalStorageKey)
      setPreference('auto')
      const systemTheme = getImplicitPreference()
      setThemeState(systemTheme)
      document.documentElement.setAttribute('data-theme', systemTheme)
      return
    }

    window.localStorage.setItem(themeLocalStorageKey, themeToSet)
    setPreference(themeToSet)
    setThemeState(themeToSet)
    document.documentElement.setAttribute('data-theme', themeToSet)
  }, [])

  useEffect(() => {
    const storedPreference = window.localStorage.getItem(themeLocalStorageKey)
    const nextPreference: ThemePreference = themeIsValid(storedPreference)
      ? storedPreference
      : 'auto'
    const activeTheme = nextPreference === 'auto' ? getImplicitPreference() : nextPreference

    setPreference(nextPreference)
    setThemeState(activeTheme)
    document.documentElement.setAttribute('data-theme', activeTheme)
  }, [])

  useEffect(() => {
    if (preference !== 'auto' || typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const nextTheme = getImplicitPreference()
      setThemeState(nextTheme)
      document.documentElement.setAttribute('data-theme', nextTheme)
    }

    mediaQuery.addEventListener?.('change', handleChange)
    return () => mediaQuery.removeEventListener?.('change', handleChange)
  }, [preference])

  return <ThemeContext value={{ setTheme, theme, preference }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
