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
  const { closeModal } = useModal()

  return (
    <Modal
      slug="mega-menu"
      className="fixed inset-0 h-[100dvh] z-50 overflow-hidden bg-neutral-950 transition-all duration-300 ease-in-out"
    >
      <div className="bg-neutral-800 h-full overflow-y-auto">
        <div className="bg-neutral-950 pb-16 min-h-full">
          {/* Drawer Top Bar */}
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="py-16 flex items-center justify-between">
              <Link aria-label="Home" href="/" onClick={() => closeModal('mega-menu')}>
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
                  onClick={() => closeModal('mega-menu')}
                  className="group -m-2.5 rounded-full p-2.5 transition hover:bg-white/10"
                  aria-label="Close navigation"
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

          {/* Navigation Grid */}
          <nav className="mt-px font-display text-5xl font-medium tracking-tight text-white w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-neutral-800 border-y border-neutral-800 w-full">
              {navItems.map(({ link }: any, i: number) => (
                <CMSLink
                  key={i}
                  {...link}
                  className="group relative isolate bg-neutral-950 px-6 py-10 sm:px-16 sm:py-16 block"
                  onClick={() => closeModal('mega-menu')}
                >
                  <span className="absolute inset-y-0 -z-10 w-full bg-neutral-900 opacity-0 transition group-odd:right-0 group-even:left-0 group-hover:opacity-100" />
                </CMSLink>
              ))}
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
