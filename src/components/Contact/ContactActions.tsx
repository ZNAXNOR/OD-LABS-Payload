'use client'

import { useState } from 'react'
import { SquareArrowOutUpRight, Check, Copy } from 'lucide-react'
import { cn } from '@/utilities/ui'
import type { FormattedContactAction as ContactAction } from './utils'

export type { ContactAction }

function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Email address copied' : 'Copy email address'}
      title={copied ? 'Copied' : 'Copy email address'}
      className="grid size-10 shrink-0 place-items-center border border-zinc-800 text-zinc-400 transition-colors hover:border-odl hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl"
    >
      {copied ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
    </button>
  )
}

export function ContactActions({
  actions,
  className,
}: {
  actions: ContactAction[]
  className?: string
}) {
  return (
    <div className={cn('grid gap-2', className)}>
      {actions.map((action, index) => {
        const isEmail = action.href.toLowerCase().startsWith('mailto:')
        const email = isEmail ? decodeURIComponent(action.href.slice(7).split('?')[0]) : ''
        return (
          <div className="flex min-w-0 gap-2" key={action.href + index}>
            <a
              href={action.href}
              target={action.newTab ? '_blank' : undefined}
              rel={action.newTab ? 'noreferrer noopener' : undefined}
              className="flex min-h-11 min-w-0 flex-1 items-center justify-between gap-3 border border-zinc-800 px-3 py-2 text-sm text-zinc-200 transition-colors hover:border-odl hover:bg-odl/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl"
            >
              <span className="min-w-0">{action.label}</span>
              <SquareArrowOutUpRight aria-hidden="true" className="shrink-0 text-odl" size={16} />
            </a>
            {isEmail && email ? <CopyEmailButton email={email} /> : null}
          </div>
        )
      })}
    </div>
  )
}
