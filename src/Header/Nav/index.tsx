'use client'

import React from 'react'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { ModalToggler, useModal } from '@faceless-ui/modal'

import type { Header as HeaderType, Contact } from '@/payload-types'
import { CMSLink } from '@/components/Link'

interface HeaderNavProps {
  data: HeaderType
  contact: Contact
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, contact }) => {
  const { isModalOpen } = useModal()
  const isMegaMenuOpen = isModalOpen('mega-menu')
  const contactLink = contact?.contactPageLink

  return (
    <nav className="flex items-center gap-4">
      {contactLink && (
        <CMSLink
          {...contactLink}
          className="hidden sm:inline-flex rounded-full px-5 py-2 text-sm font-semibold transition bg-primary text-primary-foreground hover:opacity-90 active:scale-95"
          label="Let's Talk"
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
        className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground transition hover:opacity-90 overflow-hidden"
        aria-label={isMegaMenuOpen ? 'Close menu' : 'Open menu'}
      >
        <div className="relative w-5 h-5">
          {/* Hamburger Icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className={`absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out ${
              isMegaMenuOpen ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'
            }`}
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Close Icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className={`absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out ${
              isMegaMenuOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'
            }`}
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </ModalToggler>
    </nav>
  )
}
