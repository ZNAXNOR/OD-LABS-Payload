import { StickyContentBlock as StickyContentBlockProps } from 'src/payload-types'

import React from 'react'

export const StickyContentBlock: React.FC<StickyContentBlockProps> = (props) => {
  return (
    <div className="container">
      <p>StickyContent Block</p>
    </div>
  )
}
