'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/utilities/ui'

// Adaptive video configuration
interface AdaptiveVideoConfig {
  autoplay?: boolean
  controls?: boolean
  muted?: boolean
  loop?: boolean
  poster?: string
  preload?: 'none' | 'metadata' | 'auto'
  quality?: 'low' | 'medium' | 'high' | 'auto'
  enableAdaptiveStreaming?: boolean
  enableBandwidthDetection?: boolean
  enableDeviceOptimization?: boolean
}

interface AdaptiveVideoProps {
  src: string
  className?: string
  containerClassName?: string
  config?: AdaptiveVideoConfig
  onLoad?: () => void
  onError?: (error: Error) => void
  onQualityChange?: (quality: string) => void
}

// Device and network detection utilities
const getDeviceCapabilities = () => {
  if (typeof window === 'undefined') {
    return { isMobile: false, isLowPower: false, hasGoodConnection: true }
  }

  const isMobile = window.innerWidth < 768
  const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2

  // Check network connection
  const connection = (navigator as any).connection
  const hasGoodConnection = !connection?.effectiveType?.includes('2g') && !connection?.saveData

  return { isMobile, isLowPower, hasGoodConnection }
}

const getBandwidthEstimate = (): Promise<number> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(1000) // Default to 1 Mbps
      return
    }

    const connection = (navigator as any).connection
    if (connection?.downlink) {
      resolve(connection.downlink * 1000) // Convert to kbps
      return
    }

    // Fallback: measure download speed with a small test file
    const startTime = performance.now()
    const testImage = new Image()

    testImage.onload = () => {
      const endTime = performance.now()
      const duration = (endTime - startTime) / 1000 // Convert to seconds
      const fileSize = 50 * 1024 // Assume 50KB test file
      const bandwidth = (fileSize * 8) / duration / 1000 // Convert to kbps
      resolve(Math.max(bandwidth, 100)) // Minimum 100 kbps
    }

    testImage.onerror = () => {
      resolve(500) // Default to 500 kbps on error
    }

    // Use a small image for bandwidth testing
    testImage.src =
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A'
  })
}

export const AdaptiveVideo: React.FC<AdaptiveVideoProps> = ({
  src,
  className,
  containerClassName = 'relative aspect-video w-full',
  config = {},
  onLoad,
  onError,
  onQualityChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuality, setCurrentQuality] = useState<string>('auto')
  const [adaptiveConfig, setAdaptiveConfig] = useState<AdaptiveVideoConfig>(config)
  const [bandwidth, setBandwidth] = useState<number>(1000)

  // Initialize adaptive configuration based on device and network
  useEffect(() => {
    const initializeAdaptiveConfig = async () => {
      const { isMobile, hasGoodConnection } = getDeviceCapabilities()

      let detectedBandwidth = 1000
      if (config.enableBandwidthDetection) {
        try {
          detectedBandwidth = await getBandwidthEstimate()
          setBandwidth(detectedBandwidth)
        } catch (error) {
          console.warn('Failed to detect bandwidth:', error)
        }
      }

      // Determine optimal quality based on device and network
      let optimalQuality = config.quality || 'auto'
      if (optimalQuality === 'auto') {
        if (detectedBandwidth < 500 || !hasGoodConnection) {
          optimalQuality = 'low'
        } else if (detectedBandwidth < 2000 || isMobile) {
          optimalQuality = 'medium'
        } else {
          optimalQuality = 'high'
        }
      }

      const newConfig: AdaptiveVideoConfig = {
        autoplay: config.autoplay && hasGoodConnection && !isMobile,
        controls: config.controls !== false, // Default to true
        muted: config.muted || (config.autoplay && isMobile),
        loop: config.loop || false,
        poster: config.poster,
        preload: hasGoodConnection ? config.preload || 'metadata' : 'none',
        quality: optimalQuality,
        enableAdaptiveStreaming: config.enableAdaptiveStreaming !== false,
        enableBandwidthDetection: config.enableBandwidthDetection !== false,
        enableDeviceOptimization: config.enableDeviceOptimization !== false,
      }

      setAdaptiveConfig(newConfig)
      setCurrentQuality(optimalQuality)
      onQualityChange?.(optimalQuality)
    }

    initializeAdaptiveConfig()
  }, [config, onQualityChange])

  // Handle video load events
  const handleLoad = () => {
    setIsLoading(false)
    setError(null)
    onLoad?.()
  }

  const handleError = (_e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const errorMessage = 'Failed to load video'
    setError(errorMessage)
    setIsLoading(false)
    onError?.(new Error(errorMessage))
  }

  // Generate video sources based on quality
  const getVideoSources = () => {
    const sources = []
    const quality = adaptiveConfig.quality || 'medium'

    // Add WebM source (better compression)
    sources.push({
      src: getQualityUrl(src, 'webm', quality),
      type: 'video/webm',
    })

    // Add MP4 source (better compatibility)
    sources.push({
      src: getQualityUrl(src, 'mp4', quality),
      type: 'video/mp4',
    })

    return sources
  }

  // Monitor bandwidth changes and adjust quality
  useEffect(() => {
    if (!adaptiveConfig.enableAdaptiveStreaming || !videoRef.current) return

    const monitorBandwidth = async () => {
      try {
        const newBandwidth = await getBandwidthEstimate()
        setBandwidth(newBandwidth)

        // Adjust quality based on bandwidth changes
        let newQuality = currentQuality
        if (newBandwidth < 500 && currentQuality !== 'low') {
          newQuality = 'low'
        } else if (newBandwidth > 2000 && currentQuality === 'low') {
          newQuality = 'medium'
        } else if (newBandwidth > 5000 && currentQuality !== 'high') {
          newQuality = 'high'
        }

        if (newQuality !== currentQuality) {
          setCurrentQuality(newQuality)
          onQualityChange?.(newQuality)

          // Update video sources
          const video = videoRef.current
          if (video) {
            const currentTime = video.currentTime
            const wasPaused = video.paused

            // Update sources
            const sources = getVideoSources()
            video.innerHTML = sources
              .map((source) => `<source src="${source.src}" type="${source.type}">`)
              .join('')

            video.load()
            video.currentTime = currentTime

            if (!wasPaused) {
              video.play().catch(console.warn)
            }
          }
        }
      } catch (error) {
        console.warn('Failed to monitor bandwidth:', error)
      }
    }

    // Monitor bandwidth every 30 seconds
    const interval = setInterval(monitorBandwidth, 30000)
    return () => clearInterval(interval)
  }, [adaptiveConfig.enableAdaptiveStreaming, currentQuality, onQualityChange])

  // Loading placeholder
  if (isLoading) {
    return (
      <div
        className={cn(
          containerClassName,
          'bg-gray-100 dark:bg-gray-800 flex items-center justify-center',
        )}
      >
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
          <span className="text-sm">Loading video...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        className={cn(
          containerClassName,
          'bg-red-50 dark:bg-red-900/20 flex items-center justify-center border border-red-200 dark:border-red-800 rounded-lg',
        )}
      >
        <div className="text-center text-red-600 dark:text-red-400">
          <div className="text-sm font-medium">Video Error</div>
          <div className="text-xs mt-1">{error}</div>
        </div>
      </div>
    )
  }

  const sources = getVideoSources()

  return (
    <div className={containerClassName}>
      <video
        ref={videoRef}
        className={cn('absolute inset-0 w-full h-full object-cover rounded-lg', className)}
        controls={adaptiveConfig.controls}
        autoPlay={adaptiveConfig.autoplay}
        muted={adaptiveConfig.muted}
        loop={adaptiveConfig.loop}
        poster={adaptiveConfig.poster}
        preload={adaptiveConfig.preload}
        playsInline
        onLoadedData={handleLoad}
        onError={handleError}
        data-quality={currentQuality}
        data-bandwidth={bandwidth}
      >
        {sources.map((source, index) => (
          <source key={index} src={source.src} type={source.type} />
        ))}
        Your browser does not support the video tag.
      </video>

      {/* Quality indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {currentQuality} ({Math.round(bandwidth)}kbps)
        </div>
      )}
    </div>
  )
}

// Utility function to generate quality-specific URLs
function getQualityUrl(baseUrl: string, format: string, quality: string): string {
  // This would integrate with your video processing service
  // For now, return the base URL (in a real implementation, you'd have different quality versions)

  const qualityMap = {
    low: '360p',
    medium: '720p',
    high: '1080p',
  }

  const qualityString = qualityMap[quality as keyof typeof qualityMap] || '720p'

  // Example: transform "video.mp4" to "video_720p.mp4"
  return baseUrl.replace(/\.(\w+)$/, `_${qualityString}.${format}`)
}

export default AdaptiveVideo
