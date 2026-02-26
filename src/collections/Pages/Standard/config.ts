import type { Tab } from 'payload'
import { CallToAction } from '@/blocks/Standard/CallToAction/config'
import { Content } from '@/blocks/Standard/Content/config'
import { MediaBlock } from '@/blocks/Standard/MediaBlock/config'
import { Archive } from '@/blocks/Standard/ArchiveBlock/config'
import { FormBlock } from '@/blocks/Standard/Form/config'

import { ExpertiseContent } from '@/blocks/Service/Content/config'

export const standardConfig: Tab = {
  label: 'Content',
  admin: {
    condition: (data) => data?.pageType !== 'services' && data?.pageType !== 'legal',
  },
  fields: [
    {
      name: 'layout',
      type: 'blocks',
      blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock, ExpertiseContent],
      required: true,
      admin: {
        initCollapsed: true,
      },
    },
  ],
}
