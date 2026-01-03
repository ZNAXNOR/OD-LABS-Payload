'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { HeaderNav } from './Nav'
import { HeaderBar } from './HeaderBar'
import { cn } from '@/utilities/ui'

import { useHeaderScroll } from './hooks/useHeaderScroll'

interface HeaderClientProps {
  data: Header
}

export function HeaderClient({ data }: HeaderClientProps) {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isScrolled = useHeaderScroll()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const { navLinks, megaMenu, mobileMenu } = HeaderNav({
    data,
    isScrolled,
    openDropdown,
    setOpenDropdown,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  })

  const isMegaMenuVisible =
    openDropdown !== null && data.tabs?.[openDropdown] && data.tabs[openDropdown].enableDropdown

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <HeaderBar
        isScrolled={isScrolled}
        openDropdown={openDropdown}
        isMobileMenuOpen={isMobileMenuOpen}
        navLinks={navLinks}
      />

      {/* MegaMenu Area (Behind) */}
      {megaMenu}

      {/* Mobile Menu Modal (Separate from bar context) */}
      {mobileMenu}

      {/* Global Backdrop Blur - Only for Dropdowns */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-500 pointer-events-none -z-10',
          isMegaMenuVisible ? 'opacity-100' : 'opacity-0 invisible',
        )}
      />
    </header>
  )
}
