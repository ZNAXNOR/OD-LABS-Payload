'use client'

import { useState } from 'react'

import { MegaMenu_CurrentPage } from './Sections/currentPage'
import { MegaMenuPage, megaMenuPages } from './Sections/pageData'
import { MegaMenu_PageIndex } from './Sections/pageIndex'
import { MegaMenu_ContextPreview } from './Sections/contextPreview'

export const MegaMenuMain = () => {
  const [hoveredPage, setHoveredPage] = useState<MegaMenuPage | null>(null)

  return (
    <main className="flex-1 min-h-0 overflow-y-auto">
      <div className="mx-auto w-full max-w-380 px-6 lg:px-12 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 lg:gap-16">
          {/* Primary Navigation Section */}
          <div className="lg:col-span-7 flex flex-col space-y-12 lg:space-y-16">
            <MegaMenu_CurrentPage />

            <MegaMenu_PageIndex
              pages={megaMenuPages}
              activePage={hoveredPage}
              onPageHover={setHoveredPage}
              onPageLeave={() => setHoveredPage(null)}
            />
          </div>

          {/* Context Section */}
          <aside className="lg:col-span-3 flex flex-col justify-between h-full">
            <div className="space-y-8">
              <MegaMenu_ContextPreview page={hoveredPage} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
