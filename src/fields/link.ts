import type { Field, GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'

export type LinkAppearances = 'default' | 'secondary' | 'outline' | 'link' | 'destructive' | 'ghost'

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  default: {
    label: 'Default',
    value: 'default',
  },
  secondary: {
    label: 'Secondary',
    value: 'secondary',
  },
  outline: {
    label: 'Outline',
    value: 'outline',
  },
  link: {
    label: 'Link',
    value: 'link',
  },
  destructive: {
    label: 'Destructive',
    value: 'destructive',
  },
  ghost: {
    label: 'Ghost',
    value: 'ghost',
  },
}

// Rel attribute options for external links
export const relOptions = [
  {
    label: 'No Follow',
    value: 'nofollow',
  },
  {
    label: 'No Opener',
    value: 'noopener',
  },
  {
    label: 'No Referrer',
    value: 'noreferrer',
  },
  {
    label: 'Sponsored',
    value: 'sponsored',
  },
  {
    label: 'UGC (User Generated Content)',
    value: 'ugc',
  },
]

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  enableAdvancedOptions?: boolean
  overrides?: Partial<GroupField>
}) => Field

export const link: LinkType = ({
  appearances,
  disableLabel = false,
  enableAdvancedOptions = false,
  overrides = {},
} = {}) => {
  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            dbName: 'link_type', // Prefixed to avoid enum conflicts when used in multiple contexts
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      relationTo: ['pages', 'blogs', 'services', 'legal', 'contacts'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
      validate: (value: any) => {
        if (!value) return true // Required validation handles empty values

        try {
          new URL(value)
          return true
        } catch {
          // Check if it's a relative URL
          if (value.startsWith('/') || value.startsWith('#')) {
            return true
          }
          return 'Please enter a valid URL (e.g., https://example.com or /page)'
        }
      },
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  // Add advanced options for external links
  if (enableAdvancedOptions) {
    linkResult.fields.push({
      type: 'collapsible',
      label: 'Advanced Link Options',
      admin: {
        initCollapsed: true,
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'rel',
              type: 'select',
              dbName: 'link_rel', // Prefixed standard HTML attribute name
              hasMany: true,
              admin: {
                width: '50%',
                description: 'Relationship attributes for the link',
              },
              label: 'Link Attributes',
              options: relOptions,
            },
            {
              name: 'title',
              type: 'text',
              admin: {
                width: '50%',
                description: 'Tooltip text that appears on hover',
              },
              label: 'Title (Tooltip)',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'download',
              type: 'checkbox',
              admin: {
                width: '50%',
                description: 'Prompt user to download the linked resource',
              },
              label: 'Download Link',
            },
            {
              name: 'hreflang',
              type: 'text',
              admin: {
                width: '50%',
                description: 'Language of the linked resource (e.g., en, es, fr)',
              },
              label: 'Language Code',
              validate: (value: any) => {
                if (!value) return true
                // Basic language code validation (ISO 639-1)
                if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(value)) {
                  return 'Please enter a valid language code (e.g., en, es, fr-FR)'
                }
                return true
              },
            },
          ],
        },
      ],
    })
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [
      appearanceOptions.default,
      appearanceOptions.secondary,
      appearanceOptions.outline,
    ]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      dbName: 'link_appearance', // Prefixed to avoid conflicts when used in multiple contexts
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}

// Enhanced link field with advanced options enabled
export const enhancedLink: LinkType = (options = {}) => {
  return link({
    ...options,
    enableAdvancedOptions: true,
  })
}

// Export as linkField for use in blocks (matching design specification)
export const linkField = link()

// Enhanced link field for rich text and advanced use cases
export const enhancedLinkField = enhancedLink()
