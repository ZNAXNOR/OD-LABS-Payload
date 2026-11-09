'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
  const contextPanelRef = useRef<HTMLElement | null>(null)
  const activatePreview = useCallback((page: PagesData) => setPreviewPage(page), [])
  const menuAim = useMenuAim({ panelRef: contextPanelRef, onActivate: activatePreview, enabled: open })

  useEffect(() => {
    if (!open) setPreviewPage(null)
  }, [open])

  return (
    <main className="min-h-0 flex-1 overflow-y-auto" onPointerMove={menuAim.onPointerMove}>
      <div className="mx-auto w-full max-w-380 px-6 py-10 lg:px-12 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-10 lg:gap-16">
          <div className="flex flex-col space-y-12 lg:col-span-7 lg:space-y-16">
            <MegaMenu_CurrentPage page={currentPage} />
            <MegaMenu_PageIndex
              pages={pages}
              activePage={currentPage}
              previewPage={previewPage}
              onPagePointerEnter={menuAim.onPagePointerEnter}
              onPageFocus={menuAim.onPageFocus}
            />
          </div>
          <aside
            ref={contextPanelRef}
            onPointerEnter={menuAim.onPanelPointerEnter}
            className="flex h-full flex-col justify-between lg:col-span-3"
            aria-label="Navigation context"
          >
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
