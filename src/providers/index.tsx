import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

import { ModalContainer, ModalProvider } from '@faceless-ui/modal'
import { zIndex } from '../../custom-theme.mjs'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <ModalProvider zIndex={Number(zIndex.modal)} classPrefix="payload" transTime={400}>
          {children}
          <ModalContainer />
        </ModalProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
