'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header, Contact } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { Megamenu } from './Megamenu'
import { useModal } from '@faceless-ui/modal'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  contact: Contact
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, contact }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
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

  const { isModalOpen } = useModal()
  const isMegaMenuOpen = isModalOpen('mega-menu')

  const effectiveTheme = isMegaMenuOpen ? 'dark' : theme

  const navItems = data?.navItems || []
  const contactLink = contact?.contactPageLink
  const socialLinks = contact?.socialLinks || []

  const displayOffices =
    contact?.offices?.map((office) => ({
      ...office,
      // Create a formatted address string for the Megamenu
      address: [office.street, office.city, office.state, office.postalCode, office.country]
        .filter(Boolean)
        .join('\n'),
    })) || []

  return (
    <header
      className="container sticky top-0 z-[120] transition-all duration-300"
      {...(effectiveTheme ? { 'data-theme': effectiveTheme } : {})}
    >
      <div className="py-[31px] flex justify-between items-center">
        <Link href="/">
          <Logo
            loading="eager"
            priority="high"
            theme={effectiveTheme as 'light' | 'dark' | undefined}
          />
        </Link>
        <HeaderNav data={data} contact={contact} />
      </div>
      <Megamenu
        navItems={navItems}
        contactLink={contactLink}
        displayOffices={displayOffices}
        socialLinks={socialLinks as any}
      />
    </header>
  )
}
