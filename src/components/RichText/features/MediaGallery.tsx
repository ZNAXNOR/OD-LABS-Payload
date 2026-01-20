'use client'

import React, { useState, useCallback } from 'react'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface MediaGalleryProps {
  media: MediaType[]
  className?: string
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  gap?: 'none' | 'small' | 'medium' | 'large'
  aspectRatio?: 'square' | '16-9' | '4-3' | 'original'
  enableLightbox?: boolean
  enableCaption?: boolean
  onMediaClick?: (media: MediaType, index: number) => void
}

export interface MediaGalleryInsertProps {
  onInsert: (galleryConfig: MediaGalleryConfig) => void
  onCancel: () => void
  availableMedia?: MediaType[]
}

export interface MediaGalleryConfig {
  selectedMedia: MediaType[]
  columns: {
    mobile: number
    tablet: number
    desktop: number
  }
  gap: 'none' | 'small' | 'medium' | 'large'
  aspectRatio: 'square' | '16-9' | '4-3' | 'original'
  enableLightbox: boolean
  enableCaption: boolean
}

// ============================================================================
// MEDIA GALLERY COMPONENT
// ============================================================================

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  media,
  className,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'medium',
  aspectRatio = 'square',
  enableLightbox = true,
  enableCaption = true,
  onMediaClick,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const gapClasses = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  }

  const aspectRatioClasses = {
    square: 'aspect-square',
    '16-9': 'aspect-video',
    '4-3': 'aspect-[4/3]',
    original: '',
  }

  const gridClasses = cn(
    'grid',
    `grid-cols-${columns.mobile}`,
    `md:grid-cols-${columns.tablet}`,
    `lg:grid-cols-${columns.desktop}`,
    gapClasses[gap],
    className,
  )

  const handleMediaClick = useCallback(
    (mediaItem: MediaType, index: number) => {
      if (onMediaClick) {
        onMediaClick(mediaItem, index)
      } else if (enableLightbox) {
        setLightboxIndex(index)
      }
    },
    [onMediaClick, enableLightbox],
  )

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const navigateLightbox = useCallback(
    (direction: 'prev' | 'next') => {
      if (lightboxIndex === null) return

      if (direction === 'prev') {
        setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : media.length - 1)
      } else {
        setLightboxIndex(lightboxIndex < media.length - 1 ? lightboxIndex + 1 : 0)
      }
    },
    [lightboxIndex, media.length],
  )

  if (!media || media.length === 0) {
    return <div className="text-center text-gray-500 py-8">No media items to display</div>
  }

  return (
    <>
      <div className={gridClasses}>
        {media.map((mediaItem, index) => (
          <div
            key={mediaItem.id || index}
            className={cn(
              'relative overflow-hidden rounded-lg bg-gray-100',
              aspectRatioClasses[aspectRatio],
              {
                'cursor-pointer hover:opacity-90 transition-opacity':
                  enableLightbox || onMediaClick,
              },
            )}
            onClick={() => handleMediaClick(mediaItem, index)}
          >
            <Media
              resource={mediaItem}
              className="w-full h-full object-cover"
              imgClassName="w-full h-full object-cover"
            />

            {enableCaption && mediaItem.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                <div className="text-sm line-clamp-2">
                  {typeof mediaItem.caption === 'string' ? mediaItem.caption : 'Caption available'}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {enableLightbox && lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 text-2xl"
            >
              ✕
            </button>

            <Media
              resource={media[lightboxIndex]}
              className="max-w-full max-h-full object-contain"
            />

            {media.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-3xl"
                >
                  ‹
                </button>
                <button
                  onClick={() => navigateLightbox('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-3xl"
                >
                  ›
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {lightboxIndex + 1} of {media.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ============================================================================
// MEDIA GALLERY INSERT COMPONENT
// ============================================================================

export const MediaGalleryInsert: React.FC<MediaGalleryInsertProps> = ({
  onInsert,
  onCancel,
  availableMedia = [],
}) => {
  const [config, setConfig] = useState<MediaGalleryConfig>({
    selectedMedia: [],
    columns: { mobile: 1, tablet: 2, desktop: 3 },
    gap: 'medium',
    aspectRatio: 'square',
    enableLightbox: true,
    enableCaption: true,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState<'select' | 'settings'>('select')

  const filteredMedia = availableMedia.filter(
    (media) =>
      media.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      media.filename?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleMediaSelection = (media: MediaType) => {
    setConfig((prev) => ({
      ...prev,
      selectedMedia: prev.selectedMedia.some((item) => item.id === media.id)
        ? prev.selectedMedia.filter((item) => item.id !== media.id)
        : [...prev.selectedMedia, media],
    }))
  }

  const handleInsert = () => {
    if (config.selectedMedia.length > 0) {
      onInsert(config)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Insert Media Gallery</h2>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={config.selectedMedia.length === 0}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Insert Gallery ({config.selectedMedia.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setSelectedTab('select')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            selectedTab === 'select'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          )}
        >
          Select Media
        </button>
        <button
          onClick={() => setSelectedTab('settings')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            selectedTab === 'settings'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          )}
        >
          Gallery Settings
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {selectedTab === 'select' && (
          <div className="p-4">
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredMedia.map((media) => {
                const isSelected = config.selectedMedia.some((item) => item.id === media.id)
                return (
                  <div
                    key={media.id}
                    className={cn(
                      'relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all',
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300',
                    )}
                    onClick={() => toggleMediaSelection(media)}
                  >
                    <Media resource={media} className="w-full h-full object-cover" />

                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                        ✓
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1">
                      <div className="text-xs truncate">
                        {media.alt || media.filename || 'Untitled'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredMedia.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                {searchTerm ? 'No media found matching your search' : 'No media available'}
              </div>
            )}
          </div>
        )}

        {selectedTab === 'settings' && (
          <div className="p-4 space-y-6">
            {/* Columns */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Columns</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mobile</label>
                  <select
                    value={config.columns.mobile}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        columns: { ...prev.columns, mobile: parseInt(e.target.value) },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} Column{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tablet</label>
                  <select
                    value={config.columns.tablet}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        columns: { ...prev.columns, tablet: parseInt(e.target.value) },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} Column{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Desktop</label>
                  <select
                    value={config.columns.desktop}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        columns: { ...prev.columns, desktop: parseInt(e.target.value) },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} Column{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Gap */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Spacing</h3>
              <select
                value={config.gap}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    gap: e.target.value as MediaGalleryConfig['gap'],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="none">No Gap</option>
                <option value="small">Small Gap</option>
                <option value="medium">Medium Gap</option>
                <option value="large">Large Gap</option>
              </select>
            </div>

            {/* Aspect Ratio */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Aspect Ratio</h3>
              <select
                value={config.aspectRatio}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    aspectRatio: e.target.value as MediaGalleryConfig['aspectRatio'],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="square">Square (1:1)</option>
                <option value="16-9">Widescreen (16:9)</option>
                <option value="4-3">Standard (4:3)</option>
                <option value="original">Original</option>
              </select>
            </div>

            {/* Options */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Options</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.enableLightbox}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        enableLightbox: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Enable lightbox</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.enableCaption}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        enableCaption: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Show captions</span>
                </label>
              </div>
            </div>

            {/* Preview */}
            {config.selectedMedia.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <MediaGallery
                    media={config.selectedMedia.slice(0, 6)} // Show max 6 for preview
                    columns={config.columns}
                    gap={config.gap}
                    aspectRatio={config.aspectRatio}
                    enableLightbox={false} // Disable lightbox in preview
                    enableCaption={config.enableCaption}
                  />
                  {config.selectedMedia.length > 6 && (
                    <div className="text-center text-sm text-gray-500 mt-2">
                      ... and {config.selectedMedia.length - 6} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// GALLERY INSERT BUTTON
// ============================================================================

export const MediaGalleryInsertButton: React.FC<{
  onInsert: (galleryConfig: MediaGalleryConfig) => void
  availableMedia?: MediaType[]
  className?: string
}> = ({ onInsert, availableMedia, className }) => {
  const [showInsert, setShowInsert] = useState(false)

  const handleInsert = (config: MediaGalleryConfig) => {
    onInsert(config)
    setShowInsert(false)
  }

  return (
    <>
      <button
        onClick={() => setShowInsert(true)}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors',
          className,
        )}
      >
        <span>🖼️</span>
        Insert Gallery
      </button>

      {showInsert && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <MediaGalleryInsert
            onInsert={handleInsert}
            onCancel={() => setShowInsert(false)}
            availableMedia={availableMedia}
          />
        </div>
      )}
    </>
  )
}

export default MediaGallery
