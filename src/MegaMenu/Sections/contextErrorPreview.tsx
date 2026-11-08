import React from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Compass,
  FileCode,
  Home,
  RotateCcw,
  Search,
  ShieldAlert,
} from 'lucide-react'

import { ServiceStatus } from '@/components/ServiceStatus'
import { ReportIssue } from '@/components/ReportIssue'
import type { CurrentPageInfo } from '../types'
import type { ContactSocial } from '@/payload-types'

interface MegaMenu_ContextErrorPreviewProps {
  errorInfo: CurrentPageInfo
  contactSocials?: ContactSocial | null
}

export const MegaMenu_ContextErrorPreview: React.FC<
  MegaMenu_ContextErrorPreviewProps
> = ({ errorInfo }) => {
  const code = errorInfo.errorCode || 'ERR'
  const is404 = code === '404'
  const is500 = code === '500'

  return (
    <aside className="relative flex h-full flex-col justify-between pt-8 lg:pt-0">
      <div className="space-y-6">
        {/* Technical Corner Bracket Box */}
        <div className="relative border border-zinc-800 bg-zinc-950/80 p-5 backdrop-blur-xs">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-px -left-px z-10 m-0! h-3 w-3 border-t border-l border-zinc-500"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-px -right-px z-10 m-0! h-3 w-3 border-t border-r border-zinc-500"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-px -left-px z-10 m-0! h-3 w-3 border-b border-l border-zinc-500"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-px -bottom-px z-10 m-0! h-3 w-3 border-r border-b border-zinc-500"
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-odl uppercase">
                <span className="size-1.5 bg-odl shrink-0" aria-hidden="true" />
                <span>DIAGNOSTIC REPORT //</span>
              </div>
              <span className="font-mono text-xs text-zinc-500">
                [{code}_STATUS]
              </span>
            </div>

            <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-white">
              <span className="text-odl mr-1">[</span>
              {code}
              <span className="text-odl ml-1">]</span>
            </div>

            <p className="font-sans text-xs leading-relaxed text-zinc-400">
              {errorInfo.description}
            </p>
          </div>

          {/* Diagnostic Telemetry Checklist */}
          <div className="mt-4 pt-3 border-t border-zinc-850 font-mono text-[11px] space-y-1.5 text-zinc-400">
            {is404 && (
              <>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="text-emerald-400 font-bold">[✓]</span>
                  <span>Route lookup executed</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="text-odl font-bold">[!]</span>
                  <span>Routing table entry not found</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <span className="text-odl font-bold">[→]</span>
                  <span>System sitemap index ready</span>
                </div>
              </>
            )}

            {is500 && (
              <>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="text-red-400 font-bold">[!]</span>
                  <span>Unhandled server exception</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="text-emerald-400 font-bold">[✓]</span>
                  <span>Telemetry monitors notified</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <span className="text-odl font-bold">[→]</span>
                  <span>Recovery options available</span>
                </div>
              </>
            )}

            {!is404 && !is500 && (
              <>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="text-amber-400 font-bold">[!]</span>
                  <span>Operational anomaly detected</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="text-emerald-400 font-bold">[✓]</span>
                  <span>Health checks polling</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Recovery Navigation */}
        <section className="space-y-2 pt-2">
          <div className="border-b border-zinc-700/60 pb-2 font-mono text-[11px] tracking-widest text-zinc-500 uppercase flex items-center justify-between">
            <span>Recovery Paths</span>
            <span className="text-[10px] text-odl">[RECOMMENDED]</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <Link
              href="/"
              className="group flex h-9 items-center justify-between border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Home className="size-3.5 text-zinc-400 group-hover:text-odl transition-colors" />
                <span>01 — Return Home</span>
              </div>
              <ArrowRight className="size-3 text-zinc-500 group-hover:text-odl group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/sitemap"
              className="group flex h-9 items-center justify-between border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileCode className="size-3.5 text-zinc-400 group-hover:text-odl transition-colors" />
                <span>02 — System Sitemap</span>
              </div>
              <ArrowRight className="size-3 text-zinc-500 group-hover:text-odl group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/search"
              className="group flex h-9 items-center justify-between border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="size-3.5 text-zinc-400 group-hover:text-odl transition-colors" />
                <span>03 — Knowledge Search</span>
              </div>
              <ArrowRight className="size-3 text-zinc-500 group-hover:text-odl group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/posts"
              className="group flex h-9 items-center justify-between border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="size-3.5 text-zinc-400 group-hover:text-odl transition-colors" />
                <span>04 — Browse Posts</span>
              </div>
              <ArrowRight className="size-3 text-zinc-500 group-hover:text-odl group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </section>

        {/* Issue Reporter / Telemetry Widget */}
        <div className="pt-2">
          {is500 ? (
            <ReportIssue
              variant="button"
              className="w-full justify-center"
            />
          ) : (
            <ServiceStatus variant="compact" />
          )}
        </div>
      </div>
    </aside>
  )
}
