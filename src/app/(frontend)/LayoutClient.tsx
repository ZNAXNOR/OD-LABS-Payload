'use client'

import React from 'react'
import { RightRail } from '@/Rail/Right'
import { MegaMenu } from '@/MegaMenu'
import type { PagesData } from '@/getPagesData'
import type { LegalPagesData } from '@/getLegalPagesData'
import { MegaMenuProvider, useMegaMenu } from '@/providers/MegaMenu'
import { usePathname } from 'next/navigation'

const LayoutClientContent = ({
  children,
  header,
  footer,
  leftRail,
  pagesData,
  legalPagesData,
}: {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
  leftRail: React.ReactNode
  pagesData?: PagesData[]
  legalPagesData?: LegalPagesData[]
}) => {
  const { isOpen, openMenu, closeMenu } = useMegaMenu()
  const pathname = usePathname()
  const currentPage = pagesData?.find((page) => page.href === pathname)

  return (
    <>
      <div className="mx-auto grid w-full max-w-380 grid-cols-1 lg:grid-cols-[72px_minmax(0,1fr)_72px]">
        {leftRail}

        <div className="flex min-h-screen min-w-0 flex-col">
          {header}
          <main id="main-content" className="flex-1">
            {children}
          </main>
          {footer}
        </div>

        <RightRail onMenuOpen={openMenu} sections={currentPage?.sections ?? []} />
      </div>

      <MegaMenu
        open={isOpen}
        onClose={closeMenu}
        pages={pagesData ?? []}
        legalPages={legalPagesData ?? []}
      />
    </>
  )
}

export const LayoutClient = (props: {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
  leftRail: React.ReactNode
  pagesData?: PagesData[]
  legalPagesData?: LegalPagesData[]
}) => {
  return (
    <MegaMenuProvider>
      <LayoutClientContent {...props} />
    </MegaMenuProvider>
  )
}
