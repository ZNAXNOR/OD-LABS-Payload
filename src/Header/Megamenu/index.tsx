'use client'
import Link from 'next/link'
import React from 'react'
import { Modal, useModal } from '@faceless-ui/modal'

import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'
import { SocialIcon } from '@/components/SocialIcon'

interface MegamenuProps {
  navItems: any[]
  contactLink: any
  displayOffices: any[]
  socialLinks: Array<{ platform: string; url: string }>
}

export const Megamenu: React.FC<MegamenuProps> = ({
  navItems,
  contactLink,
  displayOffices,
  socialLinks,
}) => {
  const { closeModal, isModalOpen } = useModal()
  const isOpen = isModalOpen('mega-menu')
  const [isPresented, setIsPresented] = React.useState(false)

  React.useEffect(() => {
    let timeout: NodeJS.Timeout
    if (isOpen) {
      // Small delay to ensure the browser has painted the initial opacity-0 state
      timeout = setTimeout(() => {
        setIsPresented(true)
      }, 50)
    } else {
      setIsPresented(false)
    }
    return () => clearTimeout(timeout)
  }, [isOpen])

  return (
    <Modal slug="mega-menu" className="fixed inset-0 w-screen h-screen z-50 overflow-hidden">
      <div
        className={`fixed inset-0 bg-neutral-950 transition-opacity duration-500 ease-in-out ${
          isPresented ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`relative h-full overflow-y-auto transition-all duration-500 ease-in-out ${
          isPresented ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="container pb-16 pt-32 sm:pt-40">
          <div className="min-h-full">
            {/* Navigation Grid */}
            <nav className="mt-px font-display text-3xl sm:text-5xl font-medium tracking-tight text-white w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-neutral-800 border-y border-neutral-800 w-full">
                {navItems.map(({ link }: any, i: number) => {
                  const isEven = i % 2 === 0
                  return (
                    <CMSLink
                      key={i}
                      {...link}
                      className={
                        'group relative isolate bg-neutral-950 px-6 py-10 sm:py-16 block ' +
                        (isEven ? 'sm:text-left ' : 'sm:text-left ')
                      }
                      style={{
                        // For left items (even index in 0-based), apply padding left based on container
                        // For right items (odd index), apply standard padding or calc if right-alignment desired
                        // Assuming container is max-w-7xl (roughly 80rem = 1280px) and px-8 (2rem)
                        // We use logic: max(2rem, (100vw - 80rem)/2 + 2rem)
                        paddingLeft: isEven ? 'max(2rem, calc((100vw - 80rem)/2 + 2rem))' : '2rem',
                        paddingRight: !isEven
                          ? 'max(2rem, calc((100vw - 80rem)/2 + 2rem))'
                          : '2rem',
                      }}
                      onClick={() => closeModal('mega-menu')}
                    >
                      <span className="absolute inset-y-0 -z-10 w-full bg-neutral-900 opacity-0 transition group-odd:right-0 group-even:left-0 group-hover:opacity-100" />
                    </CMSLink>
                  )
                })}
              </div>
            </nav>

            {/* Footer Information in Drawer */}
            <div className="relative">
              <div className="py-10 sm:py-16">
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2">
                  {/* Offices */}
                  {displayOffices.length > 0 && (
                    <div>
                      <h2 className="font-display text-xl font-semibold text-white">Our offices</h2>
                      <ul role="list" className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                        {displayOffices.map((office: any, i: number) => (
                          <li key={i}>
                            <address className="text-lg not-italic text-neutral-300">
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
                    <h2 className="font-display text-xl font-semibold text-white">Follow us</h2>
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
    </Modal>
  )
}
