'use client'

import React, { useEffect } from 'react'

import type { Header as HeaderType, MegaMenu, SocialMedia } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import Hamburger from '../Hamburger'
import { Modal, useModal } from '@faceless-ui/modal'
import { GridContainer } from '@/components/GridContainer'
import { cn } from '@/utilities/ui'
import { usePathname } from 'next/navigation'

const menuSlug = 'menu'

interface HeaderNavProps {
  data: HeaderType
  megaMenu: MegaMenu
  socialMedia: SocialMedia
  onMenuToggle?: (active: boolean) => void
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  data,
  megaMenu,
  socialMedia,
  onMenuToggle,
}) => {
  const navItems = data?.navItems || []
  const megaMenuItems = megaMenu?.navItems || []
  const socialLinks = socialMedia?.links || []
  const { isModalOpen, toggleModal, closeModal } = useModal()
  const pathname = usePathname()

  const menuActive = isModalOpen(menuSlug)
  const isSearchPage = pathname === '/search'

  useEffect(() => {
    onMenuToggle?.(menuActive)
  }, [menuActive, onMenuToggle])

  const handleLinkClick = () => {
    if (menuActive) {
      closeModal(menuSlug)
    }
  }

  return (
    <nav className="flex gap-4 items-center pointer-events-auto">
      <Link
        href="/search"
        className={cn(
          'inline-flex w-12 h-12 items-center justify-center bg-od-gray rounded-full transition-all duration-200 hover:bg-od-gray/80',
          isSearchPage ? 'ring-2 ring-gray-500' : 'ring-2 ring-od-gray',
        )}
        onClick={handleLinkClick}
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="w-6 h-6 text-white" />
      </Link>
      <button
        type="button"
        onClick={() => toggleModal(menuSlug)}
        className={cn(
          'inline-flex w-12 h-12 text-white bg-od-gray items-center justify-center rounded-full transition-all duration-200 hover:bg-od-gray/80',
          menuActive ? 'ring-2 ring-gray-500' : 'ring-2 ring-od-gray',
        )}
        aria-label="Toggle menu"
        aria-pressed={menuActive}
      >
        <Hamburger active={menuActive} />
      </button>
      <Modal slug={menuSlug} className="fixed inset-0 bg-od-gray z-modal w-screen h-screen">
        <div className="w-full h-full flex items-center justify-center px-[calc(var(--baseline-px)*2)]">
          <div className="grid grid-cols-1 l:grid-cols-12 gap-16 w-full max-w-grid-container mx-auto">
            <nav className="l:col-span-8 space-y-8">
              {megaMenuItems.map(({ link }, i) => (
                <div key={i} onClick={handleLinkClick}>
                  <CMSLink
                    {...link}
                    className={cn(
                      'text-4xl m:text-5xl font-normal text-white hover:text-od-antique transition-colors',
                      i === 0 && 'mt-0',
                    )}
                  />
                </div>
              ))}
            </nav>
            {socialLinks.length > 0 && (
              <div className="l:col-span-3 space-y-2">
                {socialLinks.map(({ url, label }) => (
                  <div key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-white hover:text-od-antique transition-colors"
                      onClick={handleLinkClick}
                    >
                      {label}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </nav>
  )
}
