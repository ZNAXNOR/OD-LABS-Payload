import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { ArrowRight, BookOpen, Compass, Home, Mail, Search as SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ErrorCard } from '@/components/ErrorCard'
import { ServiceStatus } from '@/components/ServiceStatus'

export const metadata: Metadata = {
  title: '404: Page Not Found | OD LABS',
  description: 'The requested route could not be found or has migrated.',
  robots: {
    index: false,
    follow: false,
  },
}

const directoryLinks = [
  {
    number: '01',
    label: 'HOME',
    description: 'Return to the main page',
    href: '/',
    icon: Home,
  },
  {
    number: '02',
    label: 'INSIGHTS & POSTS',
    description: 'Engineering notes, technical articles & updates',
    href: '/posts',
    icon: BookOpen,
  },
  {
    number: '03',
    label: 'KNOWLEDGE SEARCH',
    description: 'Search documentation, content and knowledge base',
    href: '/search',
    icon: Compass,
  },
  {
    number: '04',
    label: 'INITIATE CONTACT',
    description: 'Connect directly with the OD LABS engineering team',
    href: '/#contact',
    icon: Mail,
  },
]

export default function NotFound() {
  return (
    <div className="py-6 sm:py-10">
      <ErrorCard
        eyebrowPhrases={['ERROR', 'ROUTE_RESOLUTION_FAILURE']}
        sectionNumber="00"
        code="404"
        title="Resource Not Found"
        description="The requested endpoint does not exist, has migrated, or is temporarily unavailable in the routing table."
        actions={
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
            <Button asChild variant="fill">
              <Link href="/" className="inline-flex items-center gap-2">
                <Home className="size-4 shrink-0" aria-hidden="true" />
                <span>Return Home</span>
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/posts" className="inline-flex items-center gap-2">
                <BookOpen className="size-4 shrink-0" aria-hidden="true" />
                <span>Browse Posts</span>
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/sitemap" className="inline-flex items-center gap-2">
                <Compass className="size-4 shrink-0" aria-hidden="true" />
                <span>View Sitemap</span>
              </Link>
            </Button>

            <div className="sm:ml-auto pt-2 sm:pt-0">
              <ServiceStatus variant="compact" />
            </div>
          </div>
        }
      >
        {/* Inline Search Recovery */}
        <div className="space-y-3">
          <div className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            Search Index
          </div>
          <form
            action="/search"
            method="GET"
            className="flex flex-col sm:flex-row gap-2 max-w-xl"
            role="search"
          >
            <div className="relative flex-1">
              <SearchIcon
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500"
                aria-hidden="true"
              />
              <input
                type="search"
                name="q"
                placeholder="Search articles, documentation, topics..."
                aria-label="Search site"
                className="w-full border border-zinc-700 bg-zinc-900/90 py-3 pl-10 pr-4 font-mono text-xs text-white placeholder-zinc-500 focus:border-odl focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="border border-zinc-700 bg-zinc-900 px-6 py-3 font-mono text-xs uppercase tracking-wider text-zinc-200 transition-colors hover:border-odl hover:bg-odl/10 hover:text-white cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Quick Directory Grid */}
        <div className="space-y-3 pt-2">
          <div className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Quick Directory
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {directoryLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative border border-zinc-800 bg-black/40 p-4 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-950/80"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="font-mono text-xs tracking-wider text-zinc-300 group-hover:text-white transition-colors flex items-center">
                        <span className="text-odl opacity-0 group-hover:opacity-100 transition-opacity mr-1 font-mono">
                          [
                        </span>
                        <span>{link.number} — {link.label}</span>
                        <span className="text-odl opacity-0 group-hover:opacity-100 transition-opacity ml-1 font-mono">
                          ]
                        </span>
                      </div>
                      <p className="font-sans text-xs text-zinc-500 truncate">
                        {link.description}
                      </p>
                    </div>

                    <div className="p-1.5 border border-zinc-800 bg-zinc-900/60 text-zinc-400 group-hover:text-odl group-hover:border-zinc-700 transition-colors shrink-0">
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </ErrorCard>
    </div>
  )
}
