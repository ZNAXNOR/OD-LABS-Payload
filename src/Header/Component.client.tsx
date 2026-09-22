'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useMegaMenu } from '@/providers/MegaMenu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Menu as MenuIcon } from 'lucide-react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const { openMenu } = useMegaMenu()
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
    <header className="relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-5 px-6 flex justify-between items-center border-b border-[#4B525F]">
        <Link href="/" className="flex items-center gap-2">
          <Logo loading="eager" priority="high" className="invert dark:invert-0 h-[18px]" />
        </Link>

        <div className="hidden lg:block">
          <HeaderNav data={data} />
        </div>

        <button
          type="button"
          onClick={openMenu}
          className="group flex items-center p-1.5 text-zinc-400 focus:outline-none cursor-pointer lg:hidden"
          aria-label="Explore Site"
        >
          <MenuIcon className="group-hover:text-[#FF3B30] transition-colors duration-200" />
        </button>
      </div>
    </header>
  )
}
