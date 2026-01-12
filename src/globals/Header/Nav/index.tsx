'use client'

import React, { useEffect, useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'
import { MobileMenuToggle, MobileMenuModal } from './Mobile'
import { DesktopNavLinks, DesktopMegaMenu } from './Desktop'
import { CMSLink } from '@/components/CMSLink'
import { cn } from '@/utilities/ui'
import { usePathname } from 'next/navigation'

export function HeaderNav({
  data,
  isScrolled,
  openDropdown,
  setOpenDropdown,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  data: HeaderType
  isScrolled: boolean
  openDropdown: number | null
  setOpenDropdown: (index: number | null) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
}) {
  const pathname = usePathname()

  const tabs = data?.tabs || []
  const menuCta = data?.menuCta

  // Close menus on path change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setOpenDropdown(null)
  }, [pathname, setOpenDropdown, setIsMobileMenuOpen])

  // Disable scroll when menu is open
  useEffect(() => {
    if (openDropdown !== null || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [openDropdown, isMobileMenuOpen])

  return {
    navLinks: (
      <>
        <DesktopNavLinks
          tabs={tabs}
          isScrolled={isScrolled}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <MobileMenuToggle
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
          menuCta={menuCta}
        />

        <div
          className={cn(
            'hidden lg:flex items-center ml-4 transition-[padding] duration-500',
            isScrolled || openDropdown !== null || isMobileMenuOpen ? 'py-4' : 'py-8',
          )}
        >
          {menuCta && (
            <CMSLink
              {...menuCta}
              appearance="default"
              className="!bg-brand-primary !text-white !font-bold !rounded-full !border-0 hover:!bg-brand-primary/80 hover:!scale-105 active:!scale-95 transition-all"
            />
          )}
        </div>
      </>
    ),
    megaMenu: (
      <DesktopMegaMenu tabs={tabs} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
    ),
    mobileMenu: (
      <MobileMenuModal
        tabs={tabs}
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        menuCta={menuCta}
      />
    ),
  }
}
