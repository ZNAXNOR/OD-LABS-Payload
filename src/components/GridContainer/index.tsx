import React from 'react'
import { cn } from '@/utilities/ui'

export type GridContainerProps = {
  children?: React.ReactNode
  className?: string
}

export const GridContainer: React.FC<GridContainerProps> = ({ children, className }) => {
  return (
    <div className={cn('max-w-grid-container mx-auto px-[calc(var(--baseline-px)*2)]', className)}>
      {children}
    </div>
  )
}
