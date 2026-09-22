'use client'

import React, { createContext, use, useState, useCallback } from 'react'

export interface MegaMenuContextType {
  isOpen: boolean
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
}

const initialContext: MegaMenuContextType = {
  isOpen: false,
  openMenu: () => null,
  closeMenu: () => null,
  toggleMenu: () => null,
}

const MegaMenuContext = createContext<MegaMenuContextType>(initialContext)

export const MegaMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openMenu = useCallback(() => setIsOpen(true), [])
  const closeMenu = useCallback(() => setIsOpen(false), [])
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), [])

  return (
    <MegaMenuContext value={{ isOpen, openMenu, closeMenu, toggleMenu }}>
      {children}
    </MegaMenuContext>
  )
}

export const useMegaMenu = (): MegaMenuContextType => use(MegaMenuContext)
