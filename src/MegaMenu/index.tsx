'use client'

import { MegaMenuHeader } from './Nav/header'
import { MegaMenuFooter } from './Nav/footer'
import { useEffect } from 'react'
import { MegaMenuMain } from './main'
import { usePathname } from 'next/navigation'

import type { PagesData } from '../getPagesData'

interface MegaMenuProps {
  open: boolean
  onClose: () => void
  pages: PagesData[]
}

export const MegaMenu = ({ open, onClose, pages }: MegaMenuProps) => {
  const pathname = usePathname()
  const currentSlug = pathname === '/' ? 'home' : pathname.split('/')[1] || 'home'
  const currentPage = pages.find((page) => page.slug === currentSlug) || null

  useEffect(() => {
    if (!open) return

    const handleESC = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleESC)

    return () => document.removeEventListener('keydown', handleESC)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return

    //Disable scroll on body when megamenu opens
    const originalStyle = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [open])

  return (
    <div
      className={[
        'fixed inset-0 z-50 bg-[#0A0A0A]',
        'flex flex-col',
        'transition-opacity duration-300',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      ].join(' ')}
      aria-hidden={!open}
      aria-modal="true"
    >
      <MegaMenuHeader onClose={onClose} />

      <MegaMenuMain pages={pages} currentPage={currentPage} />

      <MegaMenuFooter />
    </div>
  )
}
