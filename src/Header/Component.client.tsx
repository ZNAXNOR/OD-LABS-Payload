'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header, Contact } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'
import { SocialIcon } from '@/components/SocialIcon'

interface HeaderClientProps {
  data: Header
  contactData: Contact
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, contactData }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const headerData = data as any
  const navItems = headerData?.navItems || []
  const offices = headerData?.offices || []
  const contactLink = headerData?.contactLink?.link

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
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

  // Prepare offices data - prioritize contactData.address
  const displayOffices = []
  if (contactData?.address) {
    displayOffices.push({
      city: contactData.address.city || 'Office',
      address: `${contactData.address.street || ''}\n${contactData.address.postalCode || ''} ${contactData.address.city || ''}\n${contactData.address.country || ''}`,
    })
  } else if (offices.length > 0) {
    displayOffices.push(...offices)
  }

  return (
    <header>
      {/* Closed State Header (Absolute Overlay) */}
      <div
        className="absolute top-0 right-0 left-0 z-40 py-6"
        aria-hidden="true"
        // @ts-expect-error inert is a valid html attribute
        inert={isOpen ? '' : undefined}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="flex items-center justify-between">
              <Link aria-label="Home" href="/">
                <Logo theme="dark" />
              </Link>
              <div className="flex items-center gap-x-8">
                {contactLink && (
                  <CMSLink
                    {...contactLink}
                    className="inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition bg-white text-neutral-950 hover:bg-neutral-200"
                  />
                )}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen(true)}
                  className="group -m-2.5 rounded-full p-2.5 transition hover:bg-white/10"
                  aria-label="Toggle navigation"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-6 w-6 fill-white group-hover:fill-neutral-200"
                  >
                    <path d="M2 6h20v2H2zM2 16h20v2H2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded State Drawer (Relative, Pushes Content) */}
      <div
        style={{
          height: isOpen ? 'auto' : '0',
          visibility: isOpen ? 'visible' : 'hidden', // Hide strictly when closed to avoid blocking clicks
        }}
        className={`relative z-50 overflow-hidden bg-neutral-950 transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-neutral-800">
          <div className="bg-neutral-950 pb-16">
            {/* Drawer Top Bar */}
            <div className="py-6 mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:max-w-none">
                <div className="flex items-center justify-between">
                  <Link aria-label="Home" href="/">
                    <Logo theme="dark" />
                  </Link>
                  <div className="flex items-center gap-x-8">
                    {contactLink && (
                      <CMSLink
                        {...contactLink}
                        className="inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition bg-white text-neutral-950 hover:bg-neutral-200"
                      />
                    )}
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setIsOpen(false)}
                      className="group -m-2.5 rounded-full p-2.5 transition hover:bg-white/10"
                      aria-label="Toggle navigation"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-6 w-6 fill-white group-hover:fill-neutral-200"
                      >
                        <path d="m5.636 4.223 14.142 14.142-1.414 1.414L4.222 5.637z" />
                        <path d="M4.222 18.363 18.364 4.22l1.414 1.414L5.636 19.777z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Grid */}
            <nav className="mt-px font-display text-5xl font-medium tracking-tight text-white">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-neutral-800 border-y border-neutral-800">
                    {navItems.map(({ link }: any, i: number) => (
                      <CMSLink
                        key={i}
                        {...link}
                        className="group relative isolate -mx-6 bg-neutral-950 px-6 py-10 sm:mx-0 sm:px-0 sm:py-16 sm:odd:pr-16 sm:even:pl-16 block"
                      >
                        {link.label}
                        <span className="absolute inset-y-0 -z-10 w-screen bg-neutral-900 opacity-0 transition group-odd:right-0 group-even:left-0 group-hover:opacity-100" />
                      </CMSLink>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* Footer Information in Drawer */}
            <div className="relative bg-neutral-950">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none">
                  <div className="grid grid-cols-1 gap-y-10 pt-10 pb-16 sm:grid-cols-2 sm:pt-16">
                    {/* Offices */}
                    {displayOffices.length > 0 && (
                      <div>
                        <h2 className="font-display text-base font-semibold text-white">
                          Our offices
                        </h2>
                        <ul role="list" className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                          {displayOffices.map((office: any, i: number) => (
                            <li key={i}>
                              <address className="text-sm not-italic text-neutral-300">
                                <strong className="text-white">{office.city}</strong>
                                <br />
                                <span className="whitespace-pre-line">{office.address}</span>
                              </address>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Socials */}
                    <div className="sm:border-l sm:border-transparent sm:pl-16">
                      <h2 className="font-display text-base font-semibold text-white">Follow us</h2>
                      <ul role="list" className="flex gap-x-10 text-white mt-6">
                        {socialLinks.map((social, i) => (
                          <li key={i}>
                            <a
                              aria-label={social.platform}
                              className="transition hover:text-neutral-200"
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <SocialIcon platform={social.platform} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
