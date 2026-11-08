import React from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, Compass, FileCode, Home, Search } from 'lucide-react'
import type { CurrentPageInfo } from '../types'
import type { PagesData } from '@/getPagesData'

interface MegaMenu_CurrentPageProps {
  page: CurrentPageInfo | PagesData | null
  pathname?: string | null
}

export const MegaMenu_CurrentPage = ({
  page,
  pathname,
}: MegaMenu_CurrentPageProps) => {
  const currentPath = page?.href || pathname || '/'

  // 1. Dedicated Error States (404, 500, 503 / Anomaly)
  if (page && 'errorCode' in page && page.errorCode) {
    const code = page.errorCode
    const is404 = code === '404'
    const is500 = code === '500'

    const eyebrowPhrases =
      page.errorEyebrow && page.errorEyebrow.length > 0
        ? page.errorEyebrow
        : is404
          ? ['ERROR', 'ROUTE_RESOLUTION_FAILURE']
          : is500
            ? ['SYSTEM EXCEPTION', 'UNHANDLED_RUNTIME_ERROR']
            : ['SERVICE ALERT', 'ANOMALY_DETECTED']

    const statusBadgeText = is404
      ? 'STATUS: 404 NOT_FOUND • ROUTING EXCEPTION'
      : is500
        ? 'STATUS: 500 CRITICAL • TELEMETRY DISPATCHED'
        : 'STATUS: 503 ANOMALY • MONITORING ACTIVE'

    const actions = page.recoveryActions || []

    return (
      <section className="space-y-4">
        {/* Eyebrow */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-widest uppercase">
          <span className="size-2 bg-odl shrink-0" aria-hidden="true" />
          {eyebrowPhrases.map((phrase, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-zinc-700">//</span>}
              <span className={idx === 0 ? 'text-odl' : 'text-zinc-400'}>
                [{phrase}]
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-none uppercase font-mono">
          <span className="text-odl font-light mr-1.5" aria-hidden="true">
            [
          </span>
          {code} — {page.title}
          <span className="text-odl font-light ml-1.5" aria-hidden="true">
            ]
          </span>
        </h1>

        {/* Description & Technical Telemetry Pill */}
        <div className="space-y-3 pt-1 max-w-2xl">
          <p className="text-base sm:text-lg text-zinc-400">
            {page.description}
          </p>

          <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 border border-zinc-800 bg-zinc-950/80 px-2.5 py-1">
            <span className="size-1.5 bg-odl shrink-0" aria-hidden="true" />
            <span className="text-zinc-500">ENDPOINT:</span>
            <code className="text-zinc-200">{currentPath}</code>
            <span className="text-zinc-700">•</span>
            <span className="text-odl font-mono">{statusBadgeText}</span>
          </div>
        </div>

        {/* Recovery Shortcuts */}
        {actions.length > 0 && (
          <div className="pt-2 space-y-2">
            <div className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
              Recovery Routes //
            </div>
            <div className="flex flex-wrap gap-2">
              {actions.map((act) => (
                <Link
                  key={act.href}
                  href={act.href}
                  className="group inline-flex items-center gap-1.5 border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-300 hover:text-white transition-colors"
                >
                  <span className="text-odl group-hover:inline">[</span>
                  <span>
                    {act.number} — {act.label}
                  </span>
                  <span className="text-odl group-hover:inline">]</span>
                  <ArrowRight className="size-3 text-zinc-500 group-hover:text-odl transition-colors ml-1" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    )
  }

  // 2. Standard Payload CMS Documents (Pages or Legal Pages)
  const isCmsDoc = page ? ('isPayloadDoc' in page ? page.isPayloadDoc : true) : false

  if (page && isCmsDoc) {
    const isLegalDoc = 'source' in page && page.source === 'payload-legal'

    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-zinc-500">
          <span>Current Page</span>
          {isLegalDoc && (
            <>
              <span className="text-zinc-700">//</span>
              <span className="text-zinc-400 font-mono">[LEGAL_DOCUMENT]</span>
            </>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-none uppercase">
          {page.title}
        </h1>

        <p className="text-base sm:text-lg pt-1 max-w-2xl text-zinc-400">
          {page.description}
        </p>
      </section>
    )
  }

  // 3. Normal Raw Next.js Pages (e.g. /sitemap, /search, /posts)
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-widest uppercase text-zinc-500">
        <span>Current Route</span>
        <span className="text-zinc-700">//</span>
        <span className="text-odl font-mono">
          {page ? '[STANDALONE_ENDPOINT]' : '[UNINDEXED_ROUTE]'}
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-none uppercase font-mono">
        <span className="text-odl font-light mr-1.5" aria-hidden="true">
          [
        </span>
        {page?.title || 'ACTIVE ROUTE'}
        <span className="text-odl font-light ml-1.5" aria-hidden="true">
          ]
        </span>
      </h1>

      <div className="space-y-3 pt-1 max-w-2xl">
        <p className="text-base sm:text-lg text-zinc-400">
          {page?.description ||
            'Active session endpoint outside the CMS collection table. Browse primary navigation below.'}
        </p>

        <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 border border-zinc-800 bg-zinc-950/80 px-2.5 py-1">
          <span className="size-1.5 bg-odl shrink-0" aria-hidden="true" />
          <span className="text-zinc-400">ENDPOINT:</span>
          <code className="text-zinc-200">{currentPath}</code>
          <span className="text-zinc-700">•</span>
          <span className="text-zinc-500">RAW NEXT.JS PAGE</span>
        </div>
      </div>
    </section>
  )
}
