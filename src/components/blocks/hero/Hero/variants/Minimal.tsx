'use client'

import React from 'react'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/ui/Link'
import type { HeroVariantProps } from '../types'
import { getThemeClasses, getHeightClasses } from '../utils'

export const MinimalHero: React.FC<HeroVariantProps> = ({ block, className }) => {
  const { eyebrow, heading, subheading, actions, settings } = block

  // Sort actions by priority
  const sortedActions = actions?.slice().sort((a, b) => {
    const priorityOrder = { primary: 0, secondary: 1 }
    return (
      (priorityOrder[a.priority as keyof typeof priorityOrder] || 1) -
      (priorityOrder[b.priority as keyof typeof priorityOrder] || 1)
    )
  })

  return (
    <section
      className={cn('relative overflow-hidden flex', getHeightClasses(settings?.height), className)}
      role="banner"
      aria-label="Hero section"
    >
      {/* Content */}
      <div
        className={cn(
          'relative z-20 container mx-auto px-4 flex flex-col items-center justify-center w-full',
          getThemeClasses(settings?.theme, false),
        )}
      >
        <div className="max-w-2xl mx-auto text-center">
          {/* Eyebrow */}
          {eyebrow && (
            <p className="text-xs font-medium mb-4 uppercase tracking-wider opacity-90">
              {eyebrow}
            </p>
          )}

          {/* Heading */}
          <h1 className="font-bold mb-6 leading-tight text-3xl md:text-4xl lg:text-5xl">
            {heading}
          </h1>

          {/* Subheading */}
          {subheading && (
            <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed max-w-xl mx-auto">
              {subheading}
            </p>
          )}

          {/* Actions */}
          {sortedActions && sortedActions.length > 0 && (
            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              {sortedActions.map((action, index) => {
                if (!action.link) return null

                return (
                  <CMSLink
                    key={index}
                    {...action.link}
                    className={cn(
                      'px-6 py-3 text-base rounded-full font-medium transition-all duration-200',
                      'hover:scale-105 focus:scale-105',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2',
                      action.priority === 'primary'
                        ? 'bg-brand-primary text-white hover:bg-brand-primary/90 dark:bg-brand-primary dark:hover:bg-brand-primary/90'
                        : 'bg-zinc-800 text-white hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600',
                    )}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
