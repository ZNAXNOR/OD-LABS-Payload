'use client'

import React, { useEffect, useState } from 'react'
import { Bug, SquareArrowOutUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getGitHubIssueUrl } from '@/utilities/getGitHubIssueUrl'
import { cn } from '@/utilities/ui'

export interface ReportIssueProps {
  variant?: 'button' | 'link'
  label?: string
  error?: Error | { message?: string; name?: string; digest?: string }
  digest?: string
  title?: string
  className?: string
  labels?: string[]
}

export const ReportIssue: React.FC<ReportIssueProps> = ({
  variant = 'link',
  label,
  error,
  digest,
  title,
  className,
  labels,
}) => {
  const [url, setUrl] = useState<string>('')
  const [userAgent, setUserAgent] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href)
      setUserAgent(window.navigator.userAgent)
    }
  }, [])

  const defaultLabel = variant === 'button' ? 'Report Issue' : 'Report an Issue'
  const displayLabel = label || defaultLabel

  const issueHref = getGitHubIssueUrl({
    title,
    errorMessage: error?.message,
    errorName: error?.name,
    digest: digest || (error as { digest?: string })?.digest,
    url: url || undefined,
    userAgent: userAgent || undefined,
    labels,
  })

  if (variant === 'button') {
    return (
      <Button asChild variant="outline" className={cn('inline-flex items-center gap-2', className)}>
        <a
          href={issueHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Report issue on GitHub (opens in a new tab)"
          suppressHydrationWarning
        >
          <Bug className="size-4 shrink-0 text-odl" aria-hidden="true" />
          <span>{displayLabel}</span>
          <SquareArrowOutUpRight aria-hidden="true" className="size-3.5 text-zinc-500" />
        </a>
      </Button>
    )
  }

  return (
    <a
      href={issueHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Report an issue on GitHub (opens in a new tab)"
      suppressHydrationWarning
      className={cn(
        'group inline-flex items-center gap-1 font-mono transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odl',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="text-odl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        {'['}
      </span>
      <span className="transition-colors group-hover:text-white">
        {displayLabel}
      </span>
      <span
        aria-hidden="true"
        className="text-odl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        {']'}
      </span>
      <SquareArrowOutUpRight aria-hidden="true" className="size-3.5 text-zinc-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white" />
    </a>
  )
}

export default ReportIssue
