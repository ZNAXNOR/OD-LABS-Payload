import React from 'react'
import Eyebrow from '@/components/Eyebrow'
import { cn } from '@/utilities/ui'

export interface ErrorCardProps {
  eyebrowPhrases?: string[]
  sectionNumber?: string
  code: string | number
  title: string
  description?: string
  actions?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  eyebrowPhrases = ['SYSTEM EXCEPTION', 'STATUS_REPORT'],
  sectionNumber = '00',
  code,
  title,
  description,
  actions,
  children,
  className,
}) => {
  return (
    <section className={cn('relative my-8 sm:my-14 lg:my-18 px-6 lg:px-10', className)}>
      <Eyebrow
        eyebrow={eyebrowPhrases}
        sectionNumber={sectionNumber}
        className="mb-6 sm:mb-8"
      />

      <div className="relative border border-zinc-800 bg-zinc-950/60 p-6 sm:p-12 lg:p-16 backdrop-blur-xs">
        {/* Technical Corner Brackets */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-px -left-px z-10 m-0! h-3.5 w-3.5 border-t border-l border-zinc-500"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-px -right-px z-10 m-0! h-3.5 w-3.5 border-t border-r border-zinc-500"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-px -left-px z-10 m-0! h-3.5 w-3.5 border-b border-l border-zinc-500"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-px -bottom-px z-10 m-0! h-3.5 w-3.5 border-r border-b border-zinc-500"
        />

        <div className="space-y-8 max-w-4xl">
          {/* Status Display Code & Title */}
          <div className="space-y-3">
            <div className="font-mono text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-white select-none">
              <span className="text-odl font-light mr-1.5" aria-hidden="true">[</span>
              {code}
              <span className="text-odl font-light ml-1.5" aria-hidden="true">]</span>
            </div>

            <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-zinc-100">
              {title}
            </h1>

            {description && (
              <p className="font-sans text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>

          {/* Action CTAs */}
          {actions && (
            <div className="pt-2">
              {actions}
            </div>
          )}

          {/* Additional Content (Search, Quick Links, Debug Info) */}
          {children && (
            <div className="pt-4 border-t border-zinc-800/80 space-y-6">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
