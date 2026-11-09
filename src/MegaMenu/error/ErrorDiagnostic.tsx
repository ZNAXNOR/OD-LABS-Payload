import { AlertTriangle } from 'lucide-react'
import type { ErrorContextData } from '../types'

export const ErrorDiagnostic = ({ context }: { context: ErrorContextData }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between gap-3 font-mono text-[11px] tracking-widest uppercase">
      <span className="inline-flex items-center gap-2 text-odl">
        <AlertTriangle className="size-4" aria-hidden="true" />
        Error context
      </span>
      <span className="text-zinc-500">HTTP {context.code}</span>
    </div>
    <h2 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">{context.title}</h2>
    <p className="font-sans text-xs leading-relaxed text-zinc-400 sm:text-sm">{context.description}</p>
    {context.error?.digest && (
      <p className="font-mono text-[11px] text-zinc-500">
        INCIDENT // <code className="text-zinc-300">{context.error.digest}</code>
      </p>
    )}
  </div>
)
