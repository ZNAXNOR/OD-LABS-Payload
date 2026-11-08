import React from 'react'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { Default_ContentBlock } from './Varients/Default/Component'
import { Capabilities_ContentBlock } from './Varients/Capability/Component'
import { Testimonial_ContentBlock } from './Varients/Testimonial/Component'

type Props = ContentBlockProps & {
  blockIndex?: number
}

export const ContentBlock: React.FC<Props> = (props) => {
  switch (props.layout) {
    case 'capabilities':
      return <Capabilities_ContentBlock {...props} />

    case 'testimonial':
      return <Testimonial_ContentBlock {...props} />

    case 'default':
    default:
      return <Default_ContentBlock {...props} />
  }
}
