'use client'

import React, { useState, useRef, useCallback } from 'react'
import { cn } from '@/utilities/ui'
import type { Media as MediaType } from '@/payload-types'

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface ImageEditingOptions {
  crop?: {
    x: number
    y: number
    width: number
    height: number
  }
  resize?: {
    width: number
    height: number
    maintainAspectRatio: boolean
  }
  filters?: {
    brightness: number
    contrast: number
    saturation: number
    blur: number
    sepia: number
    grayscale: number
  }
  rotation?: number
}

export interface MediaEditorProps {
  media: MediaType
  onSave: (editedMedia: MediaType, options: ImageEditingOptions) => void
  onCancel: () => void
  className?: string
}

export interface CropAreaProps {
  x: number
  y: number
  width: number
  height: number
  imageWidth: number
  imageHeight: number
  onCropChange: (crop: { x: number; y: number; width: number; height: number }) => void
}

export interface FilterControlsProps {
  filters: ImageEditingOptions['filters']
  onFiltersChange: (filters: ImageEditingOptions['filters']) => void
}

// ============================================================================
// CROP AREA COMPONENT
// ============================================================================

const CropArea: React.FC<CropAreaProps> = ({
  x,
  y,
  width,
  height,
  imageWidth,
  imageHeight,
  onCropChange,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const cropRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - x,
        y: e.clientY - y,
      })
    },
    [x, y],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const newX = Math.max(0, Math.min(e.clientX - dragStart.x, imageWidth - width))
      const newY = Math.max(0, Math.min(e.clientY - dragStart.y, imageHeight - height))

      onCropChange({ x: newX, y: newY, width, height })
    },
    [isDragging, dragStart, imageWidth, imageHeight, width, height, onCropChange],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
    return undefined
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={cropRef}
      className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 cursor-move"
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Resize handles */}
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 cursor-nw-resize" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 cursor-ne-resize" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 cursor-sw-resize" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 cursor-se-resize" />
    </div>
  )
}

// ============================================================================
// FILTER CONTROLS COMPONENT
// ============================================================================

const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (
    filterName: keyof NonNullable<ImageEditingOptions['filters']>,
    value: number,
  ) => {
    onFiltersChange({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      sepia: 0,
      grayscale: 0,
      ...filters,
      [filterName]: value,
    })
  }

  const filterControls = [
    { name: 'brightness' as const, label: 'Brightness', min: 0, max: 200, step: 1 },
    { name: 'contrast' as const, label: 'Contrast', min: 0, max: 200, step: 1 },
    { name: 'saturation' as const, label: 'Saturation', min: 0, max: 200, step: 1 },
    { name: 'blur' as const, label: 'Blur', min: 0, max: 10, step: 0.1 },
    { name: 'sepia' as const, label: 'Sepia', min: 0, max: 100, step: 1 },
    { name: 'grayscale' as const, label: 'Grayscale', min: 0, max: 100, step: 1 },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Filters</h3>
      {filterControls.map(({ name, label, min, max, step }) => (
        <div key={name} className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">{label}</label>
            <span className="text-sm text-gray-500">{filters?.[name] || 100}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={
              filters?.[name] ||
              (name === 'brightness' || name === 'contrast' || name === 'saturation' ? 100 : 0)
            }
            onChange={(e) => handleFilterChange(name, parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      ))}
      <button
        onClick={() =>
          onFiltersChange({
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0,
            sepia: 0,
            grayscale: 0,
          })
        }
        className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
      >
        Reset Filters
      </button>
    </div>
  )
}

// ============================================================================
// MAIN MEDIA EDITOR COMPONENT
// ============================================================================

export const MediaEditor: React.FC<MediaEditorProps> = ({ media, onSave, onCancel, className }) => {
  const [editingOptions, setEditingOptions] = useState<ImageEditingOptions>({
    crop: { x: 0, y: 0, width: 200, height: 200 },
    resize: { width: media.width || 800, height: media.height || 600, maintainAspectRatio: true },
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      sepia: 0,
      grayscale: 0,
    },
    rotation: 0,
  })

  const [activeTab, setActiveTab] = useState<'crop' | 'resize' | 'filters' | 'rotate'>('crop')
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({})
  const imageRef = useRef<HTMLImageElement>(null)

  // Update preview style based on current editing options
  React.useEffect(() => {
    const { filters, rotation } = editingOptions
    if (!filters) return undefined

    const filterString = [
      `brightness(${filters.brightness}%)`,
      `contrast(${filters.contrast}%)`,
      `saturate(${filters.saturation}%)`,
      `blur(${filters.blur}px)`,
      `sepia(${filters.sepia}%)`,
      `grayscale(${filters.grayscale}%)`,
    ].join(' ')

    setPreviewStyle({
      filter: filterString,
      transform: `rotate(${rotation}deg)`,
    })

    return undefined
  }, [editingOptions])

  const handleSave = () => {
    onSave(media, editingOptions)
  }

  const handleRotate = (degrees: number) => {
    setEditingOptions((prev) => ({
      ...prev,
      rotation: (prev.rotation || 0) + degrees,
    }))
  }

  const handleResizeChange = (dimension: 'width' | 'height', value: number) => {
    setEditingOptions((prev) => {
      const newResize = {
        width: media.width || 800,
        height: media.height || 600,
        maintainAspectRatio: true,
        ...prev.resize,
      }

      if (newResize.maintainAspectRatio && media.width && media.height) {
        const aspectRatio = media.width / media.height
        if (dimension === 'width') {
          newResize.width = value
          newResize.height = Math.round(value / aspectRatio)
        } else {
          newResize.height = value
          newResize.width = Math.round(value * aspectRatio)
        }
      } else {
        newResize[dimension] = value
      }

      return { ...prev, resize: newResize }
    })
  }

  const tabs = [
    { id: 'crop' as const, label: 'Crop', icon: '✂️' },
    { id: 'resize' as const, label: 'Resize', icon: '📏' },
    { id: 'filters' as const, label: 'Filters', icon: '🎨' },
    { id: 'rotate' as const, label: 'Rotate', icon: '🔄' },
  ]

  if (!media.url) {
    return <div className="p-4 text-center text-gray-500">No image to edit</div>
  }

  return (
    <div className={cn('bg-white rounded-lg shadow-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Image</h2>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 p-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100',
                )}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'crop' && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Crop Image</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Crop Area</label>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <label className="text-xs text-gray-500">X</label>
                        <input
                          type="number"
                          value={editingOptions.crop?.x || 0}
                          onChange={(e) =>
                            setEditingOptions((prev) => ({
                              ...prev,
                              crop: { ...prev.crop!, x: parseInt(e.target.value) },
                            }))
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Y</label>
                        <input
                          type="number"
                          value={editingOptions.crop?.y || 0}
                          onChange={(e) =>
                            setEditingOptions((prev) => ({
                              ...prev,
                              crop: { ...prev.crop!, y: parseInt(e.target.value) },
                            }))
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Width</label>
                        <input
                          type="number"
                          value={editingOptions.crop?.width || 200}
                          onChange={(e) =>
                            setEditingOptions((prev) => ({
                              ...prev,
                              crop: { ...prev.crop!, width: parseInt(e.target.value) },
                            }))
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Height</label>
                        <input
                          type="number"
                          value={editingOptions.crop?.height || 200}
                          onChange={(e) =>
                            setEditingOptions((prev) => ({
                              ...prev,
                              crop: { ...prev.crop!, height: parseInt(e.target.value) },
                            }))
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resize' && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Resize Image</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="maintainAspectRatio"
                      checked={editingOptions.resize?.maintainAspectRatio || false}
                      onChange={(e) =>
                        setEditingOptions((prev) => ({
                          ...prev,
                          resize: { ...prev.resize!, maintainAspectRatio: e.target.checked },
                        }))
                      }
                      className="rounded"
                    />
                    <label htmlFor="maintainAspectRatio" className="text-sm">
                      Maintain aspect ratio
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Width</label>
                      <input
                        type="number"
                        value={editingOptions.resize?.width || 800}
                        onChange={(e) => handleResizeChange('width', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Height</label>
                      <input
                        type="number"
                        value={editingOptions.resize?.height || 600}
                        onChange={(e) => handleResizeChange('height', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'filters' && (
              <FilterControls
                filters={editingOptions.filters}
                onFiltersChange={(filters) => setEditingOptions((prev) => ({ ...prev, filters }))}
              />
            )}

            {activeTab === 'rotate' && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Rotate Image</h3>
                <div className="space-y-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleRotate(-90)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      ↺ 90° Left
                    </button>
                    <button
                      onClick={() => handleRotate(90)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      ↻ 90° Right
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Custom Rotation</label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={editingOptions.rotation || 0}
                      onChange={(e) =>
                        setEditingOptions((prev) => ({
                          ...prev,
                          rotation: parseInt(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-500 mt-1">
                      {editingOptions.rotation || 0}°
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 p-4 bg-gray-50">
          <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative inline-block">
              <img
                ref={imageRef}
                src={media.url}
                alt={media.alt || 'Image to edit'}
                style={previewStyle}
                className="max-w-full max-h-96 object-contain"
              />

              {/* Crop overlay */}
              {activeTab === 'crop' && editingOptions.crop && imageRef.current && (
                <CropArea
                  x={editingOptions.crop.x}
                  y={editingOptions.crop.y}
                  width={editingOptions.crop.width}
                  height={editingOptions.crop.height}
                  imageWidth={imageRef.current.naturalWidth}
                  imageHeight={imageRef.current.naturalHeight}
                  onCropChange={(crop) => setEditingOptions((prev) => ({ ...prev, crop }))}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

/**
 * Simple image editor button for triggering the editor
 */
export const ImageEditButton: React.FC<{
  media: MediaType
  onEdit: (media: MediaType, options: ImageEditingOptions) => void
  className?: string
}> = ({ media, onEdit, className }) => {
  const [showEditor, setShowEditor] = useState(false)

  const handleSave = (editedMedia: MediaType, options: ImageEditingOptions) => {
    onEdit(editedMedia, options)
    setShowEditor(false)
  }

  return (
    <>
      <button
        onClick={() => setShowEditor(true)}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors',
          className,
        )}
      >
        <span>✏️</span>
        Edit Image
      </button>

      {showEditor && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-full overflow-auto">
            <MediaEditor media={media} onSave={handleSave} onCancel={() => setShowEditor(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export default MediaEditor
