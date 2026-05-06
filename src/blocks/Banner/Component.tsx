import React from 'react'
import type { BannerBlock as BannerBlockProps } from 'src/payload-types'
import { StandardBanner } from './Standard'
import { IconVariant } from './IconVariant'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = (props) => {
  const { blockVariant = 'standard' } = props

  if (blockVariant === 'iconBlock') {
    return <IconVariant {...props} />
  }

  return <StandardBanner {...props} />
}
