import Link from 'next/link'
import { AlertTriangle, ArrowUpRight, House, MessageSquareWarning, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReportIssue } from '@/components/ReportIssue'
import { ServiceStatus } from '@/components/ServiceStatus'
import type { ErrorContextData } from '../../types'

interface ErrorContextProps {
  context: ErrorContextData
  compact?: boolean
}

export const ErrorContext = ({ context, compact = false }: ErrorContextProps) => (
  <aside className="space-y-5">
    <div className="flex items-center justify-between gap-3 font-mono text-[11px] tracking-widest uppercase">
      <span className="inline-flex items-center gap-2 text-odl">
        <AlertTriangle className="size-4" aria-hidden="true" />
        Error context
      </span>
      <span className="text-zinc-500">HTTP {context.code}</span>
    </div>

    <div className="space-y-3">
      <h2 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">{context.title}</h2>
      <p className="font-sans text-xs leading-relaxed text-zinc-400 sm:text-sm">{context.description}</p>
      {context.error?.digest && (
        <p className="font-mono text-[11px] text-zinc-500">
          INCIDENT // <code className="text-zinc-300">{context.error.digest}</code>
        </p>
      )}
    </div>

    {!compact && (
      <>
        <div className="flex flex-col gap-2">
          <ReportIssue
            variant="button"
            label="Report this issue"
            error={context.error}
            digest={context.error?.digest}
            className="w-full justify-center"
          />
          {context.retry && (
            <Button type="button" variant="outline" className="w-full" onClick={context.retry}>
              <RefreshCw aria-hidden="true" /> Retry request
            </Button>
          )}
        </div>

        <nav aria-label="Error recovery" className="space-y-1 border-t border-zinc-800 pt-3">
          {context.recoveryActions.map((action) => (
            <Link key={action.href} href={action.href} className="group flex items-center justify-between gap-3 py-2 font-mono text-xs text-zinc-400 transition-colors hover:text-white">
              <span>{action.number} — {action.label}</span>
              <ArrowUpRight className="size-3.5 text-zinc-500 group-hover:text-odl" aria-hidden="true" />
            </Link>
          ))}
          <Link href="/" className="inline-flex items-center gap-2 pt-2 font-mono text-xs text-zinc-300 hover:text-white">
            <House className="size-3.5 text-odl" aria-hidden="true" />
            Return Home
          </Link>
        </nav>
        <ServiceStatus variant="compact" />
      </>
    )}
  </aside>
)
