import { link } from '@/fields/link'
import type { Block } from 'payload'

export const PricingTableBlock: Block = {
  slug: 'pricingTable',
  interfaceName: 'PricingTableBlock',
  dbName: 'pricing_table', // Root level optimization
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
      maxLength: 120,
      admin: {
        description: 'Optional heading for the pricing section',
        placeholder: 'Pricing Plans',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Optional description text',
        placeholder: 'Choose the plan that fits your needs',
      },
    },
    {
      name: 'billingPeriod',
      type: 'select',
      defaultValue: 'monthly',
      dbName: 'billing_period', // Snake case conversion
      options: [
        {
          label: 'Monthly',
          value: 'monthly',
        },
        {
          label: 'Yearly',
          value: 'yearly',
        },
        {
          label: 'Both',
          value: 'both',
        },
      ],
      required: true,
      admin: {
        description: 'Billing period options to display',
      },
    },
    {
      name: 'tiers',
      type: 'array',
      dbName: 'tiers', // Keep short names as-is
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
          maxLength: 50,
          validate: (value: any) => {
            if (!value || value.trim().length === 0) {
              return 'Pricing tier name is required'
            }
            return true
          },
          admin: {
            description: 'Tier name',
            placeholder: 'Professional',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 150,
          admin: {
            description: 'Optional tier description',
            placeholder: 'Perfect for growing businesses',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          validate: (value: any) => {
            if (value === null || value === undefined) {
              return 'Price is required'
            }
            if (value < 0) {
              return 'Price cannot be negative'
            }
            return true
          },
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
          maxLength: 10,
          validate: (value: any) => {
            if (!value || value.trim().length === 0) {
              return 'Currency is required'
            }
            // Basic validation for currency codes (3 letters)
            if (!/^[A-Z]{3}$/.test(value.trim().toUpperCase())) {
              return 'Currency should be a 3-letter code (e.g., USD, EUR, GBP)'
            }
            return true
          },
          admin: {
            description: 'Currency code',
            placeholder: 'USD',
          },
        },
        {
          name: 'period',
          type: 'select',
          defaultValue: 'month',
          options: [
            {
              label: 'Per Month',
              value: 'month',
            },
            {
              label: 'Per Year',
              value: 'year',
            },
            {
              label: 'Per Project',
              value: 'project',
            },
            {
              label: 'Per Hour',
              value: 'hour',
            },
          ],
          required: true,
          admin: {
            description: 'Billing period',
          },
        },
        {
          name: 'features',
          type: 'array',
          dbName: 'features', // Keep short names as-is
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
              maxLength: 100,
              validate: (value: any) => {
                if (!value || value.trim().length === 0) {
                  return 'Feature text is required'
                }
                return true
              },
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
              maxLength: 200,
              admin: {
                description: 'Optional tooltip text for more info',
                placeholder: 'Additional details about this feature',
              },
            },
          ],
          admin: {
            description: 'List of features for this tier',
            components: {
              RowLabel: '@/blocks/services/PricingTable/RowLabel#FeatureRowLabel',
            },
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
          maxLength: 30,
          admin: {
            description: 'Optional badge text',
            placeholder: 'Most Popular',
            condition: (_data, siblingData) => siblingData?.highlighted === true,
          },
        },
        {
          name: 'ctaText',
          type: 'text',
          required: true,
          defaultValue: 'Get Started',
          maxLength: 30,
          validate: (value: any) => {
            if (!value || value.trim().length === 0) {
              return 'Call-to-action text is required'
            }
            return true
          },
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
        components: {
          RowLabel: '@/blocks/services/PricingTable/RowLabel#TierRowLabel',
        },
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
