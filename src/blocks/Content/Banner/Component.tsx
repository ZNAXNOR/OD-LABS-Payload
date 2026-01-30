// Define local type since BannerBlock is not in payload-types
interface BannerBlockProps {
  id?: string | null
  blockName?: string | null
  blockType: 'banner'
  content?: any
  style?: 'info' | 'error' | 'success' | 'warning'
  // Add other banner-specific properties as needed
}

import RichText from '@/components/ui/RichText'
import { cn } from '@/utilities/ui'
import React from 'react'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn('mx-auto my-8 w-full', className)}>
      <div
        className={cn('border py-3 px-6 flex items-center rounded', {
          'border-border bg-card': style === 'info',
          'border-error bg-error/30': style === 'error',
          'border-success bg-success/30': style === 'success',
          'border-warning bg-warning/30': style === 'warning',
        })}
      >
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}
