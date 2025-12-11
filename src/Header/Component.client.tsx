'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useModal } from '@faceless-ui/modal'

import type { Header, Contact } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'
import { Megamenu } from './Megamenu'

interface HeaderClientProps {
  data: Header
  contactData: any
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, contactData }) => {
  const { toggleModal } = useModal()
  const pathname = usePathname()

  const [theme, setTheme] = useState<string | null>(null)

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const headerData = data as any
  const navItems = headerData?.navItems || []
  const contactLink = headerData?.contactLink?.link

  const offices = contactData?.offices || []

  // Close menu on route change
  useEffect(() => {
    // Modal handles this partially, but we might want to ensure it closes on route change if needed.
    // However, the Megamenu component itself handles 'closeModal' on links.
    // So we don't strictly need logic here unless we want to force close on ANY route change.
    // Faceless UI Modal doesn't automatically close on route change in Next.js app dir usually unless configured.
    // But let's leave it as the Megamenu links handle it.
  }, [pathname])

  // Get social links from Contact global
  const socialLinks: Array<{ platform: string; url: string }> = []
  if (contactData?.facebook) socialLinks.push({ platform: 'facebook', url: contactData.facebook })
  if (contactData?.instagram)
    socialLinks.push({ platform: 'instagram', url: contactData.instagram })
  if (contactData?.twitter) socialLinks.push({ platform: 'twitter', url: contactData.twitter })
  if (contactData?.linkedin) socialLinks.push({ platform: 'linkedin', url: contactData.linkedin })
  if (contactData?.youtube) socialLinks.push({ platform: 'youtube', url: contactData.youtube })
  if (contactData?.github) socialLinks.push({ platform: 'github', url: contactData.github })
  if (contactData?.tiktok) socialLinks.push({ platform: 'tiktok', url: contactData.tiktok })

  // Prepare offices data
  const displayOffices = []
  if (offices.length > 0) {
    displayOffices.push(...offices)
  } else if (contactData?.address) {
    displayOffices.push({
      city: contactData.address.city || 'Office',
      address: `${contactData.address.street || ''}\n${contactData.address.postalCode || ''} ${contactData.address.city || ''}\n${contactData.address.country || ''}`,
    })
  }

  return (
    <header className="container relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
      {/* Closed State Header (Absolute Overlay) */}
      <div className="absolute top-0 right-0 left-0 z-40 py-6" aria-hidden="true">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="py-6 max-w-2xl lg:max-w-none">
            <div className="flex items-center justify-between">
              <Link aria-label="Home" href="/">
                <Logo loading="eager" priority="high" className="invert dark:invert-0" />
              </Link>
              <div className="flex items-center gap-x-8">
                {/* Search Icon */}
                <Link
                  href="/search"
                  className="group -m-2.5 rounded-full p-2.5 transition hover:bg-neutral-950/10 dark:hover:bg-white/10"
                  aria-label="Search"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-6 w-6 fill-neutral-950 dark:fill-white group-hover:fill-neutral-700 dark:group-hover:fill-neutral-200"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                    />
                  </svg>
                </Link>

                {contactLink && (
                  <CMSLink
                    {...contactLink}
                    className="hidden sm:inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                  />
                )}
                <button
                  type="button"
                  onClick={() => toggleModal('mega-menu')}
                  className="group -m-2.5 rounded-full p-2.5 transition hover:bg-neutral-950/10 dark:hover:bg-white/10"
                  aria-label="Toggle navigation"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-6 w-6 fill-neutral-950 dark:fill-white group-hover:fill-neutral-700 dark:group-hover:fill-neutral-200"
                  >
                    <path d="M2 6h20v2H2zM2 16h20v2H2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Megamenu
        navItems={navItems}
        contactLink={contactLink}
        displayOffices={displayOffices}
        socialLinks={socialLinks}
      />
    </header>
  )
}
