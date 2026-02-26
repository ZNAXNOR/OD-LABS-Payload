import React from 'react'
import type { Page } from '@/payload-types'

type Props = {
  title: string
  legalHero?: Page['legalHero']
}

export const LegalHero: React.FC<Props> = ({ title, legalHero }) => {
  if (!legalHero) return null
  const { description, lastUpdated } = legalHero

  const formattedDate = lastUpdated
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(lastUpdated))
    : ''

  return (
    <section className="container py-24 lg:py-32">
      <div className="max-w-280">
        <div className="mb-6 flex items-center gap-4">
          <div className="h-2 w-2 bg-foreground"></div>
          <span className="text-sm font-medium text-muted-foreground">Legal</span>
        </div>
        <div>
          <h1 className="font-serif text-6xl leading-none font-light tracking-tight text-foreground md:text-8xl lg:text-9xl">
            {title || 'Legal Information'}
          </h1>
          {description && (
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">{description}</p>
          )}
        </div>
        {lastUpdated && (
          <div className="mt-12 grid grid-cols-2 text-sm tracking-wider text-muted-foreground uppercase md:grid-cols-4 lg:grid-cols-6 gap-y-12 gap-x-8 border-t border-border pt-12">
            <div>
              <span className="block opacity-60 mb-1">Last Updated</span>
              <span className="text-foreground">{formattedDate}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
