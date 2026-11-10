'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MegaMenu_PageIndex } from './Sections/pageIndex'
import { MegaMenu_ContextPanel } from './context/ContextPanel'
import { MegaMenu_ContextDefault } from './Sections/contextDefault'
import type { PagesData } from '../getPagesData'
import type { PostsData } from '../getPostsData'
import type { LegalPagesData } from '../getLegalPagesData'
import type { ContactSocial } from '@/payload-types'
import type { CurrentPageInfo } from './types'
import { buildMegaMenuCategories } from './registry'
import type { MegaMenuEntry } from './registry'

interface Props {
  pages: PagesData[]
  posts: PostsData[]
  legalPages: LegalPagesData[]
  currentPage: CurrentPageInfo
  contactSocials?: ContactSocial | null
  open: boolean
}

export const MegaMenuMain = ({ pages, posts, legalPages, currentPage, contactSocials, open }: Props) => {
  const categories = useMemo(() => buildMegaMenuCategories(pages, posts, legalPages), [pages, posts, legalPages])
  const [activeCategory, setActiveCategory] = useState('pages')
  const [hoveredEntry, setHoveredEntry] = useState<MegaMenuEntry | null>(null)
  const [pinnedEntry, setPinnedEntry] = useState<MegaMenuEntry | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const selectedEntry = hoveredEntry ?? pinnedEntry
  const normalizeHref = (href: string) => href.length > 1 ? href.replace(/\/+$/, '') : href
  // The current route remains the current-page context, even when its index
  // entry is hovered or pinned. It must not switch into preview treatment.
  const previewEntry = selectedEntry && normalizeHref(selectedEntry.href) !== normalizeHref(currentPage.href)
    ? selectedEntry
    : null
  const clearTimer = useCallback(() => { if (timer.current) clearTimeout(timer.current); timer.current = null }, [])
  const resetPreview = useCallback(() => { clearTimer(); setHoveredEntry(null); setPinnedEntry(null) }, [clearTimer])
  const scheduleHoverReset = useCallback(() => { clearTimer(); timer.current = setTimeout(() => setHoveredEntry(null), 250) }, [clearTimer])
  const handleHover = useCallback((entry: MegaMenuEntry) => { clearTimer(); setHoveredEntry(entry) }, [clearTimer])
  const handleSelect = useCallback((entry: MegaMenuEntry) => { clearTimer(); setPinnedEntry(entry); setHoveredEntry(null) }, [clearTimer])

  useEffect(() => {
    if (!open) { resetPreview(); setActiveCategory('pages') }
    return clearTimer
  }, [open, resetPreview, clearTimer])

  return (
    <main className="min-h-0 flex-1 overflow-y-auto lg:overflow-hidden">
      <div className="mx-auto flex min-h-full w-full max-w-380 flex-col px-6 py-7 lg:h-full lg:min-h-0 lg:px-12 lg:py-8">
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div
            className="flex min-h-0 min-w-0 flex-col lg:col-span-9"
            onPointerEnter={clearTimer}
            onPointerLeave={scheduleHoverReset}
            onClick={(event) => {
              if (!(event.target instanceof Element) || !event.target.closest('button,a,input,select,textarea,[role="tab"]')) resetPreview()
            }}
          >
            <div className="min-h-0 lg:flex-[0_1_55%] lg:min-h-0 lg:max-h-[55%] lg:overflow-hidden lg:pr-2">
              <MegaMenu_ContextPanel currentPage={currentPage} preview={previewEntry} />
            </div>
            <MegaMenu_PageIndex
              categories={categories}
              activeCategory={activeCategory}
              previewEntry={previewEntry}
              currentHref={currentPage.href}
              onCategoryChange={(slug) => { setActiveCategory(slug); setHoveredEntry(null); setPinnedEntry(null) }}
              onEntryHover={handleHover}
              onEntryLeave={scheduleHoverReset}
              onEntrySelect={handleSelect}
            />
          </div>
          <div className="min-w-0 border-t border-zinc-800/80 pt-7 lg:col-span-3 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <MegaMenu_ContextDefault contactSocials={contactSocials} active={open} />
          </div>
        </div>
      </div>
    </main>
  )
}
