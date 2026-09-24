'use client'

import React from 'react'
import { RightRail } from '@/Rail/Right'
import { MegaMenu } from '@/MegaMenu'
import type { PagesData } from '@/getPagesData'
import { MegaMenuProvider, useMegaMenu } from '@/providers/MegaMenu'
import { usePathname } from 'next/navigation'

const LayoutClientContent = ({
  children,
  header,
  footer,
  leftRail,
  pagesData,
}: {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
  leftRail: React.ReactNode
  pagesData?: PagesData[]
}) => {
  const { isOpen, openMenu, closeMenu } = useMegaMenu()
  const pathname = usePathname()
  const currentPage = pagesData?.find((page) => page.href === pathname)

  return (
    <>
      <div className="mx-auto grid w-full max-w-380 grid-cols-1 lg:grid-cols-[72px_minmax(0,1fr)_72px]">
        {/* Left rail */}
        {leftRail}

        {/* Main Site */}
        <div className="flex min-h-screen flex-col">
          {header}
          {children}
          {footer}
        </div>

        {/* Right rail */}
        <RightRail onMenuOpen={openMenu} sections={currentPage?.sections ?? []} />
      </div>

      {/* Mega menu */}
      <MegaMenu open={isOpen} onClose={closeMenu} pages={pagesData ?? []} />
    </>
  )
}

export const LayoutClient = (props: {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
  leftRail: React.ReactNode
  pagesData?: PagesData[]
}) => {
  return (
    <MegaMenuProvider>
      <LayoutClientContent {...props} />
    </MegaMenuProvider>
  )
}
