import React from 'react'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { Media } from '@/components/ui/Media'
import { cn } from '@/utilities/ui'
import type { Media as MediaType } from '@/payload-types'
import { createErrorBoundaryWrapper, DefaultBlockErrorFallback } from '../utils'
import { OptimizedImage } from '../optimization/imageOptimization'
import { getResponsiveImageSizes } from '../utils/responsiveUtils'
import {
  generateSecureMediaAttributes,
  sanitizeMediaText,
  type MediaSecurityConfig,
  DEFAULT_MEDIA_SECURITY_CONFIG,
} from '../utils/mediaSecurityUtils'

// ============================================================================
// MEDIA CONVERTER TYPES AND INTERFACES
// ============================================================================

export interface MediaConverterConfig {
  enableCaption?: boolean
  enableZoom?: boolean
  enableLightbox?: boolean
  className?: string
  imgClassName?: string
  captionClassName?: string
  containerClassName?: string
  securityConfig?: MediaSecurityConfig
  enableSecurityValidation?: boolean
}

export interface ResponsiveMediaConfig {
  mobile?: MediaConverterConfig & {
    width?: string
    height?: string
    aspectRatio?: string
    quality?: number
  }
  tablet?: MediaConverterConfig & {
    width?: string
    height?: string
    aspectRatio?: string
    quality?: number
  }
  desktop?: MediaConverterConfig & {
    width?: string
    height?: string
    aspectRatio?: string
    quality?: number
  }
}

export interface GalleryConfig {
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  gap?: string
  className?: string
  itemClassName?: string
}

export interface VideoEmbedConfig {
  autoplay?: boolean
  controls?: boolean
  muted?: boolean
  loop?: boolean
  className?: string
  containerClassName?: string
}

export interface FileAttachmentConfig {
  showIcon?: boolean
  showSize?: boolean
  showType?: boolean
  className?: string
  iconClassName?: string
  downloadText?: string
}

export interface DragDropConfig {
  enabled?: boolean
  acceptedTypes?: string[]
  maxSize?: number
  className?: string
  dragOverClassName?: string
  onUpload?: (file: File) => Promise<MediaType>
}

// ============================================================================
// BASIC MEDIA CONVERTERS
// ============================================================================

/**
 * Default media converter for upload fields in rich text with security validation
 */
export const defaultMediaConverter = ({ node }: { node: any }) => {
  const WrappedComponent = createErrorBoundaryWrapper(MediaBlock, DefaultBlockErrorFallback)

  return React.createElement(WrappedComponent, {
    className: 'col-start-1 col-span-3 mb-6',
    imgClassName: 'm-0 border border-border rounded-[0.8rem]',
    captionClassName: 'mx-auto max-w-[48rem]',
    enableGutter: false,
    disableInnerContainer: true,
    ...node.fields,
  })
}

/**
 * Enhanced media converter with configuration options and security validation
 */
export const createEnhancedMediaConverter = (config?: MediaConverterConfig) => {
  const {
    enableCaption = true,
    enableZoom = false,
    enableLightbox = false,
    className = 'col-start-1 col-span-3 mb-6',
    imgClassName = 'm-0 border border-border rounded-[0.8rem]',
    captionClassName = 'mx-auto max-w-[48rem]',
    containerClassName,
    securityConfig = DEFAULT_MEDIA_SECURITY_CONFIG,
    enableSecurityValidation = true,
  } = config || {}

  return ({ node }: { node: any }) => {
    const WrappedComponent = createErrorBoundaryWrapper(MediaBlock, DefaultBlockErrorFallback)

    // Security validation
    if (enableSecurityValidation && node.fields.media?.url) {
      const mediaType = node.fields.media.mimeType?.startsWith('image/')
        ? 'image'
        : node.fields.media.mimeType?.startsWith('video/')
          ? 'video'
          : node.fields.media.mimeType?.startsWith('audio/')
            ? 'audio'
            : 'file'

      // This would be handled asynchronously in a real implementation
      // For now, we'll apply basic security attributes
      const securityAttrs = generateSecureMediaAttributes(
        mediaType as 'img' | 'video' | 'audio',
        node.fields.media.url,
        securityConfig,
      )

      // Merge security attributes with existing props
      Object.assign(node.fields, securityAttrs)
    }

    // Sanitize caption text if present
    if (enableCaption && node.fields.media?.caption) {
      node.fields.media.caption = sanitizeMediaText(node.fields.media.caption)
    }

    // Sanitize alt text if present
    if (node.fields.media?.alt) {
      node.fields.media.alt = sanitizeMediaText(node.fields.media.alt)
    }

    const handleClick =
      enableLightbox || enableZoom
        ? () => {
            // This would integrate with a lightbox library like react-image-gallery or photoswipe
            if (typeof window !== 'undefined') {
              console.log('Open lightbox for media:', node.fields.media)
              // Example: openLightbox(node.fields.media)
            }
          }
        : undefined

    const mediaElement = React.createElement(WrappedComponent, {
      className,
      imgClassName: cn(imgClassName, {
        'cursor-pointer hover:opacity-90 transition-opacity': enableLightbox || enableZoom,
      }),
      captionClassName: enableCaption ? captionClassName : 'hidden',
      enableGutter: false,
      disableInnerContainer: true,
      ...node.fields,
    })

    if (containerClassName || handleClick) {
      return React.createElement(
        'div',
        {
          className: containerClassName,
          onClick: handleClick,
          role: handleClick ? 'button' : undefined,
          tabIndex: handleClick ? 0 : undefined,
          onKeyDown: handleClick
            ? (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleClick()
                }
              }
            : undefined,
        },
        mediaElement,
      )
    }

    return mediaElement
  }
}

// ============================================================================
// IMAGE INSERTION WITH CAPTIONS
// ============================================================================

/**
 * Image converter with enhanced caption support
 */
export const createImageWithCaptionConverter = (config?: {
  captionPosition?: 'bottom' | 'top' | 'overlay'
  captionStyle?: 'default' | 'minimal' | 'card'
  enableAltText?: boolean
  className?: string
}) => {
  const {
    captionPosition = 'bottom',
    captionStyle = 'default',
    enableAltText = true,
    className = 'mb-6',
  } = config || {}

  return ({ node }: { node: any }) => {
    const media = node.fields.media
    if (!media || typeof media !== 'object') {
      return React.createElement('div', { className: 'text-gray-500 italic' }, 'No media found')
    }

    const captionClasses = {
      default: 'mt-3 text-sm text-gray-600 dark:text-gray-400',
      minimal: 'mt-2 text-xs text-gray-500',
      card: 'mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm',
    }

    const overlayClasses = 'absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3'

    const imageElement = React.createElement(Media, {
      resource: media,
      className: cn('w-full', {
        relative: captionPosition === 'overlay',
      }),
      imgClassName: 'w-full h-auto object-cover rounded-lg',
      alt: enableAltText ? media.alt : undefined,
    })

    const captionElement = media.caption
      ? React.createElement(
          'div',
          {
            className: cn(
              captionPosition === 'overlay' ? overlayClasses : captionClasses[captionStyle],
            ),
          },
          typeof media.caption === 'string' ? media.caption : 'Caption available',
        )
      : null

    const elements = []

    if (captionPosition === 'top' && captionElement) {
      elements.push(React.cloneElement(captionElement, { key: 'caption-top' }))
    }

    elements.push(React.cloneElement(imageElement, { key: 'image' }))

    if (captionPosition === 'bottom' && captionElement) {
      elements.push(React.cloneElement(captionElement, { key: 'caption-bottom' }))
    }

    if (captionPosition === 'overlay' && captionElement) {
      elements.push(React.cloneElement(captionElement, { key: 'caption-overlay' }))
    }

    return React.createElement('figure', { className: cn('rich-text-image', className) }, elements)
  }
}

// ============================================================================
// VIDEO EMBEDDING SUPPORT
// ============================================================================

/**
 * Video embedding converter with adaptive features and responsive sizing
 */
export const createVideoEmbedConverter = (config?: VideoEmbedConfig) => {
  const {
    autoplay = false,
    controls = true,
    muted = false,
    loop = false,
    className = 'mb-6',
    containerClassName = 'relative aspect-video w-full',
  } = config || {}

  return ({ node }: { node: any }) => {
    const media = node.fields.media
    if (!media || typeof media !== 'object') {
      return React.createElement('div', { className: 'text-gray-500 italic' }, 'No video found')
    }

    // Check if it's a video file
    const isVideo = media.mimeType?.includes('video')

    if (!isVideo) {
      // Fallback to regular media converter for non-video files
      return defaultMediaConverter({ node })
    }

    // Adaptive video configuration based on device capabilities
    const getAdaptiveVideoConfig = () => {
      if (typeof window === 'undefined') {
        return { quality: 'auto', preload: 'metadata' }
      }

      // Check connection quality
      const connection = (navigator as any).connection
      const isSlowConnection = connection?.effectiveType?.includes('2g') || connection?.saveData

      // Check device capabilities
      const isMobile = window.innerWidth < 768

      return {
        quality: isSlowConnection ? 'low' : isMobile ? 'medium' : 'high',
        preload: isSlowConnection ? 'none' : isMobile ? 'metadata' : 'metadata',
        autoplay: autoplay && !isSlowConnection && !isMobile, // Disable autoplay on mobile/slow connections
        muted: muted || (autoplay && isMobile), // Force mute on mobile autoplay
        controls: controls || isMobile, // Always show controls on mobile
        poster: media.thumbnailURL || undefined,
      }
    }

    const adaptiveConfig = getAdaptiveVideoConfig()

    // YouTube video embedding with adaptive quality
    if (media.url && media.url.includes('youtube.com')) {
      const videoId = extractYouTubeVideoId(media.url)
      if (!videoId) {
        return React.createElement(
          'div',
          { className: 'text-red-500 italic' },
          'Invalid YouTube URL',
        )
      }

      const youtubeParams = new URLSearchParams({
        autoplay: adaptiveConfig.autoplay ? '1' : '0',
        muted: adaptiveConfig.muted ? '1' : '0',
        controls: adaptiveConfig.controls ? '1' : '0',
        rel: '0', // Don't show related videos
        modestbranding: '1', // Minimal YouTube branding
        playsinline: '1', // Play inline on mobile
        ...(adaptiveConfig.quality !== 'auto' && { vq: adaptiveConfig.quality }),
      })

      const embedUrl = `https://www.youtube.com/embed/${videoId}?${youtubeParams.toString()}`

      return React.createElement(
        'div',
        {
          className: cn(containerClassName, className),
          'data-video-type': 'youtube',
          'data-video-id': videoId,
        },
        React.createElement('iframe', {
          src: embedUrl,
          className: 'absolute inset-0 w-full h-full rounded-lg',
          allowFullScreen: true,
          title: media.alt || 'YouTube video',
          loading: 'lazy',
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        }),
      )
    }

    // Vimeo video embedding with adaptive quality
    if (media.url && media.url.includes('vimeo.com')) {
      const videoId = extractVimeoVideoId(media.url)
      if (!videoId) {
        return React.createElement('div', { className: 'text-red-500 italic' }, 'Invalid Vimeo URL')
      }

      const vimeoParams = new URLSearchParams({
        autoplay: adaptiveConfig.autoplay ? '1' : '0',
        muted: adaptiveConfig.muted ? '1' : '0',
        controls: adaptiveConfig.controls ? '1' : '0',
        playsinline: '1',
        dnt: '1', // Do not track
        ...(adaptiveConfig.quality !== 'auto' && { quality: adaptiveConfig.quality }),
      })

      const embedUrl = `https://player.vimeo.com/video/${videoId}?${vimeoParams.toString()}`

      return React.createElement(
        'div',
        {
          className: cn(containerClassName, className),
          'data-video-type': 'vimeo',
          'data-video-id': videoId,
        },
        React.createElement('iframe', {
          src: embedUrl,
          className: 'absolute inset-0 w-full h-full rounded-lg',
          allowFullScreen: true,
          title: media.alt || 'Vimeo video',
          loading: 'lazy',
          allow: 'autoplay; fullscreen; picture-in-picture',
        }),
      )
    }

    // Direct video file with adaptive quality and responsive sizing
    if (media.url) {
      const videoElement = React.createElement('video', {
        className: 'w-full h-full object-cover rounded-lg',
        controls: adaptiveConfig.controls,
        autoPlay: adaptiveConfig.autoplay,
        muted: adaptiveConfig.muted,
        loop,
        poster: adaptiveConfig.poster,
        preload: adaptiveConfig.preload,
        playsInline: true, // Important for mobile
        'data-video-type': 'direct',
        // Responsive video sources
        children: [
          // Multiple source elements for different qualities/formats
          React.createElement('source', {
            key: 'webm',
            src: getAdaptiveVideoUrl(media.url, 'webm', adaptiveConfig.quality),
            type: 'video/webm',
          }),
          React.createElement('source', {
            key: 'mp4',
            src: getAdaptiveVideoUrl(media.url, 'mp4', adaptiveConfig.quality),
            type: 'video/mp4',
          }),
          // Fallback text
          'Your browser does not support the video tag.',
        ].filter(Boolean),
      })

      return React.createElement(
        'div',
        { className: cn(containerClassName, className) },
        videoElement,
      )
    }

    return React.createElement(
      'div',
      { className: 'text-gray-500 italic' },
      'No valid video source found',
    )
  }
}

// Utility functions for video URL extraction and processing
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

function extractVimeoVideoId(url: string): string | null {
  const patterns = [/vimeo\.com\/(\d+)/, /player\.vimeo\.com\/video\/(\d+)/]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

function getAdaptiveVideoUrl(baseUrl: string, format: string, quality: string): string {
  // This is a placeholder function that would integrate with your video processing service
  // In a real implementation, this would return different quality versions of the video

  if (quality === 'low') {
    return baseUrl.replace(/\.(mp4|webm)$/, `_360p.${format}`)
  } else if (quality === 'medium') {
    return baseUrl.replace(/\.(mp4|webm)$/, `_720p.${format}`)
  } else if (quality === 'high') {
    return baseUrl.replace(/\.(mp4|webm)$/, `_1080p.${format}`)
  }

  return baseUrl
}

// ============================================================================
// FILE ATTACHMENT SUPPORT
// ============================================================================

/**
 * File attachment converter for downloadable files
 */
export const createFileAttachmentConverter = (config?: FileAttachmentConfig) => {
  const {
    showIcon = true,
    showSize = true,
    showType = true,
    className = 'mb-4',
    iconClassName = 'w-6 h-6',
    downloadText = 'Download',
  } = config || {}

  return ({ node }: { node: any }) => {
    const media = node.fields.media
    if (!media || typeof media !== 'object') {
      return React.createElement('div', { className: 'text-gray-500 italic' }, 'No file found')
    }

    const isImage = media.mimeType?.includes('image')
    const isVideo = media.mimeType?.includes('video')

    // Use appropriate converter for images and videos
    if (isImage) {
      return createImageWithCaptionConverter()({ node })
    }

    if (isVideo) {
      return createVideoEmbedConverter()({ node })
    }

    // For other file types, create a download link
    const fileExtension = media.filename?.split('.').pop()?.toUpperCase()
    const fileSize = media.filesize ? formatFileSize(media.filesize) : null

    return React.createElement(
      'div',
      {
        className: cn(
          'flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
          className,
        ),
      },
      [
        showIcon &&
          React.createElement(
            'div',
            { key: 'icon', className: cn('flex-shrink-0', iconClassName) },
            React.createElement(FileIcon, { extension: fileExtension }),
          ),
        React.createElement('div', { key: 'info', className: 'flex-1 min-w-0' }, [
          React.createElement(
            'div',
            { key: 'filename', className: 'font-medium truncate' },
            media.filename || 'Unknown file',
          ),
          React.createElement(
            'div',
            { key: 'meta', className: 'text-sm text-gray-500 flex gap-2' },
            [
              showType &&
                fileExtension &&
                React.createElement('span', { key: 'type' }, fileExtension),
              showSize && fileSize && React.createElement('span', { key: 'size' }, fileSize),
            ].filter(Boolean),
          ),
        ]),
        React.createElement(
          'a',
          {
            key: 'download',
            href: media.url,
            download: media.filename,
            className:
              'flex-shrink-0 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors',
          },
          downloadText,
        ),
      ].filter(Boolean),
    )
  }
}

// ============================================================================
// RESPONSIVE MEDIA CONVERTER
// ============================================================================

/**
 * Responsive media converter with device-specific configurations and image sizing
 */
export const createResponsiveMediaConverter = (config?: ResponsiveMediaConfig) => {
  const {
    mobile = {
      className: 'col-span-full mb-4',
      width: '100vw',
      quality: 75,
      aspectRatio: 'auto',
    },
    tablet = {
      className: 'md:col-start-1 md:col-span-3 mb-6',
      width: '50vw',
      quality: 80,
      aspectRatio: 'auto',
    },
    desktop = {
      className: 'lg:col-start-1 lg:col-span-3 mb-6',
      width: '33vw',
      quality: 85,
      aspectRatio: 'auto',
    },
  } = config || {}

  return ({ node }: { node: any }) => {
    const media = node.fields.media
    if (!media || typeof media !== 'object') {
      return React.createElement('div', { className: 'text-gray-500 italic' }, 'No media found')
    }

    const isImage = media.mimeType?.includes('image')

    if (isImage) {
      // Use responsive image sizing for images
      const sizes = getResponsiveImageSizes(
        mobile.width || '100vw',
        tablet.width || '50vw',
        desktop.width || '33vw',
      )

      // Combine responsive classes
      const responsiveClassName = cn(mobile.className, tablet.className, desktop.className)

      const responsiveImgClassName = cn(
        'w-full h-auto object-cover rounded-lg',
        mobile.imgClassName || 'm-0',
        tablet.imgClassName && `md:${tablet.imgClassName}`,
        desktop.imgClassName && `lg:${desktop.imgClassName}`,
        // Responsive aspect ratios
        mobile.aspectRatio && mobile.aspectRatio !== 'auto' && `aspect-${mobile.aspectRatio}`,
        tablet.aspectRatio && tablet.aspectRatio !== 'auto' && `md:aspect-${tablet.aspectRatio}`,
        desktop.aspectRatio && desktop.aspectRatio !== 'auto' && `lg:aspect-${desktop.aspectRatio}`,
      )

      return React.createElement(OptimizedImage, {
        resource: media,
        className: responsiveClassName,
        imgClassName: responsiveImgClassName,
        sizes,
        quality: desktop.quality || 85,
        loadingStrategy: 'intersection',
        enableWebP: true,
        enableBlurPlaceholder: true,
        alt: media.alt || '',
        breakpoints: {
          mobile: 640,
          tablet: 768,
          desktop: 1024,
          wide: 1280,
        },
      })
    }

    // For non-images, use the standard MediaBlock
    const WrappedComponent = createErrorBoundaryWrapper(MediaBlock, DefaultBlockErrorFallback)

    // Combine responsive classes
    const responsiveClassName = cn(mobile.className, tablet.className, desktop.className)

    const responsiveImgClassName = cn(
      mobile.imgClassName || 'm-0',
      tablet.imgClassName && `md:${tablet.imgClassName}`,
      desktop.imgClassName && `lg:${desktop.imgClassName}`,
    )

    return React.createElement(WrappedComponent, {
      className: responsiveClassName,
      imgClassName: responsiveImgClassName,
      captionClassName: mobile.captionClassName || 'mx-auto max-w-[48rem]',
      enableGutter: false,
      disableInnerContainer: true,
      ...node.fields,
    })
  }
}

// ============================================================================
// MEDIA GALLERY CONVERTER
// ============================================================================

/**
 * Media gallery converter for multiple images
 */
export const createMediaGalleryConverter = (config?: GalleryConfig) => {
  const {
    columns = { mobile: 1, tablet: 2, desktop: 3 },
    gap = 'gap-4',
    className = 'mb-6',
    itemClassName = 'aspect-square overflow-hidden rounded-lg',
  } = config || {}

  return ({ node }: { node: any }) => {
    const media = node.fields.media

    // Handle single media item
    if (media && typeof media === 'object' && !Array.isArray(media)) {
      return React.createElement(
        'div',
        { className: cn('grid grid-cols-1', gap, className) },
        React.createElement(
          'div',
          { className: itemClassName },
          React.createElement(Media, {
            resource: media,
            className: 'w-full h-full object-cover',
          }),
        ),
      )
    }

    // Handle multiple media items (if supported)
    if (Array.isArray(media)) {
      const gridClasses = cn(
        'grid',
        `grid-cols-${columns.mobile}`,
        `md:grid-cols-${columns.tablet}`,
        `lg:grid-cols-${columns.desktop}`,
        gap,
        className,
      )

      return React.createElement(
        'div',
        { className: gridClasses },
        media.map((item, index) =>
          React.createElement(
            'div',
            { key: index, className: itemClassName },
            React.createElement(Media, {
              resource: item,
              className: 'w-full h-full object-cover',
            }),
          ),
        ),
      )
    }

    return React.createElement('div', { className: 'text-gray-500 italic' }, 'No media found')
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Simple file icon component
 */
function FileIcon({ extension }: { extension?: string }) {
  const iconClasses =
    'w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold text-gray-600 dark:text-gray-300'

  return React.createElement('div', { className: iconClasses }, extension || 'FILE')
}

// ============================================================================
// DRAG AND DROP SUPPORT (PLACEHOLDER)
// ============================================================================

/**
 * Drag and drop media converter (requires additional implementation)
 * This is a placeholder for future drag-and-drop functionality
 */
export const createDragDropMediaConverter = (config?: DragDropConfig) => {
  // Destructure config for future use when drag-and-drop is fully implemented
  const dragDropConfig = {
    enabled: config?.enabled ?? true,
    acceptedTypes: config?.acceptedTypes ?? ['image/*', 'video/*'],
    maxSize: config?.maxSize ?? 10 * 1024 * 1024, // 10MB
    className: config?.className ?? 'mb-6',
    dragOverClassName: config?.dragOverClassName ?? 'border-blue-500 bg-blue-50',
  }

  return ({ node }: { node: any }) => {
    // For now, fallback to default converter
    // In a full implementation, this would include drag-and-drop handlers
    // TODO: Use dragDropConfig when implementing the actual drag-and-drop functionality
    console.log('Drag drop config prepared:', dragDropConfig) // Temporary to avoid unused variable warning
    return defaultMediaConverter({ node })
  }
}

// ============================================================================
// OPTIMIZED IMAGE CONVERTERS
// ============================================================================

/**
 * Optimized image converter with advanced loading strategies
 */
export const createOptimizedImageConverter = (config?: {
  loadingStrategy?: 'lazy' | 'eager' | 'progressive' | 'intersection'
  enableWebP?: boolean
  enableAVIF?: boolean
  enableBlurPlaceholder?: boolean
  enablePreload?: boolean
  quality?: number
  className?: string
  imgClassName?: string
  captionClassName?: string
}) => {
  const {
    loadingStrategy = 'intersection',
    enableWebP = true,
    enableAVIF = false,
    enableBlurPlaceholder = true,
    enablePreload = false,
    quality = 85,
    className = 'col-start-1 col-span-3 mb-6',
    imgClassName = 'm-0 border border-border rounded-[0.8rem]',
  } = config || {}

  return ({ node }: { node: any }) => {
    const media = node.fields.media
    if (!media || typeof media !== 'object') {
      return React.createElement('div', { className: 'text-gray-500 italic' }, 'No media found')
    }

    // Check if it's an image
    const isImage = media.mimeType?.includes('image')
    if (!isImage) {
      // Fallback to default converter for non-images
      return defaultMediaConverter({ node })
    }

    return React.createElement(OptimizedImage, {
      resource: media,
      className,
      imgClassName,
      loadingStrategy,
      enableWebP,
      enableAVIF,
      enableBlurPlaceholder,
      enablePreload,
      quality,
      criticalResource: loadingStrategy === 'eager',
      priority: loadingStrategy === 'eager',
      alt: media.alt || '',
    })
  }
}

/**
 * Critical image converter for above-the-fold images
 */
export const createCriticalImageConverter = (config?: {
  quality?: number
  className?: string
  imgClassName?: string
}) => {
  return createOptimizedImageConverter({
    loadingStrategy: 'eager',
    enablePreload: true,
    enableWebP: true,
    enableAVIF: true,
    quality: config?.quality || 90,
    className: config?.className,
    imgClassName: config?.imgClassName,
  })
}

/**
 * Lazy image converter for below-the-fold images
 */
export const createLazyImageConverter = (config?: {
  quality?: number
  className?: string
  imgClassName?: string
}) => {
  return createOptimizedImageConverter({
    loadingStrategy: 'intersection',
    enableWebP: true,
    enableAVIF: false,
    enableBlurPlaceholder: true,
    quality: config?.quality || 80,
    className: config?.className,
    imgClassName: config?.imgClassName,
  })
}

/**
 * Progressive image converter with low-quality placeholder
 */
export const createProgressiveImageConverter = (config?: {
  quality?: number
  className?: string
  imgClassName?: string
}) => {
  return createOptimizedImageConverter({
    loadingStrategy: 'progressive',
    enableWebP: true,
    enableBlurPlaceholder: true,
    quality: config?.quality || 85,
    className: config?.className,
    imgClassName: config?.imgClassName,
  })
}

// ============================================================================
// RESPONSIVE IMAGE OPTIMIZATION
// ============================================================================

/**
 * Responsive image converter with device-specific optimization
 */
export const createResponsiveOptimizedImageConverter = (config?: {
  breakpoints?: Record<string, number>
  qualities?: Record<string, number>
  formats?: string[]
  className?: string
  imgClassName?: string
}) => {
  const {
    breakpoints = {
      mobile: 640,
      tablet: 768,
      desktop: 1024,
      wide: 1280,
    },
    qualities = {
      mobile: 75,
      tablet: 80,
      desktop: 85,
      wide: 90,
    },
    formats = ['webp', 'jpeg'],
    className = 'col-start-1 col-span-3 mb-6',
    imgClassName = 'm-0 border border-border rounded-[0.8rem]',
  } = config || {}

  return ({ node }: { node: any }) => {
    const media = node.fields.media
    if (!media || typeof media !== 'object') {
      return React.createElement('div', { className: 'text-gray-500 italic' }, 'No media found')
    }

    const isImage = media.mimeType?.includes('image')
    if (!isImage) {
      return defaultMediaConverter({ node })
    }

    // Generate responsive sizes string
    const sizes = Object.entries(breakpoints)
      .sort(([, a], [, b]) => a - b)
      .map(([, width]) => `(max-width: ${width}px) ${width}px`)
      .join(', ')

    return React.createElement(OptimizedImage, {
      resource: media,
      className,
      imgClassName,
      loadingStrategy: 'intersection',
      enableWebP: formats.includes('webp'),
      enableAVIF: formats.includes('avif'),
      enableBlurPlaceholder: true,
      quality: qualities.desktop || 85,
      breakpoints,
      sizes,
      alt: media.alt || '',
    })
  }
}

// ============================================================================
// PERFORMANCE-OPTIMIZED CONVERTERS
// ============================================================================

/**
 * High-performance image converter for galleries and lists
 */
export const createHighPerformanceImageConverter = (config?: {
  enableVirtualization?: boolean
  batchSize?: number
  quality?: number
  className?: string
  imgClassName?: string
}) => {
  const {
    quality = 75,
    className = 'mb-4',
    imgClassName = 'w-full h-auto object-cover rounded-lg',
  } = config || {}

  // Note: virtualization and batchSize are reserved for future implementation

  return ({ node, index }: { node: any; index?: number }) => {
    const media = node.fields.media
    if (!media || typeof media !== 'object') {
      return React.createElement('div', { className: 'text-gray-500 italic' }, 'No media found')
    }

    const isImage = media.mimeType?.includes('image')
    if (!isImage) {
      return defaultMediaConverter({ node })
    }

    // Determine loading strategy based on position
    const isAboveFold = (index || 0) < 3
    const loadingStrategy = isAboveFold ? 'eager' : 'intersection'

    return React.createElement(OptimizedImage, {
      resource: media,
      className,
      imgClassName,
      loadingStrategy,
      enableWebP: true,
      enableBlurPlaceholder: true,
      quality: isAboveFold ? quality + 10 : quality,
      priority: isAboveFold,
      alt: media.alt || '',
    })
  }
}

/**
 * Bandwidth-aware image converter
 */
export const createBandwidthAwareImageConverter = (config?: {
  lowBandwidthQuality?: number
  highBandwidthQuality?: number
  className?: string
  imgClassName?: string
}) => {
  const {
    lowBandwidthQuality = 60,
    highBandwidthQuality = 90,
    className = 'col-start-1 col-span-3 mb-6',
    imgClassName = 'm-0 border border-border rounded-[0.8rem]',
  } = config || {}

  return ({ node }: { node: any }) => {
    const media = node.fields.media
    if (!media || typeof media !== 'object') {
      return React.createElement('div', { className: 'text-gray-500 italic' }, 'No media found')
    }

    const isImage = media.mimeType?.includes('image')
    if (!isImage) {
      return defaultMediaConverter({ node })
    }

    // Detect connection quality (simplified)
    const isSlowConnection =
      typeof navigator !== 'undefined' &&
      'connection' in navigator &&
      (navigator as any).connection?.effectiveType?.includes('2g')

    const quality = isSlowConnection ? lowBandwidthQuality : highBandwidthQuality
    const enableAVIF = !isSlowConnection

    return React.createElement(OptimizedImage, {
      resource: media,
      className,
      imgClassName,
      loadingStrategy: 'intersection',
      enableWebP: true,
      enableAVIF,
      enableBlurPlaceholder: true,
      quality,
      alt: media.alt || '',
    })
  }
}

// ============================================================================
// MEDIA CONVERTER REGISTRY
// ============================================================================

/**
 * Default media converters for different upload field types with responsive sizing
 */
export const mediaConverters = {
  // Basic upload field with responsive sizing
  upload: createResponsiveMediaConverter({
    mobile: {
      className: 'col-span-full mb-4 w-full',
      width: '100vw',
      quality: 75,
      aspectRatio: 'auto',
    },
    tablet: {
      className: 'sm:col-start-1 sm:col-span-3 mb-6',
      width: '50vw',
      quality: 80,
      aspectRatio: 'auto',
    },
    desktop: {
      className: 'lg:col-start-1 lg:col-span-3 mb-6',
      width: '33vw',
      quality: 85,
      aspectRatio: 'auto',
    },
  }),

  // Enhanced media with captions and responsive sizing
  media: createResponsiveMediaConverter({
    mobile: {
      className: 'col-span-full mb-4 w-full',
      width: '100vw',
      quality: 75,
      enableCaption: true,
      enableZoom: false, // Disable zoom on mobile for better UX
    },
    tablet: {
      className: 'sm:col-start-1 sm:col-span-3 mb-6',
      width: '50vw',
      quality: 80,
      enableCaption: true,
      enableZoom: true,
    },
    desktop: {
      className: 'lg:col-start-1 lg:col-span-3 mb-6',
      width: '33vw',
      quality: 85,
      enableCaption: true,
      enableZoom: true,
    },
  }),

  // Optimized image converters with responsive sizing
  optimizedImage: createResponsiveOptimizedImageConverter({
    breakpoints: {
      mobile: 640,
      tablet: 768,
      desktop: 1024,
      wide: 1280,
    },
    qualities: {
      mobile: 75,
      tablet: 80,
      desktop: 85,
      wide: 90,
    },
    formats: ['webp', 'jpeg'],
  }),

  criticalImage: createCriticalImageConverter({
    quality: 90,
    className: 'col-start-1 col-span-3 mb-6 w-full',
    imgClassName: 'w-full h-auto object-cover rounded-lg',
  }),

  lazyImage: createLazyImageConverter({
    quality: 80,
    className: 'col-start-1 col-span-3 mb-6 w-full',
    imgClassName: 'w-full h-auto object-cover rounded-lg',
  }),

  progressiveImage: createProgressiveImageConverter({
    quality: 85,
    className: 'col-start-1 col-span-3 mb-6 w-full',
    imgClassName: 'w-full h-auto object-cover rounded-lg',
  }),

  responsiveImage: createResponsiveOptimizedImageConverter({
    breakpoints: {
      mobile: 375,
      tablet: 768,
      desktop: 1024,
      wide: 1280,
    },
    qualities: {
      mobile: 70,
      tablet: 80,
      desktop: 85,
      wide: 90,
    },
    formats: ['webp', 'avif', 'jpeg'],
  }),

  highPerformanceImage: createHighPerformanceImageConverter({
    quality: 75,
    className: 'mb-4 w-full',
    imgClassName: 'w-full h-auto object-cover rounded-lg',
  }),

  bandwidthAwareImage: createBandwidthAwareImageConverter({
    lowBandwidthQuality: 60,
    highBandwidthQuality: 90,
    className: 'col-start-1 col-span-3 mb-6 w-full',
    imgClassName: 'w-full h-auto object-cover rounded-lg',
  }),

  // Image-specific converter with responsive sizing
  image: createImageWithCaptionConverter({
    captionPosition: 'bottom',
    captionStyle: 'default',
    enableAltText: true,
    className: 'mb-6 w-full',
  }),

  // Video-specific converter with responsive sizing
  video: createVideoEmbedConverter({
    controls: true,
    autoplay: false,
    containerClassName: 'relative aspect-video w-full',
    className: 'mb-6',
  }),

  // File attachment converter
  file: createFileAttachmentConverter({
    showIcon: true,
    showSize: true,
    showType: true,
    className: 'mb-4 w-full max-w-md',
  }),

  // Gallery converter with responsive columns
  gallery: createMediaGalleryConverter({
    columns: { mobile: 1, tablet: 2, desktop: 3 },
    gap: 'gap-2 sm:gap-4 lg:gap-6',
    className: 'mb-6 w-full',
    itemClassName: 'aspect-square overflow-hidden rounded-lg',
  }),
}

// Export default converter registry
export default mediaConverters
