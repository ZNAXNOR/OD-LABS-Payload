'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header, Contact } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { Megamenu } from './Megamenu'
import { ModalToggler } from '@faceless-ui/modal'
import { CMSLink } from '@/components/Link'
import { SearchIcon } from 'lucide-react'

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
    <header className="container relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-[31px] flex justify-between items-center">
        <Link href="/">
          <Logo loading="eager" priority="high" theme={theme as 'light' | 'dark' | undefined} />
        </Link>

        <div className="flex items-center gap-4">
          {contactLink && (
            <CMSLink
              {...contactLink}
              className="hidden sm:inline-flex rounded-full px-5 py-2 text-sm font-semibold transition bg-primary text-primary-foreground hover:bg-primary/90"
              appearance="default" // Override appearance to ensure proper specific styling if needed, or rely on className
              label="Let's Talk" // Ensure label is present if not in link object, though CMSLink usually handles it
            />
          )}

          <Link
            href="/search"
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground transition hover:opacity-90"
          >
            <span className="sr-only">Search</span>
            <SearchIcon className="w-5 text-primary-foreground" />
          </Link>

          <ModalToggler
            slug="mega-menu"
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground transition hover:opacity-90"
            aria-label="Open menu"
          >
            {/* Solid circle is handled by bg-primary/rounded-full. Icon inside: */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ModalToggler>
        </div>

        <Megamenu
          navItems={navItems}
          contactLink={contactLink}
          displayOffices={displayOffices}
          socialLinks={socialLinks as any} // Cast to satisfy type if there's a strict mismatch in generated types
        />
      </div>
    </header>
  )
}
