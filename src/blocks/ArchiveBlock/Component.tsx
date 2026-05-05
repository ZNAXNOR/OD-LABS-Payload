import type { ArchiveBlock as ArchiveBlockProps } from '@/payload-types'
import React from 'react'

import { DefaultArchiveBlock } from './Default/Component'
import { ServicesGridArchiveBlock } from './ServicesGrid/Component'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { variant } = props

  if (variant === 'servicesGrid') {
    return <ServicesGridArchiveBlock {...props} />
  }

  return <DefaultArchiveBlock {...props} />
}
