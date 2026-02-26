import type { Tab } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  UnorderedListFeature,
  OrderedListFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Banner } from '@/blocks/Standard/Banner/config'
import { Code } from '@/blocks/Standard/Code/config'
import { MediaBlock } from '@/blocks/Standard/MediaBlock/config'

export const serviceContentTab: Tab = {
  label: 'Content',
  admin: {
    condition: (data) => data?.pageType === 'services',
  },
  fields: [
    {
      name: 'serviceContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
            BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
            UnorderedListFeature(),
            OrderedListFeature(),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      label: false,
      required: false,
    },
  ],
}

export const serviceMetaFields = [
  {
    name: 'expertise',
    type: 'group',
    label: 'Our Expertise',
    admin: {
      condition: (data: any) => data?.pageType === 'services',
    },
    fields: [
      {
        name: 'variant',
        type: 'radio',
        label: 'Expertise Variant',
        defaultValue: 'inline',
        options: [
          {
            label: 'Inline Variant',
            value: 'inline',
          },
          {
            label: 'Side Variant',
            value: 'sideVarient',
          },
        ],
        admin: {
          layout: 'horizontal',
        },
      },
      {
        name: 'size',
        type: 'radio',
        label: 'Size',
        defaultValue: 'small',
        options: [
          {
            label: 'Small',
            value: 'small',
          },
          {
            label: 'Large',
            value: 'large',
          },
        ],
        admin: {
          condition: (_: any, siblingData: any) => siblingData?.variant === 'inline',
          layout: 'horizontal',
        },
      },
      {
        name: 'title',
        type: 'text',
        label: 'Section Title',
        defaultValue: 'Our Expertise',
        admin: {
          condition: (data: any, siblingData: any) =>
            siblingData?.variant !== 'inline' && data?.servicesHero?.type !== 'highImpact',
        },
      },
      {
        name: 'items',
        type: 'array',
        label: 'Expertise Items',
        fields: [
          {
            name: 'icon',
            type: 'upload',
            relationTo: 'media',
          },
          {
            name: 'stat',
            type: 'text',
            label: 'Stat',
            admin: {
              condition: (data: any) =>
                data?.servicesHero?.type === 'highImpact' && data?.expertise?.variant === 'inline',
            },
          },
          {
            name: 'title',
            type: 'text',
            required: true,
          },
          {
            name: 'description',
            type: 'text',
          },
        ],
      },
    ],
  },
  {
    name: 'relatedServices',
    type: 'group',
    label: 'Related Services',
    admin: {
      condition: (data: any) => data?.pageType === 'services',
    },
    fields: [
      {
        name: 'variant',
        type: 'radio',
        label: 'Variant',
        defaultValue: 'inline',
        options: [
          {
            label: 'Inline',
            value: 'inline',
          },
          {
            label: 'Side',
            value: 'side',
          },
        ],
        admin: {
          layout: 'horizontal',
        },
      },
      {
        name: 'title',
        type: 'text',
        defaultValue: 'Related Services',
      },
      {
        name: 'subTitle',
        type: 'text',
        defaultValue: 'Explore our other design and development offerings',
        admin: {
          condition: (_: any, siblingData: any) => siblingData?.variant === 'inline',
        },
      },
      {
        name: 'services',
        type: 'relationship',
        relationTo: 'pages',
        filterOptions: ({ id }: any) => {
          return {
            id: {
              not_equals: id,
            },
            pageType: {
              equals: 'services',
            },
          }
        },
        hasMany: true,
        label: 'Selected Services',
      },
    ],
  },
]
