'use client'
import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemePreferenceProvider as ThemeProvider } from './Theme'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>{children}</HeaderThemeProvider>
    </ThemeProvider>
  )
}
