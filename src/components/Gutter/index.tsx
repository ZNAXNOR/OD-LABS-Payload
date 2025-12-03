import React from 'react'
import { cn } from '@/utilities/ui'

export type GutterProps = {
  children?: React.ReactNode
  className?: string
  /**
   * Apply left padding/gutter
   * @default false
   */
  left?: boolean
  /**
   * Apply right padding/gutter
   * @default false
   */
  right?: boolean
  /**
   * Gutter size variant
   * - sm: Small gutter (1rem / 16px)
   * - md: Medium gutter (2rem / 32px)
   * - lg: Large gutter (3rem / 48px)
   * - xl: Extra large gutter (4rem / 64px)
   * - xxl: Extra extra large gutter (6rem / 96px)
   * @default 'xxl'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
}

export const Gutter: React.FC<GutterProps> = ({
  children,
  className,
  left = false,
  right = false,
  size = 'xxl',
}) => {
  // Define responsive gutter sizes - hidden on mobile/tablet, visible on large screens (l+)
  const gutterClasses = {
    left: {
      sm: 'pl-0 l:pl-16',
      md: 'pl-0 l:pl-20',
      lg: 'pl-0 l:pl-24',
      xl: 'pl-0 l:pl-28',
      xxl: 'pl-0 l:pl-28 xl:pl-32 xxl:pl-36',
    },
    right: {
      sm: 'pr-0 l:pr-20',
      md: 'pr-0 l:pr-24',
      lg: 'pr-0 l:pr-28',
      xl: 'pr-0 l:pr-32',
      xxl: 'pr-0 l:pr-32 xl:pr-36 xxl:pr-40',
    },
  }

  return (
    <div
      className={cn(
        left && gutterClasses.left[size],
        right && gutterClasses.right[size],
        className,
      )}
    >
      {children}
    </div>
  )
}

export default Gutter
