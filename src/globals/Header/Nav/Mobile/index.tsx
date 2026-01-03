'use client'
import React from 'react'
import { MobileMenuToggle } from './MobileMenuToggle'
import { MobileMenuModal } from './MobileMenuModal'

export { MobileMenuToggle, MobileMenuModal }

// Default export if needed for simple usage
export const MobileNav = ({ tabs, isMobileMenuOpen, setIsMobileMenuOpen, menuCta }: any) => {
  return (
    <>
      <MobileMenuToggle
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        menuCta={menuCta}
      />
      <MobileMenuModal
        tabs={tabs}
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        menuCta={menuCta}
      />
    </>
  )
}
