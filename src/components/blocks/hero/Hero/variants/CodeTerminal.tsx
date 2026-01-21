'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/ui/Link'
import type { HeroVariantProps } from '../types'
import { getThemeClasses, getHeightClasses } from '../utils'

export const CodeTerminalHero: React.FC<HeroVariantProps> = ({ block, className }) => {
  const { eyebrow, heading, subheading, actions, settings, codeSnippet } = block

  const [displayedCode, setDisplayedCode] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  const code = codeSnippet?.code || ''
  const language = codeSnippet?.language || 'javascript'
  const theme = codeSnippet?.theme || 'dark'

  // Typing animation effect
  useEffect(() => {
    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode((prev) => prev + code[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 30)

      return () => clearTimeout(timeout)
    }
    return undefined
  }, [currentIndex, code])

  // Sort actions by priority
  const sortedActions = actions?.slice().sort((a, b) => {
    const priorityOrder = { primary: 0, secondary: 1 }
    return (
      (priorityOrder[a.priority as keyof typeof priorityOrder] || 1) -
      (priorityOrder[b.priority as keyof typeof priorityOrder] || 1)
    )
  })

  const terminalBgClass = theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100'
  const terminalTextClass = theme === 'dark' ? 'text-green-400' : 'text-zinc-900'
  const terminalBorderClass = theme === 'dark' ? 'border-zinc-700' : 'border-zinc-300'

  return (
    <section
      className={cn('relative overflow-hidden', getHeightClasses(settings?.height), className)}
      role="banner"
      aria-label="Hero section"
    >
      <div
        className={cn(
          'grid grid-cols-1 lg:grid-cols-2 gap-8 h-full container mx-auto px-4 py-12',
          getThemeClasses(settings?.theme, false),
        )}
      >
        {/* Content Side */}
        <div className="flex flex-col justify-center">
          {/* Eyebrow */}
          {eyebrow && (
            <p className="text-sm font-medium mb-4 uppercase tracking-wider opacity-90">
              {eyebrow}
            </p>
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

        {/* Terminal Side */}
        <div className="flex items-center justify-center">
          <div
            className={cn(
              'w-full max-w-2xl rounded-lg border shadow-2xl overflow-hidden',
              terminalBgClass,
              terminalBorderClass,
            )}
          >
            {/* Terminal Header */}
            <div
              className={cn(
                'flex items-center gap-2 px-4 py-3 border-b',
                terminalBorderClass,
                theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200',
              )}
            >
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span
                className={cn('text-xs ml-4', theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600')}
              >
                {language}
              </span>
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm overflow-x-auto">
              <pre className={cn('whitespace-pre-wrap', terminalTextClass)}>
                {displayedCode}
                <span className="animate-pulse">▊</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
