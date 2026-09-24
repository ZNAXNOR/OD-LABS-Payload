import type { PagesData } from '../../getPagesData'

interface MegaMenu_PageIndexProps {
  pages: PagesData[]
  activePage: PagesData | null
  hoveredPage: PagesData | null
  onPageHover: (page: PagesData) => void
  onPageLeave: () => void
}

export const MegaMenu_PageIndex = ({
  pages = [],
  activePage,
  hoveredPage,
  onPageHover,
  onPageLeave,
}: MegaMenu_PageIndexProps) => {
  return (
    <section className="mt-12 lg:mt-16 space-y-6">
      <div className="font-mono text-xs tracking-widest uppercase text-zinc-500">Pages</div>

      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-x-0 gap-y-0">
        {pages.map((page, index) => {
          const isCurrent = activePage?.slug === page.slug
          const isHovered = hoveredPage?.slug === page.slug

          return (
            <a
              key={page.slug}
              href={page.href}
              onMouseEnter={() => onPageHover(page)}
              onMouseLeave={onPageLeave}
              onFocus={() => onPageHover(page)}
              onBlur={onPageLeave}
              className={[
                'flex w-full items-center justify-between',
                'min-h-16 pb-5',
                'font-mono text-2xl sm:text-3xl lg:text-4xl font-semibold',
              ].join(' ')}
            >
              {/* Page Title Link */}
              <span
                className={[
                  'inline-flex items-center',
                  'transition-[letter-spacing] duration-300',
                  isHovered ? 'tracking-normal' : 'tracking-tight',
                ].join(' ')}
              >
                {/* Left Bracket Flair */}
                <span
                  aria-hidden="true"
                  className={[
                    'text-[#FF3B30] mr-1.5',
                    'transition-opacity duration-150',
                    isCurrent || isHovered ? 'opacity-100' : 'opacity-0',
                  ].join(' ')}
                >
                  {'['}
                </span>

                {/* Page Title */}
                <span
                  className={[
                    'transition-colors duration-300',
                    isHovered ? 'text-[#FF3B30]' : 'text-white',
                  ].join(' ')}
                >
                  {page.title}
                </span>

                {/* Right Bracket Flair */}
                <span
                  aria-hidden="true"
                  className={[
                    'text-[#FF3B30] ml-1.5',
                    'transition-opacity duration-150',
                    isCurrent || isHovered ? 'opacity-100' : 'opacity-0',
                  ].join(' ')}
                >
                  {']'}
                </span>
              </span>

              {/* Page Index */}
              <span
                className={[
                  'text-xs font-mono font-normal',
                  'transition-colors duration-300 sm:pr-15',
                  isCurrent || isHovered ? 'text-[#FF3B30]' : 'text-zinc-500',
                ].join(' ')}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
            </a>
          )
        })}
      </nav>
    </section>
  )
}
