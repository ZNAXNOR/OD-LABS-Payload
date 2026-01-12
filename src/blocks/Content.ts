import type { Block } from 'payload'
import { link } from '@/fields/link'

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'size',
          type: 'select',
          options: [
            {
              label: 'One Third',
              value: 'oneThird',
            },
            {
              label: 'Half',
              value: 'half',
            },
            {
              label: 'Two Thirds',
              value: 'twoThirds',
            },
            {
              label: 'Full',
              value: 'full',
            },
          ],
          defaultValue: 'full',
          required: true,
        },
        {
          name: 'richText',
          type: 'richText',
        },
        {
          name: 'enableLink',
          type: 'checkbox',
          label: 'Enable Link',
        },
        {
          ...link(),
          admin: {
            condition: (_, siblingData) => siblingData?.enableLink === true,
          },
        },
      ],
    },
  ],
}
