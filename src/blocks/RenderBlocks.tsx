import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { MetricsStripComponent } from '@/blocks/MetricsStrip/Component'
import { ProcessBlockComponent } from '@/blocks/ProcessBlock/Component'
import { ComparisonBlockComponent } from '@/blocks/Comparison/Component'
import { TypographyBlockComponent } from '@/blocks/TypographyBlock/Component'
import { PricingBlockComponent } from '@/blocks/PricingBlock/Component'
import { AccordionBlock } from '@/blocks/Accordion/Component'
import { FeatureBlock } from '@/blocks/FeatureBlock/Component'



const blockComponents = {
  archive: ArchiveBlock,
  banner: BannerBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  metricsStrip: MetricsStripComponent,
  process: ProcessBlockComponent,
  comparison: ComparisonBlockComponent,
  typography: TypographyBlockComponent,
  pricing: PricingBlockComponent,
  accordion: AccordionBlock,
  featureBlock: FeatureBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
