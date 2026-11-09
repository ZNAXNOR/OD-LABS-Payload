'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ErrorReporter } from './error/ErrorReporter'
import { MegaMenu_CurrentPage } from './Sections/currentPage'
import { MegaMenu_PageIndex } from './Sections/pageIndex'
import { MegaMenu_ContextPreview } from './Sections/contextPreview'
import { useMenuAim } from './hooks/useMenuAim'
import type { PagesData } from '../getPagesData'
import type { CurrentPageInfo } from './types'
import type { ContactSocial } from '@/payload-types'

interface MegaMenuMainProps {
  pages: PagesData[]
  currentPage: CurrentPageInfo
  contactSocials?: ContactSocial | null
  open: boolean
}

export const MegaMenuMain = ({ pages, currentPage, contactSocials, open }: MegaMenuMainProps) => {
  const [previewPage, setPreviewPage] = useState<PagesData | null>(null)
  const [mobileContextOpen, setMobileContextOpen] = useState(false)
  const contextPanelRef = useRef<HTMLElement | null>(null)
  const activatePreview = useCallback((page: PagesData) => setPreviewPage(page), [])
  const menuAim = useMenuAim({ panelRef: contextPanelRef, onActivate: activatePreview, enabled: open })

  const handlePageFocus = useCallback((page: PagesData) => {
    menuAim.onPageFocus(page)
  }, [menuAim.onPageFocus])

  const handlePageSelect = useCallback((page: PagesData) => {
    menuAim.onPageFocus(page)
    setMobileContextOpen(true)
  }, [menuAim.onPageFocus])

  useEffect(() => {
    if (!open) {
      setPreviewPage(null)
      setMobileContextOpen(false)
    }
  }, [open])

  return (
    <main className="min-h-0 flex-1 overflow-y-auto" onPointerMove={menuAim.onPointerMove}>
      <div className="mx-auto w-full max-w-380 px-6 py-10 lg:px-12 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-10 lg:gap-16">
          <div className={['flex flex-col space-y-12 lg:col-span-7 lg:space-y-16', mobileContextOpen ? 'hidden lg:flex' : 'flex'].join(' ')}>
            <MegaMenu_CurrentPage page={currentPage} />
            <MegaMenu_PageIndex
              pages={pages}
              activePage={currentPage}
              previewPage={previewPage}
              onPagePointerEnter={menuAim.onPagePointerEnter}
              onPageFocus={handlePageFocus}
              onPageSelect={handlePageSelect}
            />
          </div>

          <aside
            ref={contextPanelRef}
            onPointerEnter={menuAim.onPanelPointerEnter}
            className={['h-full flex-col justify-between lg:col-span-3', mobileContextOpen ? 'flex' : 'hidden lg:flex'].join(' ')}
            aria-label="Navigation context"
          >
            {mobileContextOpen && currentPage.type === 'error' && previewPage && (
              <ErrorReporter error={currentPage.error} className="mb-6" />
            )}
            {mobileContextOpen && (
              <Button type="button" variant="ghost" size="sm" className="mb-6 self-start px-0! py-0! text-zinc-400 hover:text-white lg:hidden" onClick={() => setMobileContextOpen(false)}>
                <ArrowLeft aria-hidden="true" /> Back to pages
              </Button>
            )}
            <MegaMenu_ContextPreview
              page={previewPage}
              currentPage={currentPage}
              contactSocials={contactSocials}
              open={open}
            />
          </aside>
        </div>
      </div>
    </main>
  )
}
