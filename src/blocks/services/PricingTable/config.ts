import type { Block } from 'payload'
import { link } from '@/fields/link'

export const PricingTableBlock: Block = {
  slug: 'pricingTable',
  interfaceName: 'PricingTableBlock',
  labels: {
    singular: 'Pricing Table Block',
    plural: 'Pricing Table Blocks',
  },
  admin: {
    group: 'Services',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading for the pricing section',
        placeholder: 'Pricing Plans',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description text',
        placeholder: 'Choose the plan that fits your needs',
      },
    },
    {
      name: 'billingPeriod',
      type: 'select',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
        { label: 'Both', value: 'both' },
      ],
      defaultValue: 'monthly',
      required: true,
      admin: {
        description: 'Billing period options to display',
      },
    },
    {
      name: 'tiers',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      labels: {
        singular: 'Pricing Tier',
        plural: 'Pricing Tiers',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Tier name',
            placeholder: 'Professional',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Optional tier description',
            placeholder: 'Perfect for growing businesses',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: {
            description: 'Price amount',
            placeholder: '99',
          },
        },
        {
          name: 'currency',
          type: 'text',
          defaultValue: 'USD',
          required: true,
          admin: {
            description: 'Currency code',
            placeholder: 'USD',
          },
        },
        {
          name: 'period',
          type: 'select',
          options: [
            { label: 'Per Month', value: 'month' },
            { label: 'Per Year', value: 'year' },
            { label: 'Per Project', value: 'project' },
            { label: 'Per Hour', value: 'hour' },
          ],
          defaultValue: 'month',
          required: true,
          admin: {
            description: 'Billing period',
          },
        },
        {
          name: 'features',
          type: 'array',
          minRows: 1,
          maxRows: 20,
          labels: {
            singular: 'Feature',
            plural: 'Features',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Unlimited projects',
              },
            },
            {
              name: 'included',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Is this feature included?',
              },
            },
            {
              name: 'tooltip',
              type: 'text',
              admin: {
                description: 'Optional tooltip text for more info',
                placeholder: 'Additional details about this feature',
              },
            },
          ],
          admin: {
            description: 'List of features for this tier',
          },
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Highlight this tier (e.g., "Most Popular")',
          },
        },
        {
          name: 'badge',
          type: 'text',
          admin: {
            description: 'Optional badge text',
            placeholder: 'Most Popular',
            condition: (data, siblingData) => siblingData?.highlighted === true,
          },
        },
        {
          name: 'ctaText',
          type: 'text',
          required: true,
          defaultValue: 'Get Started',
          admin: {
            description: 'Call-to-action button text',
            placeholder: 'Get Started',
          },
        },
        {
          name: 'ctaLink',
          type: 'group',
          fields: [link({ disableLabel: true })].flat(),
          admin: {
            description: 'Link for the call-to-action button',
          },
        },
      ],
      admin: {
        description: 'Add pricing tiers (max 4 recommended)',
      },
    },
    {
      name: 'showComparison',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show detailed feature comparison table',
      },
    },
  ],
}
