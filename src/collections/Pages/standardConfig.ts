import type { Tab } from 'payload'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { FormBlock } from '../../blocks/Form/config'

export const standardConfig: Tab = {
  label: 'Content',
  admin: {
    condition: (data) => data?.pageType !== 'services',
  },
  fields: [
    {
      name: 'layout',
      type: 'blocks',
      blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock],
      required: true,
      admin: {
        initCollapsed: true,
      },
    },
  ],
}
