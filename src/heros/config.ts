import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'variant',
      type: 'radio',
      defaultValue: 'default',
      admin: {
        condition: (_, { type } = {}) => type === 'mediumImpact',
      },
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Side Panel',
          value: 'sidePanel',
        },
      ],
    },
    {
      name: 'richText',
      type: 'richText',
      admin: {
        condition: (_, { type } = {}) => type !== 'none',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        admin: {
          condition: (_, { type } = {}) => type !== 'none',
        },
        maxRows: 2,
      },
    }),
    {
      name: 'availability',
      type: 'group',
      admin: {
        condition: (_, { type, variant } = {}) => type === 'mediumImpact' && variant === 'sidePanel',
      },
      fields: [
        {
          name: 'projectLimit',
          type: 'number',
          label: 'Project Limit',
          admin: {
            description: 'Will be displayed as "Limited to [number] active projects"',
          },
        },
        {
          name: 'status',
          type: 'radio',
          defaultValue: 'now',
          options: [
            {
              label: 'Available Now',
              value: 'now',
            },
            {
              label: 'Available Later',
              value: 'later',
            },
          ],
        },

        {
          name: 'availableDate',
          type: 'date',
          admin: {
            condition: (_, siblingData) => siblingData?.status === 'later',
            date: {
              displayFormat: 'MMMM yyyy',
              pickerAppearance: 'monthOnly',
            },
          },
        },
      ],
    },
    {
      name: 'activeWork',
      type: 'group',
      admin: {
        condition: (_, { type, variant } = {}) => type === 'mediumImpact' && variant === 'sidePanel',
      },
      fields: [
        {
          name: 'includeProject',
          type: 'checkbox',
          defaultValue: true,
          label: 'Include Project Details',
        },
        {
          name: 'projects',
          type: 'array',
          admin: {
            condition: (_, siblingData) => siblingData?.includeProject,
          },
          validate: (value, { data }) => {
            const limit = (data as any)?.hero?.availability?.projectLimit || 10
            if (value && value.length > limit) {
              return `You can only add up to ${limit} projects as per the project limit.`
            }
            return true
          },
          fields: [
            {
              name: 'name',
              type: 'text',
            },
            {
              name: 'progress',
              type: 'number',
            },
            {
              name: 'description',
              type: 'text',
            },
            {
              name: 'status',
              type: 'select',
              options: [
                {
                  label: 'MVP Phase',
                  value: 'MVP Phase',
                },
                {
                  label: 'Development Phase',
                  value: 'Development Phase',
                },
                {
                  label: 'Production Phase',
                  value: 'Production Phase',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
