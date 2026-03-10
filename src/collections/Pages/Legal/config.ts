import type { Field, Tab } from 'payload'
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

import { DynamicValueFeature } from '@od-labs/payloadcms-dynamic-value-richtext'

export const legalMetaFields: Field[] = [
  {
    name: 'companyInfo',
    type: 'group',
    label: 'Company Information',
    admin: {
      condition: (data) => data?.pageType === 'legal',
    },
    fields: [
      {
        name: 'companyName',
        type: 'text',
        label: 'Company Name',
      },
      {
        name: 'companyAddress',
        type: 'textarea',
        label: 'Company Address',
      },
      {
        name: 'companyCountry',
        type: 'text',
        label: 'Company Country',
      },
      {
        name: 'websiteUrl',
        type: 'text',
        label: 'Website URL',
      },
      {
        name: 'contactEmail',
        type: 'email',
        label: 'Contact Email',
      },
      {
        name: 'contactPage',
        type: 'text',
        label: 'Contact Page',
      },
      {
        name: 'contactNumber',
        type: 'text',
        label: 'Contact Number',
      },
    ],
  },
]

export const legalContentTab: Tab = {
  label: 'Content',
  admin: {
    condition: (data) => data?.pageType === 'legal',
  },
  fields: [
    {
      name: 'legalHero',
      type: 'group',
      label: 'Hero',
      fields: [
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          admin: {
            description: 'A short description shown below the page title in the hero.',
          },
        },
        {
          name: 'lastUpdated',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'MMMM d, yyyy',
            },
          },
        },
      ],
    },
    // Rich text content
    {
      name: 'legalContent',
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
            DynamicValueFeature({ fields: legalMetaFields }),
          ]
        },
      }),
      label: false,
      required: false,
    },
  ],
}
