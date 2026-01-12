import { createServerFeature } from '@payloadcms/richtext-lexical'
import { LargeBodyNode } from '../LargeBodyNode'

export const LargeBodyFeature = createServerFeature({
  feature: {
    ClientFeature: '../client#LargeBodyFeatureClient',
    nodes: [
      {
        node: LargeBodyNode,
      },
    ],
  },
  key: 'largeBody',
})