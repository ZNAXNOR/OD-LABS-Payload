import Link from 'next/link'
import { ArrowUpRight, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ErrorRecoveryAction } from '../types'

interface ErrorActionsProps {
  recoveryActions: ErrorRecoveryAction[]
  retry?: () => void
}

export const ErrorActions = ({ recoveryActions, retry }: ErrorActionsProps) => (
  <div className="space-y-3">
    {retry && (
      <Button type="button" variant="outline" className="w-full" onClick={retry}>
        <RefreshCw data-icon="inline-start" aria-hidden="true" />
        Retry request
      </Button>
    )}
    <nav aria-label="Error recovery" className="space-y-1 border-t border-zinc-800 pt-3">
      {recoveryActions.map((action) => (
        <Link key={action.href} href={action.href} className="group flex items-center justify-between gap-3 py-2 font-mono text-xs text-zinc-400 transition-colors hover:text-white">
          <span>{action.number} — {action.label}</span>
          <ArrowUpRight className="size-3.5 text-zinc-500 group-hover:text-odl" aria-hidden="true" />
        </Link>
      ))}
    </nav>
  </div>
)
