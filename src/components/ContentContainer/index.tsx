import React from 'react'
import { cn } from '@/utilities/ui'

export type ContentContainerProps = {
  children?: React.ReactNode
  className?: string
  width?: 'content' | 'emphasized' | 'full'
}

/**
 * ContentContainer component for the 10-column grid system
 *
 * Grid blocks: 0  1  2  3  4  5  6  7  8  9
 *
 * - content (default): blocks 3-6 (4 columns)
 * - emphasized: blocks 2-7 (6 columns)
 * - full: blocks 0-9 (10 columns)
 */
export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  className,
  width = 'content',
}) => {
  const gridClasses = {
    content: 'col-start-4 col-span-4', // blocks 3-6
    emphasized: 'col-start-3 col-span-6', // blocks 2-7
    full: 'col-span-10', // blocks 0-9
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-10 gap-4">
        <div className={cn(gridClasses[width], className)}>{children}</div>
      </div>
    </div>
  )
}
