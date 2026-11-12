'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { RightRail } from '@/Rail/Right'
import type { PagesData } from '@/getPagesData'
import type { LegalPagesData } from '@/getLegalPagesData'
import type { PostsData } from '@/getPostsData'
import type { ContactSocial } from '@/payload-types'
import { MegaMenuProvider, useMegaMenu } from '@/providers/MegaMenu'
import { usePathname } from 'next/navigation'

// Keep the large navigation experience out of the initial client bundle.
// It is mounted only after the visitor opens the menu.
const MegaMenu = dynamic(
  () => import('@/MegaMenu').then((module) => module.MegaMenu),
  {
    ssr: false,
    loading: () => (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0A] text-sm font-mono tracking-widest text-zinc-400 uppercase"
        role="status"
        aria-live="polite"
      >
        Loading navigation…
      </div>
    ),
  },
)

const LayoutClientContent = ({
  children, header, footer, leftRail, pagesData, legalPagesData, postsData, contactSocials,
}: {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
  leftRail: React.ReactNode
  pagesData?: PagesData[]
  legalPagesData?: LegalPagesData[]
  postsData?: PostsData[]
  contactSocials?: ContactSocial | null
}) => {
  const { isOpen, openMenu, closeMenu, runtimeError } = useMegaMenu()
  const pathname = usePathname()
  const normalizedPath = pathname ? pathname.replace(/\/$/, '') || '/' : '/'
  const currentPage = pagesData?.find((page) => page.href === pathname || page.href === normalizedPath)

  return (
    <>
      <div className="mx-auto grid w-full max-w-380 grid-cols-1 lg:grid-cols-[72px_minmax(0,1fr)_72px]">
        {leftRail}
        <div className="flex min-h-screen min-w-0 flex-col">
          {header}
          <main id="main-content" className="flex-1">{children}</main>
          {footer}
        </div>
        <RightRail onMenuOpen={openMenu} sections={currentPage?.sections ?? []} />
      </div>
      {isOpen ? (
        <MegaMenu
          open={isOpen}
          onClose={closeMenu}
          pages={pagesData ?? []}
          legalPages={legalPagesData ?? []}
          posts={postsData ?? []}
          contactSocials={contactSocials}
          runtimeError={runtimeError}
        />
      ) : null}
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
  postsData?: PostsData[]
  contactSocials?: ContactSocial | null
}) => (
  <MegaMenuProvider>
    <LayoutClientContent {...props} />
  </MegaMenuProvider>
)
