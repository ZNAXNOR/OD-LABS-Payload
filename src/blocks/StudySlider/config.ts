import type { Block } from 'payload'
import { backgroundColor, Type as BackgroundColorType } from '@/fields/backgroundColor'
import type { Study } from '@/payload-types'

export type Type = {
  backgroundColor: BackgroundColorType
  studies: (Study | string)[]
}

export const StudySlider: Block = {
  slug: 'study-slider',
  interfaceName: 'StudySliderBlock',
  labels: {
    singular: 'Study Slider',
    plural: 'Study Sliders',
  },
  fields: [
    backgroundColor,
    {
      name: 'studies',
      type: 'relationship',
      relationTo: 'studies',
      hasMany: true,
      required: true,
    },
  ],
}
