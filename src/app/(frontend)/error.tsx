'use client'

import * as Sentry from '@sentry/nextjs'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Check, Copy, Home, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ErrorCard } from '@/components/ErrorCard'
import { ServiceStatus } from '@/components/ServiceStatus'
import { ReportIssue } from '@/components/ReportIssue'
import { useMegaMenu } from '@/providers/MegaMenu'

export default function ErrorBoundary({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [copied, setCopied] = useState(false)
  const isDev = process.env.NODE_ENV !== 'production'
  const { setRuntimeError, clearRuntimeError } = useMegaMenu()
  const resetRef = useRef(reset)
  resetRef.current = reset

  useEffect(() => {
    setRuntimeError({ code: '500', error, retry: () => resetRef.current() })
    return clearRuntimeError
  }, [error, setRuntimeError, clearRuntimeError])

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') Sentry.captureException(error)
    else console.error('[OD LABS Dev] Client Error Boundary caught:', error)
  }, [error])

  const copyDigest = async () => {
    if (!error.digest) return
    try {
      await navigator.clipboard.writeText(error.digest)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard write failed
    }
  }

  return (
    <div className="py-6 sm:py-10">
      <ErrorCard
        eyebrowPhrases={['SYSTEM EXCEPTION', 'UNHANDLED_RUNTIME_ERROR']}
        sectionNumber="00"
        code="500"
        title="Internal Execution Error"
        description="An unexpected error occurred while processing the request. Our telemetry monitors have been notified and recovery options are ready."
        actions={
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Button type="button" variant="fill" onClick={() => reset()} className="inline-flex items-center gap-2">
              <RotateCcw className="size-4 shrink-0" aria-hidden="true" />
              <span>Re-Execute Request</span>
            </Button>
            <Button asChild variant="outline">
              <Link href="/" className="inline-flex items-center gap-2">
                <Home className="size-4 shrink-0" aria-hidden="true" />
                <span>Return Home</span>
              </Link>
            </Button>
            <ReportIssue variant="button" error={error} digest={error.digest} />
            <div className="pt-2 sm:ml-auto sm:pt-0"><ServiceStatus variant="compact" /></div>
          </div>
        }
      >
        {error.digest && (
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <span>Incident Reference:</span>
            <code className="border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-zinc-300">{error.digest}</code>
            <button type="button" onClick={copyDigest} aria-label="Copy incident reference ID" className="cursor-pointer text-zinc-400 transition-colors hover:text-white">
              {copied ? <Check className="size-3 text-emerald-400" aria-hidden="true" /> : <Copy className="size-3" aria-hidden="true" />}
            </button>
          </div>
        )}
        {isDev && (
          <details className="group border border-zinc-800 bg-black/60 p-4 font-mono text-xs">
            <summary className="flex cursor-pointer select-none items-center gap-2 text-zinc-400 hover:text-zinc-200">
              <AlertTriangle className="size-3.5 text-amber-400" aria-hidden="true" />
              <span>[+] DEBUG DIAGNOSTICS & STACK TRACE (DEV ONLY)</span>
            </summary>
            <div className="mt-4 space-y-3 border-t border-zinc-800/80 pt-3">
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-zinc-500">Error Message:</span>
                <p className="mt-1 break-words font-mono text-xs text-red-400">{error.message || 'Unknown error occurred'}</p>
              </div>
              {error.stack && (
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-zinc-500">Call Stack:</span>
                  <pre className="mt-1 max-h-64 overflow-x-auto whitespace-pre border border-zinc-850 bg-zinc-950 p-3 font-mono text-[11px] text-zinc-400">{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}
      </ErrorCard>
    </div>
  )
}
