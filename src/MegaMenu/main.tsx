'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MegaMenu_CurrentPage } from './Sections/currentPage'
import { MegaMenu_PageIndex } from './Sections/pageIndex'
import { MegaMenu_ContextPreview } from './Sections/contextPreview'
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
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    resetTimerRef.current = null
  }, [])

  const resetPreview = useCallback(() => {
    clearResetTimer()
    setPreviewPage(null)
  }, [clearResetTimer])

  const schedulePreviewReset = useCallback(() => {
    clearResetTimer()
    resetTimerRef.current = setTimeout(() => setPreviewPage(null), 1800)
  }, [clearResetTimer])

  const handlePreviewSelect = useCallback((page: PagesData) => {
    clearResetTimer()
    setPreviewPage(page)
  }, [clearResetTimer])

  useEffect(() => {
    if (!open) resetPreview()
    return clearResetTimer
  }, [open, resetPreview, clearResetTimer])

  return (
    <main
      className="min-h-0 flex-1 overflow-y-auto lg:overflow-hidden"
      onPointerEnter={clearResetTimer}
      onPointerLeave={schedulePreviewReset}
      onClick={(event) => {
        if (event.target === event.currentTarget) resetPreview()
      }}
    >
      <div className="mx-auto h-full w-full max-w-380 px-6 py-10 lg:px-12 lg:py-12">
        <div className="grid grid-cols-1 gap-12 lg:h-full lg:min-h-0 lg:grid-cols-10 lg:gap-16">
          <section className="flex min-w-0 flex-col space-y-12 lg:col-span-7 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-3 odl-menu-scroll">
            <MegaMenu_CurrentPage page={currentPage} />
            <MegaMenu_PageIndex
              pages={pages}
              activePage={currentPage}
              previewPage={previewPage}
              onPageSelect={handlePreviewSelect}
            />
          </section>

          <aside
            className="min-w-0 border-t border-zinc-800/80 pt-8 lg:col-span-3 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0 odl-menu-scroll"
            aria-label="Navigation context"
          >
            <MegaMenu_ContextPreview
              page={previewPage}
              contactSocials={contactSocials}
              open={open}
            />
          </aside>
        </div>
      </div>
    </main>
  )
}
