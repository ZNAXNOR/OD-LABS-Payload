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
  const { isModalOpen, toggleModal } = useModal()

  const menuActive = isModalOpen(menuSlug)

  useEffect(() => {
    onMenuToggle?.(menuActive)
  }, [menuActive, onMenuToggle])

  return (
    <nav className="flex gap-3 items-center">
      {!menuActive &&
        navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="link" />
        })}
      {!menuActive && (
        <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>
      )}
      <button
        type="button"
        onClick={() => toggleModal(menuSlug)}
        className="inline-flex w-8 h-8 text-white bg-od-gray items-center justify-center rounded-full transition-all hover:ring-2 hover:ring-od-gray/50"
        aria-label="Toggle menu"
        aria-pressed={menuActive}
      >
        <Hamburger active={menuActive} />
      </button>
      <Modal slug={menuSlug} className="fixed inset-0 bg-od-gray z-modal">
        <GridContainer className="h-screen flex items-center">
          <div className="grid grid-cols-1 l:grid-cols-12 gap-16 w-full">
            <nav className="l:col-span-8 space-y-8">
              {megaMenuItems.map(({ link }, i) => (
                <div key={i}>
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
                    >
                      {label}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GridContainer>
      </Modal>
    </nav>
  )
}
