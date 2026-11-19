'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useMegaMenu } from '@/providers/MegaMenu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import { Menu as MenuIcon } from 'lucide-react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { AppearanceControls } from '@/components/AppearanceControls'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const { openMenu } = useMegaMenu()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <header
      className="site-header relative z-20 bg-surface/80 backdrop-blur-md"
      {...(headerTheme ? { 'data-theme': headerTheme } : {})}
    >
      <div className="flex items-center justify-between border-b border-border-default px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <Logo
            loading="eager"
            priority="high"
            className="h-[18px]"
          />
        </Link>

        <div className="hidden lg:block">
          <HeaderNav data={data} />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
        <AppearanceControls />
        <button
          type="button"
          onClick={openMenu}
          className="group flex cursor-pointer items-center p-1.5 text-zinc-400 focus:outline-none lg:hidden"
          aria-label="Explore Site"
        >
          <MenuIcon className="transition-colors duration-200 group-hover:text-odl" />
        </button>
        </div>
      </div>
    </header>
  )
}
