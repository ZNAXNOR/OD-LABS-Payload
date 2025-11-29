import React from 'react'
import { cn } from '@/utilities/ui'

export type GridContainerProps = {
  children?: React.ReactNode
  className?: string
  /**
   * The max-width of the container.
   * - narrow: max-w-grid-container (920px) - Default
   * - wide: standard tailwind container
   * - full: w-full
   */
  size?: 'narrow' | 'wide' | 'full'
  /**
   * Optional grid layout for the children.
   * If provided, children will be wrapped in a 10-column grid.
   */
  gridSize?: 'content' | 'emphasized' | 'full' | 'emphasized-left' | 'emphasized-right'
}

export const GridContainer: React.FC<GridContainerProps> = ({
  children,
  className,
  size = 'narrow',
  gridSize,
}) => {
  const sizeClasses = {
    narrow: 'max-w-grid-container mx-auto px-[calc(var(--baseline-px)*2)]',
    wide: 'container mx-auto',
    full: 'w-full',
  }

  const gridSpanClasses = {
    content: 'col-start-4 col-span-4', // Blocks 3-6
    emphasized: 'col-start-3 col-span-6', // Blocks 2-7
    full: 'col-span-10', // Blocks 0-9
    'emphasized-left': 'col-start-1 col-span-8', // Blocks 0-7
    'emphasized-right': 'col-start-3 col-span-8', // Blocks 2-9
  }

  const content = gridSize ? (
    <div className="grid grid-cols-10 gap-4">
      <div className={gridSpanClasses[gridSize]}>{children}</div>
    </div>
  ) : (
    children
  )

  return <div className={cn(sizeClasses[size], className)}>{content}</div>
}
