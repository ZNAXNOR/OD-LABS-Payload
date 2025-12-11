import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { ModalProvider } from '@faceless-ui/modal'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <ModalProvider transTime={250} zIndex="var(--z-modal)">
          {children}
        </ModalProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
