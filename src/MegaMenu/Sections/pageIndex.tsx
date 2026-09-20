import { MegaMenuPage } from './pageData'

interface MegaMenu_PageIndexProps {
  pages: MegaMenuPage[]
  activePage: MegaMenuPage | null
  onPageHover: (page: MegaMenuPage) => void
  onPageLeave: () => void
}

export const MegaMenu_PageIndex = ({
  pages,
  activePage,
  onPageHover,
  onPageLeave,
}: MegaMenu_PageIndexProps) => {
  return (
    <section className="mt-12 lg:mt-16 space-y-6" onMouseLeave={onPageLeave}>
      <div className="font-mono text-xs tracking-widest uppercase text-zinc-500">Pages</div>

      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5">
        {pages.map((page, index) => {
          const isActive = activePage?.title === page.title

          return (
            <a
              key={page.title}
              href="#"
              onMouseEnter={() => onPageHover(page)}
              onFocus={() => onPageHover(page)}
              onBlur={onPageLeave}
              className="group flex item-center justify-between text-white py-2 transition-all font-mono text-2xl sm:text-3xl lg:text-4xl font-semibold"
            >
              <span className="tracking-tight group-hover:tracking-normal transition-all inline-flex items-center">
                <span
                  className={[
                    'text-[#FF3B30] mr-1.5 transition-opacity duration-150',
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                  ].join(' ')}
                >
                  {'['}
                </span>

                <span
                  className={[
                    'transition-colors duration-300',
                    isActive ? 'text-[#FF3B30]' : 'text-white group-hover:text-[#FF3B30]',
                  ].join(' ')}
                >
                  {page.title}
                </span>

                <span
                  className={[
                    'text-[#FF3B30] ml-1.5 transition-opacity duration-150',
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                  ].join(' ')}
                >
                  {']'}
                </span>
              </span>

              <span
                className={[
                  'text-xs font-mono font-normal transition-colors',
                  isActive ? 'text-[#FF3B30]' : 'text-zinc-500 group-hover:text-[#FF3B30]',
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
