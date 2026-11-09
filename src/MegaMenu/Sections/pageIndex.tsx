import type { PagesData } from '../../getPagesData'
import type { CurrentPageInfo } from '../types'

interface MegaMenuPageIndexProps {
  pages: PagesData[]
  activePage: CurrentPageInfo | null
  previewPage: PagesData | null
  onPageSelect: (page: PagesData) => void
}

export const MegaMenu_PageIndex = ({
  pages = [],
  activePage,
  previewPage,
  onPageSelect,
}: MegaMenuPageIndexProps) => (
  <section className="mt-12 space-y-6 lg:mt-16">
    <div className="font-mono text-xs tracking-widest text-zinc-500 uppercase">Pages</div>
    <nav aria-label="Primary pages" className="flex flex-col">
      {pages.map((page, index) => {
        const isCurrent = activePage?.href === page.href
        const isPreviewed = previewPage?.slug === page.slug

        return (
          <button
            key={page.slug}
            type="button"
            aria-pressed={isPreviewed}
            aria-current={isCurrent ? 'page' : undefined}
            onClick={() => onPageSelect(page)}
            className={[
              'flex min-h-16 w-full items-center justify-between border-b border-zinc-800/70 py-4 text-left',
              'font-mono text-xl font-semibold sm:text-2xl lg:text-3xl',
              'transition-colors duration-200 hover:text-odl',
              'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odl',
            ].join(' ')}
          >
            <span className={['inline-flex items-center transition-[letter-spacing] duration-200', isPreviewed ? 'tracking-normal' : 'tracking-tight'].join(' ')}>
              <span aria-hidden="true" className={['mr-1.5 text-odl transition-opacity duration-150', isCurrent || isPreviewed ? 'opacity-100' : 'opacity-0'].join(' ')}>[</span>
              <span className={['transition-colors duration-200', isPreviewed ? 'text-odl' : 'text-white'].join(' ')}>
                {page.title}
              </span>
              <span aria-hidden="true" className={['ml-1.5 text-odl transition-opacity duration-150', isCurrent || isPreviewed ? 'opacity-100' : 'opacity-0'].join(' ')}>]</span>
            </span>
            <span className={['pr-4 font-mono text-xs font-normal transition-colors duration-200 sm:pr-8', isCurrent || isPreviewed ? 'text-odl' : 'text-zinc-500'].join(' ')}>
              {String(index + 1).padStart(2, '0')}
            </span>
          </button>
        )
      })}
    </nav>
  </section>
)
