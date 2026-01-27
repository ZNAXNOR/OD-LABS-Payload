'use client'

import { useLivePreview } from '@/providers/LivePreview'
import React, { useEffect } from 'react'

interface LivePreviewListenerProps {
  children: React.ReactNode
}

export function LivePreviewListener({ children }: LivePreviewListenerProps) {
  const { state, refresh, setError } = useLivePreview()

  // Handle draft mode detection and preview state initialization
  useEffect(() => {
    // Check if we're in draft mode by looking for draft mode cookies or URL parameters
    const isDraftMode =
      document.cookie.includes('__prerender_bypass') ||
      document.cookie.includes('__next_preview_data') ||
      window.location.search.includes('preview=true')

    if (isDraftMode && !state.isEnabled) {
      // Initialize preview mode if we detect draft mode but preview isn't enabled
      // This would typically be handled by the preview entry API route
      if (process.env.NODE_ENV === 'development') {
        console.log('[LivePreviewListener] Draft mode detected, but preview not enabled')
      }
    }
  }, [state.isEnabled])

  // Handle page visibility changes to pause/resume updates
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, we might want to pause updates
        if (process.env.NODE_ENV === 'development') {
          console.log('[LivePreviewListener] Page hidden, pausing updates')
        }
      } else {
        // Page is visible again, refresh to get latest content
        if (state.isEnabled) {
          refresh().catch((error) => {
            setError(`Failed to refresh on visibility change: ${error.message}`)
          })
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [state.isEnabled, refresh, setError])

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (state.isEnabled) {
        // Refresh content when navigating back/forward in preview mode
        refresh().catch((error) => {
          setError(`Failed to refresh on navigation: ${error.message}`)
        })
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [state.isEnabled, refresh, setError])

  // Handle beforeunload to clean up preview session
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (state.isEnabled && state.currentSession) {
        // Send beacon to clean up session on page unload
        navigator.sendBeacon(
          '/api/preview/cleanup',
          JSON.stringify({
            sessionId: state.currentSession.id,
          }),
        )
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [state.isEnabled, state.currentSession])

  return <>{children}</>
}
