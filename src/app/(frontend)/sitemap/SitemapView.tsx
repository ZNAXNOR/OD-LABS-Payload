'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  SquareArrowOutUpRight,
  FileCode,
  Hash,
  Home,
  Scale,
  Search as SearchIcon,
  X,
} from 'lucide-react'

import { Eyebrow } from '@/components/Eyebrow'
import { ServiceStatus } from '@/components/ServiceStatus'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import type {
  SitemapCategory,
  SitemapData,
  SitemapRouteItem,
  SitemapFeedItem,
} from './types'

interface SitemapViewProps {
  data: SitemapData
}

export const SitemapView: React.FC<SitemapViewProps> = ({ data }) => {
  const [activeCategory, setActiveCategory] = useState<SitemapCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filterItem = (item: SitemapRouteItem) => {
    if (!normalizedQuery) return true
    return (
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.href.toLowerCase().includes(normalizedQuery) ||
      (item.description &&
        item.description.toLowerCase().includes(normalizedQuery)) ||
      (item.category &&
        item.category.toLowerCase().includes(normalizedQuery)) ||
      (item.documentType &&
        item.documentType.toLowerCase().includes(normalizedQuery)) ||
      item.sections?.some((s) =>
        s.label.toLowerCase().includes(normalizedQuery),
      )
    )
  }

  const filterFeed = (feed: SitemapFeedItem) => {
    if (!normalizedQuery) return true
    return (
      feed.title.toLowerCase().includes(normalizedQuery) ||
      feed.href.toLowerCase().includes(normalizedQuery) ||
      feed.description.toLowerCase().includes(normalizedQuery) ||
      feed.format.toLowerCase().includes(normalizedQuery)
    )
  }

  const filteredPages = useMemo(
    () => data.pages.filter(filterItem),
    [data.pages, normalizedQuery],
  )
  const filteredPosts = useMemo(
    () => data.posts.filter(filterItem),
    [data.posts, normalizedQuery],
  )
  const filteredLegal = useMemo(
    () => data.legalPages.filter(filterItem),
    [data.legalPages, normalizedQuery],
  )
  const filteredFeeds = useMemo(
    () => data.feeds.filter(filterFeed),
    [data.feeds, normalizedQuery],
  )

  const totalFilteredCount =
    filteredPages.length +
    filteredPosts.length +
    filteredLegal.length +
    filteredFeeds.length

  const showPages =
    (activeCategory === 'all' || activeCategory === 'pages') &&
    filteredPages.length > 0
  const showPosts =
    (activeCategory === 'all' || activeCategory === 'posts') &&
    filteredPosts.length > 0
  const showLegal =
    (activeCategory === 'all' || activeCategory === 'legal') &&
    filteredLegal.length > 0
  const showFeeds =
    (activeCategory === 'all' || activeCategory === 'feeds') &&
    filteredFeeds.length > 0

  const hasAnyResults = showPages || showPosts || showLegal || showFeeds

  return (
    <div className="py-6 sm:py-10">
      <section className="relative my-8 px-6 sm:my-14 lg:my-18 lg:px-10">
        <Eyebrow
          eyebrow={['SITE_MAP', 'ROUTING_INDEX']}
          sectionNumber="00"
          className="mb-6 sm:mb-8"
        />

        {/* Technical Frame Container */}
        <div className="relative border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur-xs sm:p-10 lg:p-14">
          {/* Technical Corner Brackets */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-px -left-px z-10 m-0! h-3.5 w-3.5 border-t border-l border-zinc-500"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-px -right-px z-10 m-0! h-3.5 w-3.5 border-t border-r border-zinc-500"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-px -left-px z-10 m-0! h-3.5 w-3.5 border-b border-l border-zinc-500"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-px -bottom-px z-10 m-0! h-3.5 w-3.5 border-r border-b border-zinc-500"
          />

          <div className="max-w-5xl space-y-8">
            {/* Header / Identity Banner */}
            <div className="space-y-3">
              <div className="font-mono text-5xl font-normal tracking-tight text-white select-none sm:text-7xl lg:text-8xl">
                <span className="text-odl mr-1.5 font-light" aria-hidden="true">
                  [
                </span>
                MAP
                <span className="text-odl ml-1.5 font-light" aria-hidden="true">
                  ]
                </span>
              </div>

              <h1 className="font-sans text-2xl font-normal tracking-tight text-zinc-100 sm:text-3xl lg:text-4xl">
                System Routing Directory
              </h1>

              <p className="max-w-3xl font-sans text-base leading-relaxed text-zinc-400 sm:text-lg">
                Structured topology of all public application routes,
                engineering publications, governance specifications, and
                machine-readable XML feeds published across OD LABS.
              </p>
            </div>

            {/* Quick Actions & Live Telemetry Bar */}
            <div className="flex flex-col flex-wrap items-stretch gap-4 pt-2 sm:flex-row sm:items-center">
              <Button asChild variant="fill">
                <Link href="/" className="inline-flex items-center gap-2">
                  <Home className="size-4 shrink-0" aria-hidden="true" />
                  <span>RETURN HOME</span>
                </Link>
              </Button>

              <Button asChild variant="outline">
                <a
                  href="/pages-sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <FileCode className="size-4 shrink-0" aria-hidden="true" />
                  <span>Raw XML Index</span>
                  <SquareArrowOutUpRight
                    className="size-3 text-zinc-500"
                    aria-hidden="true"
                  />
                </a>
              </Button>

              <div className="flex items-center gap-3 pt-2 sm:ml-auto sm:pt-0">
                <div className="border border-zinc-800 bg-zinc-900/80 px-3 py-2 font-mono text-xs text-zinc-300">
                  <span className="text-odl mr-1">[</span>
                  <span>{data.stats.totalRoutes} ENDPOINTS INDEXED</span>
                  <span className="text-odl ml-1">]</span>
                </div>
                <ServiceStatus variant="compact" />
              </div>
            </div>

            {/* Real-time Search and Category Filtering */}
            <div className="space-y-4 border-t border-zinc-800/80 pt-6">
              <div className="space-y-2">
                <div className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
                  Route Filter
                </div>

                <div className="relative max-w-2xl">
                  <SearchIcon
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter routes, articles, legal documents, or anchors..."
                    aria-label="Filter sitemap routes"
                    className="focus:border-odl w-full border border-zinc-700 bg-zinc-900/90 py-3 pr-10 pl-10 font-mono text-xs text-white placeholder-zinc-500 transition-colors focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear filter"
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-zinc-500 transition-colors hover:text-white"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                {(
                  [
                    { id: 'all', label: 'ALL', count: data.stats.totalRoutes },
                    {
                      id: 'pages',
                      label: '01 — CORE PAGES',
                      count: data.stats.totalPages,
                    },
                    {
                      id: 'posts',
                      label: '02 — INSIGHTS',
                      count: data.stats.totalPosts,
                    },
                    {
                      id: 'legal',
                      label: '03 — LEGAL',
                      count: data.stats.totalLegalPages,
                    },
                    {
                      id: 'feeds',
                      label: '04 — XML FEEDS',
                      count: data.stats.totalFeeds,
                    },
                  ] as const
                ).map((tab) => {
                  const isActive = activeCategory === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveCategory(tab.id)}
                      className={cn(
                        'flex cursor-pointer items-center gap-1.5 border px-3 py-1.5 transition-all duration-150',
                        isActive
                          ? 'border-odl bg-odl/15 font-medium text-white shadow-[0_0_12px_rgba(233,66,53,0.2)]'
                          : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200',
                      )}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={cn(
                          'text-[11px]',
                          isActive ? 'text-odl' : 'text-zinc-500',
                        )}
                      >
                        ({tab.count})
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sitemap Directory Content */}
            <div className="space-y-12 border-t border-zinc-800/80 pt-4">
              {/* Section 01: Core Pages */}
              {showPages && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="bg-odl size-2 shrink-0"
                        aria-hidden="true"
                      />
                      <h2 className="font-mono text-xs tracking-widest text-zinc-300 uppercase">
                        01 — Core Application & Landing Routes
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-zinc-500">
                      [{filteredPages.length} ENDPOINTS]
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {filteredPages.map((page) => (
                      <div
                        key={page.href}
                        className="group relative flex flex-col justify-between border border-zinc-800 bg-black/40 p-4 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-950/80"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={page.href}
                              className="min-w-0 flex-1 space-y-1"
                            >
                              <div className="flex items-center font-mono text-xs tracking-wider text-zinc-200 transition-colors group-hover:text-white">
                                <span className="text-odl mr-1 font-mono opacity-0 transition-opacity group-hover:opacity-100">
                                  [
                                </span>
                                <span>
                                  {page.number} — {page.title}
                                </span>
                                <span className="text-odl ml-1 font-mono opacity-0 transition-opacity group-hover:opacity-100">
                                  ]
                                </span>
                              </div>

                              <p className="line-clamp-2 font-sans text-xs text-zinc-400">
                                {page.description || 'Public destination route'}
                              </p>
                            </Link>

                            <Link
                              href={page.href}
                              aria-label={`Navigate to ${page.title}`}
                              className="group-hover:text-odl shrink-0 border border-zinc-800 bg-zinc-900/60 p-1.5 text-zinc-400 transition-colors group-hover:border-zinc-700"
                            >
                              <ArrowRight
                                className="size-4"
                                aria-hidden="true"
                              />
                            </Link>
                          </div>

                          {/* In-page Anchor Links */}
                          {page.sections && page.sections.length > 0 && (
                            <div className="border-zinc-850 mt-3 border-t pt-2.5">
                              <div className="mb-1.5 flex items-center gap-1 font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                                <Hash
                                  className="text-odl size-3"
                                  aria-hidden="true"
                                />
                                <span>Section Anchors:</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {page.sections.map((sec) => (
                                  <Link
                                    key={sec.href}
                                    href={sec.href}
                                    className="border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 font-mono text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                                  >
                                    #{sec.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="border-zinc-850 mt-3 flex items-center justify-between border-t pt-2 font-mono text-[11px] text-zinc-500">
                          <code className="text-zinc-400">{page.href}</code>
                          {page.updatedAt && (
                            <span>
                              UPDATED:{' '}
                              {new Date(page.updatedAt).toLocaleDateString(
                                'en-CA',
                                {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                },
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 02: Posts & Insights */}
              {showPosts && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="bg-odl size-2 shrink-0"
                        aria-hidden="true"
                      />
                      <h2 className="font-mono text-xs tracking-widest text-zinc-300 uppercase">
                        02 — Engineering Publications & Technical Notes
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-zinc-500">
                      [{filteredPosts.length} ARTICLES]
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {filteredPosts.map((post) => (
                      <Link
                        key={post.href}
                        href={post.href}
                        className="group relative flex flex-col justify-between border border-zinc-800 bg-black/40 p-4 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-950/80"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center font-mono text-xs tracking-wider text-zinc-200 transition-colors group-hover:text-white">
                                <span className="text-odl mr-1 font-mono opacity-0 transition-opacity group-hover:opacity-100">
                                  [
                                </span>
                                <span>
                                  {post.number} — {post.title}
                                </span>
                                <span className="text-odl ml-1 font-mono opacity-0 transition-opacity group-hover:opacity-100">
                                  ]
                                </span>
                              </div>

                              <p className="line-clamp-2 font-sans text-xs text-zinc-400">
                                {post.description ||
                                  'Engineering article and technical breakdown'}
                              </p>
                            </div>

                            <div className="group-hover:text-odl shrink-0 border border-zinc-800 bg-zinc-900/60 p-1.5 text-zinc-400 transition-colors group-hover:border-zinc-700">
                              <BookOpen className="size-4" aria-hidden="true" />
                            </div>
                          </div>
                        </div>

                        <div className="border-zinc-850 mt-4 flex items-center justify-between border-t pt-2 font-mono text-[11px] text-zinc-500">
                          {post.category ? (
                            <span className="border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 text-zinc-300">
                              {post.category}
                            </span>
                          ) : (
                            <code className="text-zinc-400">{post.href}</code>
                          )}
                          {post.publishedAt && (
                            <span>
                              PUBLISHED:{' '}
                              {new Date(post.publishedAt).toLocaleDateString(
                                'en-CA',
                                {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                },
                              )}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 03: Legal Pages */}
              {showLegal && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="bg-odl size-2 shrink-0"
                        aria-hidden="true"
                      />
                      <h2 className="font-mono text-xs tracking-widest text-zinc-300 uppercase">
                        03 — Governance & Compliance Specifications
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-zinc-500">
                      [{filteredLegal.length} POLICIES]
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {filteredLegal.map((doc) => (
                      <Link
                        key={doc.href}
                        href={doc.href}
                        className="group relative flex flex-col justify-between border border-zinc-800 bg-black/40 p-4 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-950/80"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center font-mono text-xs tracking-wider text-zinc-200 transition-colors group-hover:text-white">
                                <span className="text-odl mr-1 font-mono opacity-0 transition-opacity group-hover:opacity-100">
                                  [
                                </span>
                                <span>
                                  {doc.number} — {doc.title}
                                </span>
                                <span className="text-odl ml-1 font-mono opacity-0 transition-opacity group-hover:opacity-100">
                                  ]
                                </span>
                              </div>

                              <p className="line-clamp-2 font-sans text-xs text-zinc-400">
                                {doc.description ||
                                  'Legal specification, privacy notice, and terms'}
                              </p>
                            </div>

                            <div className="group-hover:text-odl shrink-0 border border-zinc-800 bg-zinc-900/60 p-1.5 text-zinc-400 transition-colors group-hover:border-zinc-700">
                              <Scale className="size-4" aria-hidden="true" />
                            </div>
                          </div>
                        </div>

                        <div className="border-zinc-850 mt-4 flex items-center justify-between border-t pt-2 font-mono text-[11px] text-zinc-500">
                          <span className="border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 text-zinc-300 uppercase">
                            {doc.documentType || 'LEGAL SPEC'}
                          </span>
                          <code className="text-zinc-400">{doc.href}</code>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 04: Machine-Readable Feeds */}
              {showFeeds && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="bg-odl size-2 shrink-0"
                        aria-hidden="true"
                      />
                      <h2 className="font-mono text-xs tracking-widest text-zinc-300 uppercase">
                        04 — Machine-Readable Discovery Feeds
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-zinc-500">
                      [{filteredFeeds.length} FEEDS]
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {filteredFeeds.map((feed) => (
                      <a
                        key={feed.href}
                        href={feed.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex flex-col justify-between border border-zinc-800 bg-black/40 p-4 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-950/80"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center font-mono text-xs tracking-wider text-zinc-200 transition-colors group-hover:text-white">
                                <span className="text-odl mr-1 font-mono opacity-0 transition-opacity group-hover:opacity-100">
                                  [
                                </span>
                                <span>
                                  {feed.number} — {feed.title}
                                </span>
                                <span className="text-odl ml-1 font-mono opacity-0 transition-opacity group-hover:opacity-100">
                                  ]
                                </span>
                              </div>

                              <p className="font-sans text-xs text-zinc-400">
                                {feed.description}
                              </p>
                            </div>

                            <div className="group-hover:text-odl shrink-0 border border-zinc-800 bg-zinc-900/60 p-1.5 text-zinc-400 transition-colors group-hover:border-zinc-700">
                              <SquareArrowOutUpRight
                                className="size-4"
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-zinc-850 mt-4 flex items-center justify-between border-t pt-2 font-mono text-[11px] text-zinc-500">
                          <code className="border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-zinc-300">
                            {feed.endpoint}
                          </code>
                          <span className="text-odl border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 font-mono">
                            {feed.format}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Zero Filter Results State */}
              {!hasAnyResults && (
                <div className="space-y-4 border border-zinc-800 bg-black/40 p-8 text-center sm:p-12">
                  <div className="text-odl font-mono text-xs tracking-widest uppercase">
                    [ NO MATCHING ROUTES IN ROUTING TABLE ]
                  </div>
                  <p className="mx-auto max-w-md font-sans text-sm text-zinc-400">
                    No active routes, articles, or specifications matched query
                    &ldquo;
                    <span className="font-mono text-white">{searchQuery}</span>
                    &rdquo; in the selected category.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setActiveCategory('all')
                    }}
                    className="font-mono text-xs"
                  >
                    Reset Routing Filter
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
