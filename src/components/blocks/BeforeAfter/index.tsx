'use client'

import React, { useState, useRef, useEffect } from 'react'
import type { BeforeAfterBlock as BeforeAfterBlockType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import Image from 'next/image'

interface BeforeAfterBlockProps {
  block: BeforeAfterBlockType
  className?: string
}

export const BeforeAfterBlock: React.FC<BeforeAfterBlockProps> = ({ block, className }) => {
  const {
    heading,
    description,
    beforeImage,
    afterImage,
    beforeLabel = 'Before',
    afterLabel = 'After',
    orientation = 'horizontal',
    defaultPosition = 50,
  } = block

  const [sliderPosition, setSliderPosition] = useState(defaultPosition)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const getImageUrl = (image: any) => {
    if (!image) return ''
    if (typeof image === 'string') return image
    return image.url || ''
  }

  const beforeImageUrl = getImageUrl(beforeImage)
  const afterImageUrl = getImageUrl(afterImage)

  const handleMove = (clientX: number, clientY: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()

    if (orientation === 'horizontal') {
      const x = clientX - rect.left
      const percentage = (x / rect.width) * 100
      setSliderPosition(Math.max(0, Math.min(100, percentage)))
    } else {
      const y = clientY - rect.top
      const percentage = (y / rect.height) * 100
      setSliderPosition(Math.max(0, Math.min(100, percentage)))
    }
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX, e.clientY)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    const touch = e.touches[0]
    if (touch) {
      handleMove(touch.clientX, touch.clientY)
    }
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging])

  return (
    <section className={cn('py-16 px-4', className)}>
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        {(heading || description) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Comparison Container */}
        <div
          ref={containerRef}
          className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl cursor-col-resize select-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {/* After Image (Background) */}
          {afterImageUrl && (
            <div className="absolute inset-0">
              <Image
                src={afterImageUrl}
                alt={afterLabel || 'After image'}
                fill
                className="object-cover"
                priority
              />
              {/* After Label */}
              <div className="absolute top-4 right-4 bg-brand-primary text-white px-4 py-2 rounded-lg font-medium shadow-lg">
                {afterLabel}
              </div>
            </div>
          )}

          {/* Before Image (Foreground with clip) */}
          {beforeImageUrl && (
            <div
              className="absolute inset-0"
              style={{
                clipPath:
                  orientation === 'horizontal'
                    ? `inset(0 ${100 - sliderPosition}% 0 0)`
                    : `inset(0 0 ${100 - sliderPosition}% 0)`,
              }}
            >
              <Image
                src={beforeImageUrl}
                alt={beforeLabel || 'Before image'}
                fill
                className="object-cover"
                priority
              />
              {/* Before Label */}
              <div className="absolute top-4 left-4 bg-zinc-900 dark:bg-zinc-800 text-white px-4 py-2 rounded-lg font-medium shadow-lg">
                {beforeLabel}
              </div>
            </div>
          )}

          {/* Slider Handle */}
          <div
            className={cn(
              'absolute z-10',
              orientation === 'horizontal'
                ? 'top-0 bottom-0 w-1 bg-white shadow-lg'
                : 'left-0 right-0 h-1 bg-white shadow-lg',
            )}
            style={
              orientation === 'horizontal'
                ? { left: `${sliderPosition}%`, transform: 'translateX(-50%)' }
                : { top: `${sliderPosition}%`, transform: 'translateY(-50%)' }
            }
          >
            {/* Handle Circle */}
            <div
              className={cn(
                'absolute bg-white rounded-full shadow-xl flex items-center justify-center',
                orientation === 'horizontal'
                  ? 'w-12 h-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                  : 'w-12 h-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              )}
            >
              {orientation === 'horizontal' ? (
                <svg
                  className="w-6 h-6 text-brand-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-brand-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {orientation === 'horizontal'
              ? 'Drag the slider left or right to compare'
              : 'Drag the slider up or down to compare'}
          </p>
        </div>
      </div>
    </section>
  )
}

export default BeforeAfterBlock
