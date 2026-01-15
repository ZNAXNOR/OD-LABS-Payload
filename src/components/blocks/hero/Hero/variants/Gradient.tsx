'use client'

import React from 'react'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import type { HeroVariantProps } from '../types'
import { getThemeClasses, getHeightClasses } from '../utils'

export const GradientHero: React.FC<HeroVariantProps> = ({ block, className }) => {
  const { eyebrow, heading, subheading, actions, settings, gradientConfig } = block

  // Sort actions by priority
  const sortedActions = actions?.slice().sort((a, b) => {
    const priorityOrder = { primary: 0, secondary: 1 }
    return (
      (priorityOrder[a.priority as keyof typeof priorityOrder] || 1) -
      (priorityOrder[b.priority as keyof typeof priorityOrder] || 1)
    )
  })

  // Build gradient CSS
  const getGradientStyle = (): React.CSSProperties => {
    const colors = gradientConfig?.colors?.map((c: { color?: string | null }) => c.color) || [
      '#6366f1',
      '#8b5cf6',
      '#d946ef',
    ]
    const animation = gradientConfig?.animation || 'wave'

    const gradient = `linear-gradient(135deg, ${colors.join(', ')})`

    return {
      background: gradient,
      backgroundSize: animation === 'wave' ? '200% 200%' : '100% 100%',
    }
  }

  const getAnimationClass = () => {
    const animation = gradientConfig?.animation || 'wave'

    switch (animation) {
      case 'wave':
        return 'animate-gradient-wave'
      case 'pulse':
        return 'animate-gradient-pulse'
      case 'rotate':
        return 'animate-gradient-rotate'
      default:
        return ''
    }
  }

  return (
    <section
      className={cn(
        'relative overflow-hidden flex',
        getHeightClasses(settings?.height),
        getAnimationClass(),
        className,
      )}
      style={getGradientStyle()}
      role="banner"
      aria-label="Hero section"
    >
      {/* Content */}
      <div
        className={cn(
          'relative z-20 container mx-auto px-4 flex flex-col items-center justify-center w-full text-center',
          getThemeClasses(settings?.theme, true),
        )}
      >
        <div className="max-w-4xl mx-auto">
          {/* Eyebrow */}
          {eyebrow && (
            <p className="text-sm font-medium mb-4 uppercase tracking-wider opacity-90">
              {eyebrow}
            </p>
          )}

          {/* Heading */}
          <h1 className="font-bold mb-6 leading-tight text-4xl md:text-6xl lg:text-7xl xl:text-8xl">
            {heading}
          </h1>

          {/* Subheading */}
          {subheading && (
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto">
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
                      'px-8 py-4 text-lg rounded-full font-medium transition-all duration-200',
                      'hover:scale-105 focus:scale-105',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2',
                      action.priority === 'primary'
                        ? 'bg-white text-zinc-900 hover:bg-white/90'
                        : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700',
                    )}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-wave {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes gradient-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes gradient-rotate {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }

        .animate-gradient-wave {
          animation: gradient-wave 15s ease infinite;
        }

        .animate-gradient-pulse {
          animation: gradient-pulse 4s ease-in-out infinite;
        }

        .animate-gradient-rotate {
          animation: gradient-rotate 10s linear infinite;
        }
      `}</style>
    </section>
  )
}
