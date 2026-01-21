'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/utilities/ui'

export interface LinkPreviewData {
  title?: string
  description?: string
  image?: string
  siteName?: string
  url: string
  loading: boolean
  error?: string
}

export interface LinkPreviewProps {
  url: string
  onClose: () => void
  className?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

// Mock function to simulate fetching link preview data
// In a real implementation, this would call an API endpoint
const fetchLinkPreview = async (url: string): Promise<Partial<LinkPreviewData>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data based on common domains
  const domain = new URL(url).hostname.toLowerCase()

  if (domain.includes('github.com')) {
    return {
      title: 'GitHub Repository',
      description: 'A repository on GitHub',
      siteName: 'GitHub',
      image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    }
  }

  if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
    return {
      title: 'YouTube Video',
      description: 'Watch this video on YouTube',
      siteName: 'YouTube',
      image: 'https://www.youtube.com/img/desktop/yt_1200.png',
    }
  }

  if (domain.includes('twitter.com') || domain.includes('x.com')) {
    return {
      title: 'Tweet',
      description: 'A post on X (formerly Twitter)',
      siteName: 'X',
    }
  }

  // Default preview
  return {
    title: domain,
    description: 'External link',
    siteName: domain,
  }
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({
  url,
  onClose,
  className,
  position = 'top',
  delay = 500,
}) => {
  const [previewData, setPreviewData] = useState<LinkPreviewData>({
    url,
    loading: true,
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isVisible) return

    const loadPreview = async () => {
      try {
        const data = await fetchLinkPreview(url)
        setPreviewData({
          ...data,
          url,
          loading: false,
        })
      } catch (error) {
        setPreviewData({
          url,
          loading: false,
          error: 'Failed to load preview',
        })
      }
    }

    loadPreview()
  }, [url, isVisible])

  if (!isVisible) {
    return null
  }

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  }

  return (
    <div
      className={cn(
        'absolute z-50 w-80 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg',
        'dark:bg-gray-800 dark:border-gray-700',
        positionClasses[position],
        className,
      )}
      role="tooltip"
      aria-label="Link preview"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className={cn(
          'absolute top-2 right-2 w-6 h-6 flex items-center justify-center',
          'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
          'rounded-full hover:bg-gray-100 dark:hover:bg-gray-700',
          'transition-colors duration-200',
        )}
        aria-label="Close preview"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {previewData.loading ? (
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      ) : previewData.error ? (
        <div className="p-4">
          <div className="text-red-600 dark:text-red-400 text-sm font-medium mb-1">
            Preview unavailable
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 break-all">{url}</div>
        </div>
      ) : (
        <div className="p-4">
          {/* Image */}
          {previewData.image && (
            <div className="mb-3">
              <img
                src={previewData.image}
                alt=""
                className="w-full h-32 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            {previewData.title && (
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                {previewData.title}
              </h3>
            )}

            {previewData.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                {previewData.description}
              </p>
            )}

            {previewData.siteName && (
              <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                {previewData.siteName}
              </div>
            )}

            <div className="text-xs text-blue-600 dark:text-blue-400 break-all">{url}</div>
          </div>
        </div>
      )}

      {/* Arrow pointer */}
      <div
        className={cn(
          'absolute w-3 h-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
          'transform rotate-45',
          {
            'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-t-0 border-l-0':
              position === 'top',
            'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-b-0 border-r-0':
              position === 'bottom',
            'left-full top-1/2 -translate-x-1/2 -translate-y-1/2 border-l-0 border-b-0':
              position === 'left',
            'right-full top-1/2 translate-x-1/2 -translate-y-1/2 border-r-0 border-t-0':
              position === 'right',
          },
        )}
      />
    </div>
  )
}

// Hook for managing link preview state
export const useLinkPreview = (delay = 500) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const showPreview = (url: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    const id = setTimeout(() => {
      setPreviewUrl(url)
    }, delay)

    setTimeoutId(id)
  }

  const hidePreview = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setPreviewUrl(null)
  }

  const clearPreview = () => {
    hidePreview()
  }

  return {
    previewUrl,
    showPreview,
    hidePreview,
    clearPreview,
  }
}

// Enhanced link component with preview functionality
export interface EnhancedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  enablePreview?: boolean
  previewDelay?: number
  previewPosition?: 'top' | 'bottom' | 'left' | 'right'
}

export const EnhancedLink: React.FC<EnhancedLinkProps> = ({
  href,
  children,
  enablePreview = false,
  previewDelay = 500,
  previewPosition = 'top',
  className,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const { previewUrl, showPreview, hidePreview } = useLinkPreview(previewDelay)

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (enablePreview && href.startsWith('http')) {
      showPreview(href)
    }
    onMouseEnter?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (enablePreview) {
      hidePreview()
    }
    onMouseLeave?.(e)
  }

  return (
    <span className="relative inline-block">
      <a
        href={href}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </a>

      {previewUrl && (
        <LinkPreview url={previewUrl} onClose={hidePreview} position={previewPosition} />
      )}
    </span>
  )
}
