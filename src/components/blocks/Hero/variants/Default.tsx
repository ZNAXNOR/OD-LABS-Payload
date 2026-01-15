'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { HeroVariantProps } from '../types'
import { getThemeClasses, getHeightClasses, getOverlayStyles } from '../utils'

export const DefaultHero: React.FC<HeroVariantProps> = ({ block, className }) => {
  const { eyebrow, heading, subheading, media, videoUrl, actions, settings } = block

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [hasParallax, setHasParallax] = useState(false)

  const hasBackground = !!(media || videoUrl)

  // Handle parallax effect
  useEffect(() => {
    if (!settings?.enableParallax || !hasBackground) {
      return
    }

    setHasParallax(true)

    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const parallaxElement = document.querySelector('[data-parallax="true"]') as HTMLElement

      if (parallaxElement) {
        const speed = 0.5
        parallaxElement.style.transform = `translateY(${scrolled * speed}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [settings?.enableParallax, hasBackground])

  // Handle video loading
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      const video = videoRef.current

      const handleLoadedData = () => setIsVideoLoaded(true)
      const handleError = () => {
        console.warn('Hero video failed to load:', videoUrl)
        setIsVideoLoaded(false)
      }

      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('error', handleError)

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('error', handleError)
      }
    }
    return undefined
  }, [videoUrl])

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
      aria-label={`Hero section: ${heading}`}
    >
      {/* Background Media */}
      {hasBackground && (
        <div className="absolute inset-0 z-0" data-parallax={hasParallax} aria-hidden="true">
          {videoUrl ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className={cn(
                  'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000',
                  isVideoLoaded ? 'opacity-100' : 'opacity-0',
                )}
                aria-hidden="true"
                aria-label="Background video"
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Fallback to image if video fails to load */}
              {media && !isVideoLoaded && (
                <div className="absolute inset-0">
                  <Media resource={media} fill imgClassName="object-cover" priority />
                </div>
              )}
            </div>
          ) : media ? (
            <Media resource={media} fill imgClassName="object-cover" priority size="100vw" />
          ) : null}

          {/* Overlay */}
          <div
            className="absolute inset-0 z-10"
            style={getOverlayStyles(
              settings?.overlay?.enabled,
              settings?.overlay?.opacity,
              settings?.overlay?.color,
              hasBackground,
            )}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          'relative z-20 container mx-auto px-4 flex flex-col items-center justify-start w-full',
          getThemeClasses(settings?.theme, hasBackground),
        )}
      >
        <div className="max-w-4xl">
          {/* Eyebrow */}
          {eyebrow && (
            <p
              className="text-sm font-medium mb-4 uppercase tracking-wider opacity-90"
              role="doc-subtitle"
            >
              {eyebrow}
            </p>
          )}

          {/* Heading */}
          <h1 className="font-bold mb-6 leading-tight text-4xl md:text-6xl lg:text-7xl xl:text-8xl">
            {heading}
          </h1>

          {/* Subheading */}
          {subheading && (
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl">
              {subheading}
            </p>
          )}

          {/* Actions */}
          {sortedActions && sortedActions.length > 0 && (
            <div
              className="flex gap-4 justify-start flex-col sm:flex-row"
              role="group"
              aria-label="Hero actions"
            >
              {sortedActions.map((action, index) => {
                if (!action.link) return null

                return (
                  <CMSLink
                    key={index}
                    {...action.link}
                    aria-label={action.link?.link?.label || `Action ${index + 1}`}
                    className={cn(
                      'px-8 py-4 text-lg rounded-full font-medium transition-all duration-200',
                      'hover:scale-105 focus:scale-105',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary',
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

      {/* Loading indicator for video */}
      {videoUrl && !isVideoLoaded && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-900"
          role="status"
          aria-live="polite"
          aria-label="Loading video content"
        >
          <div className="flex items-center space-x-2 text-white">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"
              aria-hidden="true"
            ></div>
            <span className="text-sm">Loading video...</span>
          </div>
        </div>
      )}
    </section>
  )
}
