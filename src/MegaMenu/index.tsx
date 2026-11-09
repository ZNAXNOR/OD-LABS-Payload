'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { MegaMenuHeader } from './Nav/header'
import { MegaMenuFooter } from './Nav/footer'
import { MegaMenuMain } from './main'
import { useCurrentPost } from './hooks/useCurrentPost'
import { resolveCurrentPage } from './utils/resolveCurrentPage'
import type { PagesData } from '../getPagesData'
import type { LegalPagesData } from '../getLegalPagesData'
import type { PostsData } from '../getPostsData'
import type { ContactSocial } from '@/payload-types'
import type { MegaMenuRuntimeError } from '@/providers/MegaMenu'

interface MegaMenuProps {
  open: boolean
  onClose: () => void
  pages: PagesData[]
  legalPages: LegalPagesData[]
  posts?: PostsData[]
  contactSocials?: ContactSocial | null
  runtimeError?: MegaMenuRuntimeError | null
}

export const MegaMenu = ({
  open, onClose, pages, legalPages, posts = [], contactSocials, runtimeError,
}: MegaMenuProps) => {
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const activePost = useCurrentPost(pathname, posts)
  const currentPage = resolveCurrentPage({ pathname, pages, legalPages, posts, activePost, runtimeError })

  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    menuRef.current?.querySelector<HTMLElement>('[data-menu-close]')?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !menuRef.current) return
      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true')
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = originalOverflow }
  }, [open])

  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-label="OD LABS navigation"
      aria-modal={open}
      aria-hidden={!open}
      inert={!open}
      className={[
        'fixed inset-0 z-50 flex flex-col bg-[#0A0A0A]',
        'transition-opacity duration-300',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
    >
      <MegaMenuHeader onClose={onClose} />
      <MegaMenuMain pages={pages} currentPage={currentPage} contactSocials={contactSocials} open={open} />
      <MegaMenuFooter legalPages={legalPages} showReportIssue={currentPage.type !== 'error'} />
    </div>
  )
}
