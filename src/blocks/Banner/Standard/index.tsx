import React from 'react'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import { WarningBlock } from './WarningBlock'

type Props = {
  className?: string
} & BannerBlockProps

export const StandardBanner: React.FC<Props> = (props) => {
  const {
    className,
    content,
    style,
    title,
    description,
    items
  } = props

  if (style === 'warning') {
    return (
      <div className={cn('mx-auto my-8 w-full', className)}>
        <WarningBlock
          title={title}
          description={description}
          warningItems={items}
        />
      </div>
    )
  }

  return (
    <div className={cn('mx-auto my-8 w-full', className)}>
      <div
        className={cn('border py-3 px-6 mx-auto flex items-center rounded', {
          'border-border bg-card': style === 'info',
          'border-error bg-error/30': style === 'error',
          'border-success bg-success/30': style === 'success',
        })}
      >
        {content && <RichText data={content} enableGutter={false} enableProse={true} />}
      </div>
    </div>
  )
}
