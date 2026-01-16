'use client'

import React from 'react'
import { cn } from '@/utilities/ui'

interface SpacerBlockType {
  blockType: 'spacer'
  height?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | null
  heightMobile?: number | null
  heightTablet?: number | null
  heightDesktop?: number | null
}

interface SpacerBlockProps {
  block: SpacerBlockType
  className?: string
}

export const SpacerBlock: React.FC<SpacerBlockProps> = ({ block, className }) => {
  const { heightMobile = 2, heightTablet = 4, heightDesktop = 6 } = block

  return (
    <div
      className={cn('w-full', className)}
      style={{
        height: `${heightMobile}rem`,
      }}
      data-mobile-height={heightMobile}
      data-tablet-height={heightTablet}
      data-desktop-height={heightDesktop}
    >
      <style jsx>{`
        @media (min-width: 768px) {
          div {
            height: ${heightTablet}rem;
          }
        }
        @media (min-width: 1024px) {
          div {
            height: ${heightDesktop}rem;
          }
        }
      `}</style>
    </div>
  )
}

export default SpacerBlock
