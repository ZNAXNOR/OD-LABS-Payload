import { ServiceStatus } from '@/components/ServiceStatus'
import type { ErrorContextData } from '../../types'
import { ErrorActions } from '../../error/ErrorActions'
import { ErrorDiagnostic } from '../../error/ErrorDiagnostic'
import { ErrorReporter } from '../../error/ErrorReporter'

interface ErrorContextProps {
  context: ErrorContextData
  compact?: boolean
}

export const ErrorContext = ({ context, compact = false }: ErrorContextProps) => (
  <aside className="space-y-5">
    <ErrorDiagnostic context={context} />
    {compact ? (
      <ErrorReporter error={context.error} />
    ) : (
      <>
        <ErrorActions recoveryActions={context.recoveryActions} retry={context.retry} />
        <ServiceStatus variant="compact" />
      </>
    )}
  </aside>
)
