'use client'

import React from 'react'
import { RightRail } from '@/Rail/Right'
import { MegaMenu } from '@/MegaMenu'
import type { MegaMenuPage } from '@/MegaMenu/Sections/pageData'
import { MegaMenuProvider, useMegaMenu } from '@/providers/MegaMenu'

const LayoutClientContent = ({
  children,
  header,
  footer,
  leftRail,
  megaMenuData,
}: {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
  leftRail: React.ReactNode
  megaMenuData?: MegaMenuPage[]
}) => {
  const { isOpen, openMenu, closeMenu } = useMegaMenu()

  return (
    <>
      <div className="mx-auto w-full max-w-380 grid grid-cols-1 lg:grid-cols-[64px_minmax(0,1fr)_64px]">
        {/* Left rail */}
        {leftRail}

        {/* Main Site */}
        <div className="flex flex-col min-h-screen">
          {header}
          {children}
          {footer}
        </div>

        {/* Right rail */}
        <RightRail onMenuOpen={openMenu} />
      </div>

      {/* Mega menu */}
      <MegaMenu
        open={isOpen}
        onClose={closeMenu}
        pages={megaMenuData ?? []}
      />
    </>
  )
}

export const LayoutClient = (props: {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
  leftRail: React.ReactNode
  megaMenuData?: MegaMenuPage[]
}) => {
  return (
    <MegaMenuProvider>
      <LayoutClientContent {...props} />
    </MegaMenuProvider>
  )
}
