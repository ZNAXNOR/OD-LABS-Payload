import React from 'react'
import type { SpacerBlock as SpacerBlockType } from '@/payload-types'
import { cn } from '@/utilities/ui'

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
