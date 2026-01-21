'use client'

import React from 'react'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/ui/Link'
import { Media } from '@/components/ui/Media'
import type { HeroVariantProps } from '../types'
import { getThemeClasses, getHeightClasses } from '../utils'

export const SplitHero: React.FC<HeroVariantProps> = ({ block, className }) => {
  const { eyebrow, heading, subheading, media, actions, settings, splitLayout } = block

  const contentSide = splitLayout?.contentSide || 'left'
  const mediaType = splitLayout?.mediaType || 'image'

  // Sort actions by priority
  const sortedActions = actions?.slice().sort((a, b) => {
    const priorityOrder = { primary: 0, secondary: 1 }
    return (
      (priorityOrder[a.priority as keyof typeof priorityOrder] || 1) -
      (priorityOrder[b.priority as keyof typeof priorityOrder] || 1)
    )
  })

  const contentSection = (
    <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
      {/* Eyebrow */}
      {eyebrow && (
        <p className="text-sm font-medium mb-4 uppercase tracking-wider opacity-90">{eyebrow}</p>
      )}

      {/* Heading */}
      <h1 className="font-bold mb-6 leading-tight text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
        {heading}
      </h1>

      {/* Subheading */}
      {subheading && (
        <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">{subheading}</p>
      )}

      {/* Actions */}
      {sortedActions && sortedActions.length > 0 && (
        <div className="flex gap-4 justify-start flex-col sm:flex-row">
          {sortedActions.map((action, index) => {
            if (!action.link) return null

            return (
              <CMSLink
                key={index}
                {...action.link}
                className={cn(
                  'px-8 py-4 text-lg rounded-full font-medium transition-all duration-200',
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
  )

  const mediaSection = (
    <div className="relative flex items-center justify-center bg-zinc-900 dark:bg-zinc-950">
      {mediaType === 'image' && media ? (
        <Media resource={media} imgClassName="object-cover w-full h-full" priority size="50vw" />
      ) : (
        <div className="flex items-center justify-center w-full h-full p-8">
          <p className="text-zinc-500 dark:text-zinc-400">Media placeholder</p>
        </div>
      )}
    </div>
  )

  return (
    <section
      className={cn('relative overflow-hidden', getHeightClasses(settings?.height), className)}
      role="banner"
      aria-label="Hero section"
    >
      <div
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 h-full',
          getThemeClasses(settings?.theme, false),
        )}
      >
        {contentSide === 'left' ? (
          <>
            {contentSection}
            {mediaSection}
          </>
        ) : (
          <>
            {mediaSection}
            {contentSection}
          </>
        )}
      </div>
    </section>
  )
}
