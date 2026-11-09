'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MegaMenu_PageIndex } from './Sections/pageIndex'
import { MegaMenu_ContextPanel } from './context/ContextPanel'
import type { PagesData } from '../getPagesData'
import type { PostsData } from '../getPostsData'
import type { CurrentPageInfo } from './types'
import { buildMegaMenuCategories } from './registry'
import type { MegaMenuEntry } from './registry'
interface Props { pages: PagesData[]; posts: PostsData[]; currentPage: CurrentPageInfo; open: boolean }
export const MegaMenuMain = ({ pages, posts, currentPage, open }: Props) => {
  const categories = useMemo(() => buildMegaMenuCategories(pages, posts), [pages, posts])
  const [activeCategory, setActiveCategory] = useState('pages')
  const [hoveredEntry, setHoveredEntry] = useState<MegaMenuEntry | null>(null)
  const [pinnedEntry, setPinnedEntry] = useState<MegaMenuEntry | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previewEntry = hoveredEntry ?? pinnedEntry
  const clearTimer = useCallback(() => { if (timer.current) clearTimeout(timer.current); timer.current = null }, [])
  const resetPreview = useCallback(() => { clearTimer(); setHoveredEntry(null); setPinnedEntry(null) }, [clearTimer])
  const scheduleHoverReset = useCallback(() => { clearTimer(); timer.current = setTimeout(() => setHoveredEntry(null), 250) }, [clearTimer])
  const handleHover = useCallback((entry: MegaMenuEntry) => { clearTimer(); setHoveredEntry(entry) }, [clearTimer])
  const handleSelect = useCallback((entry: MegaMenuEntry) => { clearTimer(); setPinnedEntry(entry); setHoveredEntry(null) }, [clearTimer])
  useEffect(() => {
    if (!open) { resetPreview(); setActiveCategory('pages') }
    return clearTimer
  }, [open, resetPreview, clearTimer])
  return <main className="min-h-0 flex-1 overflow-y-auto lg:overflow-hidden" onPointerEnter={clearTimer} onPointerLeave={scheduleHoverReset}
    onClick={(event) => { if (event.target === event.currentTarget) resetPreview() }}>
    <div className="mx-auto flex min-h-full w-full max-w-380 flex-col px-6 py-7 lg:h-full lg:min-h-0 lg:px-12 lg:py-8"
      onClick={(event) => { if (event.target === event.currentTarget) resetPreview() }}>
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <MegaMenu_ContextPanel currentPage={currentPage} preview={previewEntry} />
        <MegaMenu_PageIndex categories={categories} activeCategory={activeCategory} previewEntry={previewEntry} currentHref={currentPage.href}
          onCategoryChange={(slug) => { setActiveCategory(slug); setHoveredEntry(null); setPinnedEntry(null) }}
          onEntryHover={handleHover} onEntrySelect={handleSelect} />
      </div>
    </div>
  </main>
}