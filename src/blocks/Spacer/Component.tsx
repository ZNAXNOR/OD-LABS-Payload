import { SpacerBlock as SpacerBlockProps } from 'src/payload-types'

import React from 'react'

export const SpacerBlock: React.FC<SpacerBlockProps> = (props) => {
  return (
    <div className="container">
      <p>Spacer Block</p>
    </div>
  )
}
