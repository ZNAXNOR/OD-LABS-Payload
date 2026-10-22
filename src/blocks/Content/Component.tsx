import React from 'react'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { Default_ContentBlock } from './Default/Component'
import { Capabilities_ContentBlock } from './Capability/Component'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  switch (props.layout) {
    case 'capabilities':
      return <Capabilities_ContentBlock {...props} />

    case 'default':
    default:
      return <Default_ContentBlock {...props} />
  }
}
