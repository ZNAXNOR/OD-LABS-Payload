import type { Field } from 'payload'

export const introductionFields: Field[] = [
  {
    name: 'introductionEyebrow',
    type: 'text',
    label: 'Eyebrow',
    hasMany: true,
    minRows: 1,
    defaultValue: ['Introduction', 'Based in India', 'Working globally'],
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'introduction',
      description:
        'Short phrases displayed in the hero eyebrow. First phrase unique & introductory.',
    },
  },
  {
    name: 'introductionHeader',
    type: 'text',
    label: 'Introduction Header',
    defaultValue: 'Hello, I\'m Omkar.',
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'introduction',
    },
  },
  {
    name: 'introductionPhrases',
    type: 'text',
    label: 'Rotating Phrases',
    hasMany: true,
    minRows: 1,
    defaultValue: ['Websites', 'AI Systems', 'Cloud Solutions'],
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'introduction',
    },
  },
  {
    name: 'introductionDescription',
    type: 'textarea',
    label: 'Introduction Description',
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'introduction',
    },
  },
  {
    name: 'introductionLocation',
    type: 'text',
    label: 'Location',
    defaultValue: 'Vashi, Navi Mumbai, Maharashtra, India',
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'introduction',
      description: 'Displayed beside the location icon below the hero.',
    },
  },
  {
    name: 'introductionPortrait',
    type: 'upload',
    relationTo: 'media',
    label: 'Introduction Portrait',
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'introduction',
    },
  },
  {
    name: 'introductionAICTA',
    type: 'group',
    label: 'AI Interface CTA',
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'introduction',
    },
    fields: [
      {
        name: 'label',
        type: 'text',
        label: 'Title',
        defaultValue: 'Explore my AI interface',
        required: true,
      },
      {
        name: 'description',
        type: 'text',
        label: 'Description',
        defaultValue: 'Ask about my work, capabilities, and approach.',
      },
      {
        name: 'link',
        type: 'group',
        fields: [
          {
            name: 'url',
            type: 'text',
            label: 'Destination URL',
            defaultValue: '/ai',
            required: true,
          },
          {
            name: 'newTab',
            type: 'checkbox',
            label: 'Open in new tab',
            defaultValue: false,
          },
        ],
      },
    ],
  },
]
