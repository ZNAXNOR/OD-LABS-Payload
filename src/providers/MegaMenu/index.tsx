'use client'

import React, { createContext, use, useState, useCallback } from 'react'

export interface MegaMenuRuntimeError {
  code: '404' | '500' | '503' | 'ERR'
  error?: Error & { digest?: string }
  retry?: () => void
}

export interface MegaMenuContextType {
  isOpen: boolean
  runtimeError: MegaMenuRuntimeError | null
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
  setRuntimeError: (error: MegaMenuRuntimeError) => void
  clearRuntimeError: () => void
}

const initialContext: MegaMenuContextType = {
  isOpen: false,
  runtimeError: null,
  openMenu: () => null,
  closeMenu: () => null,
  toggleMenu: () => null,
  setRuntimeError: () => null,
  clearRuntimeError: () => null,
}

const MegaMenuContext = createContext<MegaMenuContextType>(initialContext)

export const MegaMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [runtimeError, setRuntimeErrorState] = useState<MegaMenuRuntimeError | null>(null)

  const openMenu = useCallback(() => setIsOpen(true), [])
  const closeMenu = useCallback(() => setIsOpen(false), [])
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), [])
  const setRuntimeError = useCallback((error: MegaMenuRuntimeError) => setRuntimeErrorState(error), [])
  const clearRuntimeError = useCallback(() => setRuntimeErrorState(null), [])

  return (
    <MegaMenuContext value={{ isOpen, runtimeError, openMenu, closeMenu, toggleMenu, setRuntimeError, clearRuntimeError }}>
      {children}
    </MegaMenuContext>
  )
}

export const useMegaMenu = (): MegaMenuContextType => use(MegaMenuContext)
