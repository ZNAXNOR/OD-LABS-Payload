import Link from 'next/link'

import type { PagesData } from '@/getPagesData'

interface FooterNavProps {
  pagesData?: PagesData[]
}

const PAGES_PER_COLUMN = 4

export const FooterNav = ({ pagesData = [] }: FooterNavProps) => {
  const columns = Array.from(
    { length: Math.ceil(pagesData.length / PAGES_PER_COLUMN) },
    (_, index) =>
      pagesData.slice(
        index * PAGES_PER_COLUMN,
        index * PAGES_PER_COLUMN + PAGES_PER_COLUMN,
      ),
  )

  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3">
      {columns.map((column, columnIndex) => (
        <nav
          key={columnIndex}
          className="text-md flex flex-col gap-2.5 font-mono"
        >
          {column.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group inline-flex w-fit items-center text-zinc-400 transition-colors duration-300 hover:text-white"
            >
              <span className="mr-1 text-2xl font-bold text-red-500 opacity-0 transition-opacity duration-100 group-hover:opacity-100">
                {'['}
              </span>
              <span>{page.title}</span>
              <span className="ml-1 text-2xl font-bold text-red-500 opacity-0 transition-opacity duration-100 group-hover:opacity-100">
                {']'}
              </span>
            </Link>
          ))}
        </nav>
      ))}
    </div>
  )
}
