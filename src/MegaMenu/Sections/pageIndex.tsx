import Link from 'next/link'
import type { PagesData } from '../../getPagesData'
import type { CurrentPageInfo } from '../types'
import type { PointerEvent } from 'react'

interface MegaMenuPageIndexProps {
  pages: PagesData[]
  activePage: CurrentPageInfo | null
  previewPage: PagesData | null
  onPagePointerEnter: (page: PagesData, event: PointerEvent<HTMLElement>) => void
  onPageFocus: (page: PagesData) => void
}

export const MegaMenu_PageIndex = ({
  pages = [],
  activePage,
  previewPage,
  onPagePointerEnter,
  onPageFocus,
}: MegaMenuPageIndexProps) => (
  <section className="mt-12 space-y-6 lg:mt-16">
    <div className="font-mono text-xs tracking-widest text-zinc-500 uppercase">Pages</div>

    <nav aria-label="Primary pages" className="grid grid-cols-1 sm:grid-cols-2">
      {pages.map((page, index) => {
        const isCurrent = activePage?.href === page.href
        const isPreviewed = previewPage?.slug === page.slug

        return (
          <Link
            key={page.slug}
            href={page.href}
            aria-current={isCurrent ? 'page' : undefined}
            onPointerEnter={(event) => onPagePointerEnter(page, event)}
            onFocus={() => onPageFocus(page)}
            onClick={(event) => {
              if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches && !isPreviewed) {
                event.preventDefault()
                onPageFocus(page)
              }
            }}
            className={[
              'flex min-h-16 w-full items-center justify-between pb-5',
              'font-mono text-xl font-semibold sm:text-2xl lg:text-3xl',
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

            <span className={['pr-4 font-mono text-xs font-normal transition-colors duration-200 sm:pr-15', isCurrent || isPreviewed ? 'text-odl' : 'text-zinc-500'].join(' ')}>
              {String(index + 1).padStart(2, '0')}
            </span>
          </Link>
        )
      })}
    </nav>
  </section>
)
