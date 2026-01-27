import deepMerge from '@/utilities/deepMerge'
import type { Field, GroupField } from 'payload'

type SocialMediaLinksType = (options?: {
  overrides?: Partial<GroupField>
  maxLinks?: number
  enableToggle?: boolean
  label?: string
  description?: string
}) => Field

export const socialMediaLinks: SocialMediaLinksType = ({
  overrides = {},
  maxLinks = 10,
  enableToggle = true,
  label = 'Social Media',
  description = 'Select social media links to display',
} = {}) => {
  const fields: Field[] = []

  // Add enable toggle if requested
  if (enableToggle) {
    fields.push({
      name: 'enabled',
      type: 'checkbox',
      label: 'Show Social Media Links',
      defaultValue: true,
    })
  }

  // Add the relationship field for selecting social media links
  fields.push({
    name: 'links',
    type: 'relationship',
    relationTo: 'social-media',
    hasMany: true,
    maxRows: maxLinks,
    admin: {
      condition: enableToggle ? (_, siblingData) => siblingData.enabled : undefined,
      description: 'Select social media links from the global social media collection',
    },
    filterOptions: {
      isActive: { equals: true }, // Only show active social media links
    },
  })

  const socialMediaResult: GroupField = {
    name: 'socialMedia',
    type: 'group',
    label,
    admin: {
      description,
    },
    fields,
  }

  return deepMerge(socialMediaResult, overrides)
}

// Simplified version without the group wrapper for direct use
export const socialMediaLinksArray: SocialMediaLinksType = ({
  overrides = {},
  maxLinks = 10,
  label = 'Social Media Links',
  description = 'Select social media links to display',
} = {}) => {
  const relationshipField: Field = {
    name: 'socialMediaLinks',
    type: 'relationship',
    relationTo: 'social-media',
    hasMany: true,
    maxRows: maxLinks,
    label,
    admin: {
      description,
    },
    filterOptions: {
      isActive: { equals: true }, // Only show active social media links
    },
  }

  return deepMerge(relationshipField, overrides as any)
}

// Export for use in blocks and other contexts
export const socialMediaField = socialMediaLinks()
export const socialMediaArrayField = socialMediaLinksArray()
