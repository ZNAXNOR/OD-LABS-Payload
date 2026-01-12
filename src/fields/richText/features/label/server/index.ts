import { createServerFeature } from '@payloadcms/richtext-lexical'
import { LabelNode } from '../LabelNode'

export const LabelFeature = createServerFeature({
  feature: {
    ClientFeature: '../client#LabelFeatureClient',
    nodes: [
      {
        node: LabelNode,
      },
    ],
  },
  key: 'label',
})