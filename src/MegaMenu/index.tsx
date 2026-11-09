'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { MegaMenuHeader } from './Nav/header'
import { MegaMenuFooter } from './Nav/footer'
import { MegaMenuMain } from './main'
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
  const currentPage = resolveCurrentPage({ pathname, pages, legalPages, posts, runtimeError })

  useEffect(() => {
    if (!open) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = originalOverflow }
  }, [open])

  return (
    <div
      role="dialog"
      aria-label="OD LABS navigation"
      aria-modal={open}
      aria-hidden={!open}
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
