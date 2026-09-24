import { Menu as MenuIcon } from 'lucide-react'
import type { PagesData } from '@/getPagesData'

import { handleSectionScroll } from './sectionScroll'
import { useActiveSection } from './activeSection'
import { getVisibleSections } from './visibleSections'

type RightRailProps = {
  onMenuOpen: () => void
  sections: PagesData['sections']
}

export const RightRail = ({ onMenuOpen, sections }: RightRailProps) => {
  const activeSection = useActiveSection(sections)
  const visibleSections = getVisibleSections(sections, activeSection)

  return (
    <aside
      className="sticky top-0 z-40 hidden h-screen w-[72px] flex-col items-center border-l border-zinc-600 lg:flex"
      aria-label="Site navigation"
    >
      {/* MegaMenu */}
      <button
        onClick={onMenuOpen}
        className="group sticky top-6 mt-6 flex cursor-pointer flex-col items-center p-1.5 text-zinc-400 focus:outline-none"
        aria-label="Explore Site"
      >
        <MenuIcon className="transition-colors duration-200 group-hover:text-[#FF3B30]" />
        <span className="rotate-180 pb-2 font-mono text-sm tracking-wide uppercase transition-colors duration-300 [writing-mode:vertical-rl] group-hover:text-white">
          Explore Site
        </span>
      </button>

      {/* Page Sections */}
      <nav aria-label="Section navigation" className="bottom-16 mt-auto mb-16">
        <ol className="flex flex-col items-center gap-4">
          {visibleSections.map(({ section, index, isCompressed }) => (
            <li key={section.id}>
              <a
                href={section.href}
                onClick={(event) => handleSectionScroll({ section, event })}
                aria-label={`Go to ${section.label}`}
                className="group flex items-center justify-center p-1.5"
              >
                <span className="pointer-events-none absolute right-full mr-3 -translate-x-1 border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-[12px] tracking-widest whitespace-nowrap text-zinc-300 uppercase opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100">
                  {String(index + 1).padStart(2, '0')} / {section.label}
                </span>

                <span
                  className={[
                    'block h-2 w-2 rounded-full border transition-all duration-200',
                    isCompressed
                      ? '- size-1.5 border border-zinc-700 bg-zinc-900 opacity-100'
                      : 'size-2',
                    activeSection === section.id
                      ? 'border-[#FF3B30] bg-[#FF3B30]'
                      : 'border-zinc-700 bg-zinc-900',
                  ].join(' ')}
                />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  )
}
