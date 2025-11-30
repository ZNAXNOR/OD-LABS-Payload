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
      className="fixed top-0 left-0 right-0 z-header p-10 flex justify-between items-start pointer-events-none"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="pointer-events-auto">
        <Link href="/" className="block bg-od-red p-3">
          <Logo loading="eager" priority="high" className="brightness-0 invert" />
        </Link>
      </div>
      <div className="pointer-events-auto">
        <HeaderNav
          data={data}
          megaMenu={megaMenu}
          socialMedia={socialMedia}
          onMenuToggle={setMenuActive}
        />
      </div>
    </header>
  )
}
