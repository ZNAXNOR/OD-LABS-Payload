'use client'

import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { TooltipProvider } from '@/components/ui/tooltip'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
