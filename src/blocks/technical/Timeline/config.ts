import type { Block } from 'payload'

export const TimelineBlock: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  labels: {
    singular: 'Timeline Block',
    plural: 'Timeline Blocks',
  },
  admin: {
    group: 'Technical',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading for the timeline section',
        placeholder: 'Our Journey',
      },
    },
    {
      name: 'orientation',
      type: 'select',
      defaultValue: 'vertical',
      required: true,
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' },
      ],
      admin: {
        description: 'Timeline orientation',
      },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'default',
      required: true,
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Detailed', value: 'detailed' },
      ],
      admin: {
        description: 'Visual style of the timeline',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 2,
      fields: [
        {
          name: 'date',
          type: 'text',
          required: true,
          admin: {
            description: 'Date or time period',
            placeholder: 'January 2024',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'Milestone Title',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            placeholder: 'Description of this milestone',
          },
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Optional Lucide icon name',
            placeholder: 'Rocket',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional image for this timeline item',
          },
        },
        {
          name: 'link',
          type: 'group',
          fields: [
            {
              name: 'url',
              type: 'text',
              admin: {
                placeholder: '/blog/milestone-post',
              },
            },
            {
              name: 'label',
              type: 'text',
              admin: {
                placeholder: 'Read more',
              },
            },
          ],
          admin: {
            description: 'Optional link for this timeline item',
          },
        },
      ],
      labels: {
        singular: 'Timeline Item',
        plural: 'Timeline Items',
      },
    },
  ],
}
