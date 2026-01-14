'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { HeroBlock as HeroBlockType } from '@/payload-types'

interface HeroBlockProps {
  block: HeroBlockType
  className?: string
}

export const HeroBlock: React.FC<HeroBlockProps> = ({ block, className }) => {
  const {
    type = 'default',
    eyebrow,
    heading,
    subheading,
    media,
    videoUrl,
    actions,
    settings,
  } = block

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [hasParallax, setHasParallax] = useState(false)

  // Handle parallax effect
  useEffect(() => {
    if (!settings?.enableParallax || (!media && !videoUrl)) {
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
  }, [settings?.enableParallax, media, videoUrl])

  // Handle video loading
  useEffect(() => {
    if (videoRef.current) {
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

  // Determine theme classes
  const getThemeClasses = () => {
    const theme = settings?.theme || 'auto'

    if (theme === 'light') return 'text-gray-900'
    if (theme === 'dark') return 'text-white'

    // Auto theme - adapt based on background
    if (media || videoUrl) return 'text-white'
    return 'text-gray-900'
  }

  // Determine height classes
  const getHeightClasses = () => {
    const height = settings?.height || 'large'

    switch (height) {
      case 'small':
        return 'min-h-[50vh]'
      case 'medium':
        return 'min-h-[75vh]'
      case 'large':
        return 'min-h-screen'
      case 'auto':
        return 'py-20 md:py-32'
      default:
        return 'min-h-screen'
    }
  }

  // Determine layout classes
  const getLayoutClasses = () => {
    switch (type) {
      case 'centered':
        return 'text-center items-center justify-center'
      case 'minimal':
        return 'items-center justify-center max-w-4xl mx-auto'
      default:
        return 'items-center justify-start'
    }
  }

  // Get overlay styles
  const getOverlayStyles = () => {
    if (!settings?.overlay?.enabled || (!media && !videoUrl)) return {}

    const opacity = (settings.overlay.opacity || 40) / 100
    const color = settings.overlay.color || 'black'

    const colorMap = {
      black: `rgba(0, 0, 0, ${opacity})`,
      white: `rgba(255, 255, 255, ${opacity})`,
      primary: `rgba(var(--primary), ${opacity})`,
    }

    return {
      backgroundColor: colorMap[color as keyof typeof colorMap] || colorMap.black,
    }
  }

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
      className={cn('relative overflow-hidden flex', getHeightClasses(), className)}
      role="banner"
      aria-label="Hero section"
    >
      {/* Background Media */}
      {(media || videoUrl) && (
        <div className="absolute inset-0 z-0" data-parallax={hasParallax}>
          {type === 'video' && videoUrl ? (
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
          <div className="absolute inset-0 z-10" style={getOverlayStyles()} aria-hidden="true" />
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          'relative z-20 container mx-auto px-4 flex flex-col w-full',
          getLayoutClasses(),
          getThemeClasses(),
        )}
      >
        <div
          className={cn(
            'max-w-4xl',
            type === 'centered' ? 'mx-auto text-center' : '',
            type === 'minimal' ? 'max-w-2xl' : '',
          )}
        >
          {/* Eyebrow */}
          {eyebrow && (
            <p
              className={cn(
                'text-sm font-medium mb-4 uppercase tracking-wider',
                'opacity-90',
                type === 'minimal' ? 'text-xs' : '',
              )}
            >
              {eyebrow}
            </p>
          )}

          {/* Heading */}
          <h1
            className={cn(
              'font-bold mb-6 leading-tight',
              type === 'minimal'
                ? 'text-3xl md:text-4xl lg:text-5xl'
                : 'text-4xl md:text-6xl lg:text-7xl xl:text-8xl',
            )}
          >
            {heading}
          </h1>

          {/* Subheading */}
          {subheading && (
            <p
              className={cn(
                'mb-8 opacity-90 leading-relaxed',
                type === 'minimal'
                  ? 'text-lg md:text-xl max-w-xl'
                  : 'text-xl md:text-2xl max-w-3xl',
                type === 'centered' ? 'mx-auto' : '',
              )}
            >
              {subheading}
            </p>
          )}

          {/* Actions */}
          {sortedActions && sortedActions.length > 0 && (
            <div
              className={cn(
                'flex gap-4',
                type === 'centered' ? 'justify-center' : 'justify-start',
                'flex-col sm:flex-row',
              )}
            >
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
                      action.priority === 'primary' ? 'focus:ring-white' : 'focus:ring-gray-400',
                    )}
                    size="lg"
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Loading indicator for video */}
      {type === 'video' && videoUrl && !isVideoLoaded && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-gray-900">
          <div className="flex items-center space-x-2 text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="text-sm">Loading video...</span>
          </div>
        </div>
      )}

      {/* Accessibility: Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to main content
      </a>
    </section>
  )
}

export default HeroBlock
