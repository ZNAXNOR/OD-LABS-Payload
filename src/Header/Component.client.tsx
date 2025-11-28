'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header, MegaMenu, SocialMedia } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  megaMenu: MegaMenu
  socialMedia: SocialMedia
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, megaMenu, socialMedia }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [menuActive, setMenuActive] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="sticky top-0 z-header bg-background"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-10 gap-4 py-8 items-center">
          {/* Logo at block 1 (column 2) */}
          <div className="col-start-2 col-span-1">
            <Link href="/">
              <Logo loading="eager" priority="high" className="invert dark:invert-0" />
            </Link>
          </div>
          {/* Hamburger at block 9 (column 10) */}
          <div className="col-start-10 col-span-1 flex justify-end">
            <HeaderNav
              data={data}
              megaMenu={megaMenu}
              socialMedia={socialMedia}
              onMenuToggle={setMenuActive}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
