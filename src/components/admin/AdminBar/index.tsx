'use client'

import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'

// Extended user interface to include token
interface ExtendedPayloadMeUser extends PayloadMeUser {
  token?: string
}

import { useLivePreview } from '@/providers/LivePreview'
import { cn } from '@/utilities/ui'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import { useRouter, useSelectedLayoutSegments } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { DebugPanel } from './DebugPanel'
import { ErrorDisplay } from './ErrorDisplay'
import { LoadingIndicator } from './LoadingIndicator'

import './index.scss'

import { getClientSideURL } from '@/utilities/getURL'

const baseClass = 'admin-bar'

const collectionLabels = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
  blogs: {
    plural: 'Blog Pages',
    singular: 'Blog Page',
  },
  services: {
    plural: 'Services Pages',
    singular: 'Service Page',
  },
  legal: {
    plural: 'Legal Pages',
    singular: 'Legal Page',
  },
  contacts: {
    plural: 'Contact Pages',
    singular: 'Contact Page',
  },
}

// Collection to slug mapping for preview URL generation
const collectionSlugs = {
  pages: 'pages',
  blogs: 'blogs',
  services: 'services',
  legal: 'legal',
  contacts: 'contacts',
}

function Title() {
  return <span>Dashboard</span>
}

// Live Preview Button Component
function LivePreviewButton({
  documentId,
  isPreviewActive,
  onPreviewToggle,
  isLoading,
}: {
  documentId?: string | null
  isPreviewActive: boolean
  onPreviewToggle: () => void
  isLoading: boolean
}) {
  return (
    <button
      onClick={onPreviewToggle}
      disabled={isLoading || !documentId}
      className={cn(
        'live-preview-button',
        'px-3 py-1 text-sm font-medium rounded transition-colors',
        {
          'bg-green-600 text-white hover:bg-green-700': isPreviewActive,
          'bg-blue-600 text-white hover:bg-blue-700': !isPreviewActive && !isLoading,
          'bg-gray-400 text-gray-200 cursor-not-allowed': isLoading || !documentId,
        },
      )}
      title={
        !documentId
          ? 'No document selected for preview'
          : isPreviewActive
            ? 'Exit live preview mode'
            : 'Enter live preview mode'
      }
    >
      {isLoading ? (
        <>
          <span className="inline-block animate-spin mr-1">⟳</span>
          Loading...
        </>
      ) : isPreviewActive ? (
        <>
          <span className="mr-1">●</span>
          Live Preview
        </>
      ) : (
        <>
          <span className="mr-1">○</span>
          Preview
        </>
      )}
    </button>
  )
}

// Preview Status Indicator Component
function PreviewStatusIndicator({
  isPreviewActive,
  lastUpdate,
  error,
  isRealTimeConnected,
}: {
  isPreviewActive: boolean
  lastUpdate: Date | null
  error: string | null
  isRealTimeConnected: boolean
}) {
  if (!isPreviewActive) return null

  return (
    <div className="preview-status-indicator flex items-center space-x-2 text-xs">
      {/* Connection Status */}
      <div
        className={cn('flex items-center space-x-1', {
          'text-green-400': isRealTimeConnected && !error,
          'text-yellow-400': isRealTimeConnected && error,
          'text-red-400': !isRealTimeConnected,
        })}
      >
        <span
          className={cn('w-2 h-2 rounded-full', {
            'bg-green-400 animate-pulse': isRealTimeConnected && !error,
            'bg-yellow-400': isRealTimeConnected && error,
            'bg-red-400': !isRealTimeConnected,
          })}
        />
        <span>{isRealTimeConnected ? 'Connected' : 'Disconnected'}</span>
      </div>

      {/* Last Update Time */}
      {lastUpdate && (
        <div className="text-gray-300">Updated: {lastUpdate.toLocaleTimeString()}</div>
      )}

      {/* Error Indicator */}
      {error && (
        <div className="text-red-400" title={error}>
          ⚠ Error
        </div>
      )}
    </div>
  )
}

export function AdminBar(props: { adminBarProps?: PayloadAdminBarProps }) {
  const { adminBarProps } = props || {}
  const segments = useSelectedLayoutSegments()
  const [show, setShow] = useState(false)
  const [currentUser, setCurrentUser] = useState<ExtendedPayloadMeUser | null>(null)
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState<number | undefined>(undefined)

  const collection = (
    segments?.[0] && collectionLabels[segments[0] as keyof typeof collectionLabels]
      ? segments[0]
      : 'pages'
  ) as keyof typeof collectionLabels

  const router = useRouter()

  // Live preview integration
  const { state, startSession, endSession, setError, setLoading, refresh } = useLivePreview()

  // Extract document ID from URL segments
  const documentId = segments?.[1] || null

  // Enable debug panel in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
          e.preventDefault()
          setShowDebugPanel((prev) => !prev)
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const onAuthChange = useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id))
    setCurrentUser(user as ExtendedPayloadMeUser)
  }, [])

  // Enhanced error handling with recovery options
  const handleError = useCallback(
    (error: string, context?: Record<string, any>) => {
      const enhancedError = context ? `${error} (Context: ${JSON.stringify(context)})` : error

      setError(enhancedError)

      // Log error for debugging
      if (process.env.NODE_ENV === 'development') {
        console.error('[AdminBar] Error:', error, context)
      }
    },
    [setError],
  )

  // Retry mechanism with exponential backoff
  const handleRetry = useCallback(async (operation: () => Promise<void>, maxRetries = 3) => {
    let attempt = 0

    while (attempt < maxRetries) {
      try {
        setLoadingProgress(((attempt + 1) / maxRetries) * 100)
        await operation()
        setLoadingProgress(undefined)
        return
      } catch (error) {
        attempt++
        const delay = Math.pow(2, attempt) * 1000 // Exponential backoff

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay))
        } else {
          setLoadingProgress(undefined)
          throw error
        }
      }
    }
  }, [])

  // Fetch document data to get the actual slug
  const fetchDocumentSlug = useCallback(
    async (collectionSlug: string, docId: string): Promise<string | null> => {
      try {
        // Use the PayloadCMS REST API endpoint
        const response = await fetch(`${getClientSideURL()}/api/${collectionSlug}/${docId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.statusText}`)
        }
        const doc = await response.json()
        return doc.slug || null
      } catch (error) {
        console.error('Failed to fetch document slug:', error)
        return null
      }
    },
    [],
  )

  // Generate preview URL for current collection and document
  const generatePreviewUrl = useCallback(
    async (collectionSlug: string, docId: string): Promise<string> => {
      // Map collection names to their URL patterns
      const urlPatterns = {
        pages: (slug: string) => (slug === 'home' ? '/' : `/${slug}`),
        blogs: (slug: string) => `/blogs/${slug}`,
        services: (slug: string) => `/services/${slug}`,
        legal: (slug: string) => `/legal/${slug}`,
        contacts: (slug: string) => `/contacts/${slug}`,
        projects: (slug: string) => `/projects/${slug}`,
      }

      // Fetch the actual document to get its slug
      const slug = await fetchDocumentSlug(collectionSlug, docId)

      if (!slug) {
        // Fallback to using document ID if slug fetch fails
        return `/${collectionSlug}/${docId}`
      }

      const pattern = urlPatterns[collectionSlug as keyof typeof urlPatterns]
      if (typeof pattern === 'function') {
        return pattern(slug)
      }
      return `/${collectionSlug}/${slug}`
    },
    [fetchDocumentSlug],
  )

  // Enhanced preview toggle with comprehensive error handling
  const handlePreviewToggle = useCallback(async () => {
    if (!currentUser || !documentId) {
      handleError('Authentication required for preview mode', {
        hasUser: !!currentUser,
        hasDocumentId: !!documentId,
        collection,
      })
      return
    }

    const operation = async () => {
      if (state.isEnabled) {
        // Exit preview mode
        const response = await fetch('/api/preview/exit', { method: 'POST' })
        if (!response.ok) {
          throw new Error(`Failed to exit preview mode: ${response.statusText}`)
        }
        endSession()
        router.refresh()
      } else {
        // Enter preview mode
        const response = await fetch('/api/preview/enter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            collection: collectionSlugs[collection],
            id: documentId,
            token: currentUser.token || '', // This would need to be properly obtained
          }),
        })

        if (!response.ok) {
          throw new Error(`Preview API request failed: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to enter preview mode')
        }

        // Start live preview session
        startSession({
          id: `${collection}-${documentId}-${Date.now()}`,
          userId: currentUser.id,
          collection: collectionSlugs[collection],
          documentId,
          token: currentUser.token || '',
          expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
          createdAt: new Date(),
          lastAccessedAt: new Date(),
        })

        // Navigate to preview URL if provided, otherwise generate one
        if (data.previewUrl) {
          router.push(data.previewUrl)
        } else {
          // Generate preview URL using the document's actual slug
          const previewUrl = await generatePreviewUrl(collectionSlugs[collection], documentId)
          router.push(previewUrl)
        }
      }
    }

    try {
      setLoading(true)
      await handleRetry(operation)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      handleError(`Preview toggle failed: ${errorMessage}`, {
        collection,
        documentId,
        isEnabled: state.isEnabled,
        userAgent: navigator.userAgent,
      })
    } finally {
      setLoading(false)
      setLoadingProgress(undefined)
    }
  }, [
    currentUser,
    documentId,
    state.isEnabled,
    collection,
    startSession,
    endSession,
    handleError,
    setLoading,
    router,
    handleRetry,
    generatePreviewUrl,
  ])

  // Handle preview exit from the standard admin bar
  const handlePreviewExit = useCallback(async () => {
    try {
      const response = await fetch('/api/preview/exit', { method: 'POST' })
      if (!response.ok) {
        throw new Error(`Failed to exit preview: ${response.statusText}`)
      }
      endSession()
      router.push('/')
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to exit preview'
      handleError(errorMessage)
    }
  }, [endSession, router, handleError])

  // Handle error dismissal
  const handleErrorDismiss = useCallback(() => {
    setError(null)
  }, [setError])

  // Handle error retry
  const handleErrorRetry = useCallback(() => {
    setError(null)
    if (state.isEnabled) {
      refresh()
    } else {
      handlePreviewToggle()
    }
  }, [setError, state.isEnabled, refresh, handlePreviewToggle])

  return (
    <>
      <div
        className={cn(baseClass, 'py-2 bg-black text-white', {
          block: show,
          hidden: !show,
        })}
      >
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <PayloadAdminBar
                {...adminBarProps}
                className="py-2 text-white"
                classNames={{
                  controls: 'font-medium text-white',
                  logo: 'text-white',
                  user: 'text-white',
                }}
                cmsURL={getClientSideURL()}
                collectionSlug={collection}
                collectionLabels={{
                  plural: collectionLabels[collection]?.plural || 'Pages',
                  singular: collectionLabels[collection]?.singular || 'Page',
                }}
                logo={<Title />}
                onAuthChange={onAuthChange}
                onPreviewExit={handlePreviewExit}
                style={{
                  backgroundColor: 'transparent',
                  padding: 0,
                  position: 'relative',
                  zIndex: 'unset',
                }}
              />
            </div>

            {/* Live Preview Controls */}
            <div className="flex items-center space-x-4">
              <PreviewStatusIndicator
                isPreviewActive={state.isEnabled}
                lastUpdate={state.lastUpdate}
                error={state.error}
                isRealTimeConnected={state.isRealTimeConnected}
              />

              <LoadingIndicator
                isLoading={state.isLoading}
                message="Updating preview..."
                progress={loadingProgress}
                size="sm"
              />

              <LivePreviewButton
                documentId={documentId}
                isPreviewActive={state.isEnabled}
                onPreviewToggle={handlePreviewToggle}
                isLoading={state.isLoading}
              />
            </div>
          </div>

          {/* Error Display */}
          {state.error && (
            <div className="mt-3">
              <ErrorDisplay
                error={state.error}
                onDismiss={handleErrorDismiss}
                onRetry={handleErrorRetry}
                showDetails={process.env.NODE_ENV === 'development'}
              />
            </div>
          )}
        </div>
      </div>

      {/* Debug Panel (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <DebugPanel
          isVisible={showDebugPanel}
          onToggle={() => setShowDebugPanel(!showDebugPanel)}
        />
      )}
    </>
  )
}
