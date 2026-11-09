import { MessageSquareWarning } from 'lucide-react'
import { ReportIssue } from '@/components/ReportIssue'

interface ErrorReporterProps {
  error?: Error & { digest?: string }
  className?: string
}

export const ErrorReporter = ({ error, className }: ErrorReporterProps) => (
  <div className={['space-y-2', className].filter(Boolean).join(' ')}>
    <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
      <MessageSquareWarning className="size-3.5 text-odl" aria-hidden="true" />
      Issue reporting
    </div>
    <ReportIssue
      variant="button"
      label="Report this issue"
      error={error}
      digest={error?.digest}
      className="w-full justify-center"
    />
  </div>
)
