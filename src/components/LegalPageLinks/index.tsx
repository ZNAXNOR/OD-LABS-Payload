import Link from 'next/link'
import type { LegalPagesData } from '@/getLegalPagesData'

interface LegalPageLinksProps {
  pages: LegalPagesData[]
  className?: string
}

export const LegalPageLinks = ({ pages, className = '' }: LegalPageLinksProps) => {
  if (pages.length === 0) return null

  return (
    <nav aria-label="Legal" className={className}>
      <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {pages.map((page, index) => (
          <li key={page.slug} className="inline-flex items-center gap-x-3">
            {index > 0 && (
              <span aria-hidden="true" className="text-zinc-700">
                ·
              </span>
            )}
            <Link
              href={page.href}
              className="transition-colors hover:text-zinc-300 focus-visible:text-zinc-200 focus-visible:outline-odl"
            >
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
