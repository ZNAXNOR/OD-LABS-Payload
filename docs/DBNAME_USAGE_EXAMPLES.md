# dbName Usage Examples

This document provides comprehensive examples of proper `dbName` usage patterns across different Payload CMS configuration types.

## Table of Contents

1. [Global Configurations](#global-configurations)
2. [Block Configurations](#block-configurations)
3. [Collection Configurations](#collection-configurations)
4. [Field Factory Functions](#field-factory-functions)
5. [Complex Nested Structures](#complex-nested-structures)
6. [Real-World Scenarios](#real-world-scenarios)

## Global Configurations

### Header Global - Navigation Structure

```typescript
export const Header: GlobalConfig = {
  slug: 'header',
  dbName: 'header', // Root level explicit naming
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      dbName: 'logo', // Simple field, explicit for consistency
    },
    {
      name: 'navigationTabs',
      type: 'array',
      dbName: 'nav_tabs', // Abbreviate 'navigation', use snake_case
      maxRows: 6,
      fields: [
        {
          name: 'tabLabel',
          type: 'text',
          dbName: 'label', // Simplify in context
          required: true,
        },
        {
          name: 'dropdownContent',
          type: 'group',
          dbName: 'dropdown', // Keep semantic meaning
          fields: [
            {
              name: 'featuredSection',
              type: 'group',
              dbName: 'feat_section', // Abbreviate 'featured'
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  dbName: 'title', // Short field, keep as-is
                },
                {
                  name: 'description',
                  type: 'textarea',
                  dbName: 'desc', // Standard abbreviation
                },
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  dbName: 'bg_img', // Abbreviate both parts
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'navigationItems',
              type: 'array',
              dbName: 'nav_items', // Consistent with nav_tabs pattern
              maxRows: 8,
              fields: [
                {
                  name: 'itemType',
                  type: 'radio',
                  dbName: 'type', // Simplify in array context
                  options: ['link', 'section'],
                },
                {
                  name: 'linkConfiguration',
                  type: 'group',
                  dbName: 'link_config', // Abbreviate 'configuration'
                  admin: {
                    condition: (data, siblingData) => siblingData?.itemType === 'link',
                  },
                  fields: [
                    linkField(), // Uses its own dbName internally
                  ],
                },
                {
                  name: 'sectionContent',
                  type: 'group',
                  dbName: 'section', // Simplify in context
                  admin: {
                    condition: (data, siblingData) => siblingData?.itemType === 'section',
                  },
                  fields: [
                    {
                      name: 'sectionTitle',
                      type: 'text',
                      dbName: 'title', // Remove redundant 'section'
                    },
                    {
                      name: 'quickLinks',
                      type: 'array',
                      dbName: 'quick_links', // Descriptive but concise
                      maxRows: 5,
                      fields: [linkField()],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'utilityNavigation',
      type: 'group',
      dbName: 'utility_nav', // Distinguish from main navigation
      fields: [
        {
          name: 'searchEnabled',
          type: 'checkbox',
          dbName: 'search_enabled', // Descriptive boolean
        },
        {
          name: 'userAccountLinks',
          type: 'array',
          dbName: 'user_links', // Simplify in context
          maxRows: 3,
          fields: [linkField()],
        },
      ],
    },
  ],
}

// Rationale Comments:
// - nav_tabs: Standard abbreviation for navigation, prevents long identifiers
// - feat_section: Featured is commonly abbreviated as 'feat' in this project
// - bg_img: Both background and image abbreviated for brevity
// - link_config: Configuration abbreviated to 'config' following project standards
// - utility_nav: Distinguishes from main nav while keeping identifier short
```

### Footer Global - Complex Link Structure

```typescript
export const Footer: GlobalConfig = {
  slug: 'footer',
  dbName: 'footer', // Explicit root naming
  fields: [
    {
      name: 'companyInformation',
      type: 'group',
      dbName: 'company_info', // Standard abbreviation for information
      fields: [
        {
          name: 'companyName',
          type: 'text',
          dbName: 'name', // Simplify in company context
        },
        {
          name: 'companyDescription',
          type: 'textarea',
          dbName: 'desc', // Standard abbreviation
        },
        {
          name: 'contactInformation',
          type: 'group',
          dbName: 'contact', // Simplify nested information
          fields: [
            {
              name: 'phoneNumber',
              type: 'text',
              dbName: 'phone', // Clear abbreviation
            },
            {
              name: 'emailAddress',
              type: 'email',
              dbName: 'email', // Keep standard terms
            },
            {
              name: 'physicalAddress',
              type: 'textarea',
              dbName: 'address', // Remove redundant 'physical'
            },
          ],
        },
      ],
    },
    {
      name: 'linkSections',
      type: 'array',
      dbName: 'link_sections', // Descriptive array name
      maxRows: 4,
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          dbName: 'title', // Simplify in section context
        },
        {
          name: 'sectionLinks',
          type: 'array',
          dbName: 'links', // Remove redundant 'section'
          maxRows: 8,
          fields: [linkField()],
        },
      ],
    },
    {
      name: 'socialMediaLinks',
      type: 'array',
      dbName: 'social_links', // Clear abbreviation
      maxRows: 6,
      fields: [
        {
          name: 'platform',
          type: 'select',
          dbName: 'platform', // Keep clear terms
          options: ['facebook', 'twitter', 'linkedin', 'instagram'],
        },
        {
          name: 'profileUrl',
          type: 'url',
          dbName: 'url', // Simplify in context
        },
      ],
    },
    {
      name: 'legalInformation',
      type: 'group',
      dbName: 'legal_info', // Standard abbreviation pattern
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          dbName: 'copyright', // Remove redundant 'text'
        },
        {
          name: 'legalLinks',
          type: 'array',
          dbName: 'legal_links', // Descriptive but concise
          maxRows: 5,
          fields: [linkField()],
        },
      ],
    },
  ],
}

// Rationale Comments:
// - company_info: Information abbreviated to 'info' following project standards
// - contact: Nested information context allows simplification
// - social_links: Social media abbreviated while maintaining clarity
// - legal_info: Consistent with company_info pattern
```

## Block Configurations

### Hero Block - Media and Content

```typescript
export const HeroBlock: Block = {
  slug: 'hero',
  dbName: 'hero', // Simple root naming
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'heroVariant',
      type: 'select',
      dbName: 'variant', // Remove redundant 'hero'
      options: ['standard', 'minimal', 'video'],
      defaultValue: 'standard',
    },
    {
      name: 'contentConfiguration',
      type: 'group',
      dbName: 'content_config', // Abbreviate configuration
      fields: [
        {
          name: 'headline',
          type: 'text',
          dbName: 'headline', // Keep semantic meaning
          required: true,
        },
        {
          name: 'subheadline',
          type: 'text',
          dbName: 'subheadline', // Clear field purpose
        },
        {
          name: 'descriptionText',
          type: 'richText',
          dbName: 'desc_text', // Abbreviate description
        },
        {
          name: 'callToActionButtons',
          type: 'array',
          dbName: 'cta_buttons', // Standard CTA abbreviation
          maxRows: 2,
          fields: [
            {
              name: 'buttonText',
              type: 'text',
              dbName: 'text', // Simplify in button context
            },
            {
              name: 'buttonStyle',
              type: 'select',
              dbName: 'style', // Remove redundant 'button'
              options: ['primary', 'secondary', 'outline'],
            },
            {
              name: 'buttonLink',
              type: 'group',
              dbName: 'link', // Simplify in button context
              fields: [linkField()],
            },
          ],
        },
      ],
    },
    {
      name: 'mediaConfiguration',
      type: 'group',
      dbName: 'media_config', // Consistent with content_config
      fields: [
        {
          name: 'backgroundType',
          type: 'radio',
          dbName: 'bg_type', // Abbreviate background
          options: ['image', 'video', 'gradient'],
          defaultValue: 'image',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          dbName: 'bg_img', // Standard abbreviation
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.backgroundType === 'image',
          },
        },
        {
          name: 'backgroundVideo',
          type: 'upload',
          dbName: 'bg_video', // Consistent with bg_img
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.backgroundType === 'video',
          },
        },
        {
          name: 'overlayConfiguration',
          type: 'group',
          dbName: 'overlay_config', // Descriptive but concise
          fields: [
            {
              name: 'overlayEnabled',
              type: 'checkbox',
              dbName: 'enabled', // Simplify in overlay context
            },
            {
              name: 'overlayOpacity',
              type: 'number',
              dbName: 'opacity', // Remove redundant 'overlay'
              min: 0,
              max: 100,
            },
          ],
        },
      ],
    },
  ],
}

// Rationale Comments:
// - content_config/media_config: Configuration abbreviated consistently
// - cta_buttons: Call-to-action is commonly abbreviated as CTA
// - bg_type/bg_img/bg_video: Background abbreviated consistently across related fields
// - overlay_config: Maintains clarity while preventing long identifiers
```

### Services Grid Block - Complex Array Structure

```typescript
export const ServicesGridBlock: Block = {
  slug: 'servicesGrid',
  dbName: 'svc_grid', // Service abbreviated to 'svc'
  interfaceName: 'ServicesGridBlock',
  fields: [
    {
      name: 'gridConfiguration',
      type: 'group',
      dbName: 'grid_config', // Standard config abbreviation
      fields: [
        {
          name: 'columnsPerRow',
          type: 'select',
          dbName: 'columns', // Simplify in grid context
          options: ['2', '3', '4'],
          defaultValue: '3',
        },
        {
          name: 'showServiceIcons',
          type: 'checkbox',
          dbName: 'show_icons', // Descriptive boolean
        },
      ],
    },
    {
      name: 'services',
      type: 'array',
      dbName: 'services', // Keep semantic meaning
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'serviceTitle',
          type: 'text',
          dbName: 'title', // Remove redundant 'service'
          required: true,
        },
        {
          name: 'serviceDescription',
          type: 'textarea',
          dbName: 'desc', // Standard abbreviation
        },
        {
          name: 'serviceIcon',
          type: 'upload',
          dbName: 'icon', // Remove redundant 'service'
          relationTo: 'media',
        },
        {
          name: 'serviceFeatures',
          type: 'array',
          dbName: 'features', // Simplify in service context
          maxRows: 8,
          fields: [
            {
              name: 'featureText',
              type: 'text',
              dbName: 'text', // Remove redundant 'feature'
            },
            {
              name: 'featureIcon',
              type: 'upload',
              dbName: 'icon', // Consistent with service icon
              relationTo: 'media',
            },
          ],
        },
        {
          name: 'pricingInformation',
          type: 'group',
          dbName: 'pricing_info', // Standard info abbreviation
          fields: [
            {
              name: 'basePrice',
              type: 'number',
              dbName: 'base_price', // Descriptive pricing field
            },
            {
              name: 'pricingModel',
              type: 'select',
              dbName: 'model', // Remove redundant 'pricing'
              options: ['fixed', 'hourly', 'project'],
            },
            {
              name: 'customPricingNote',
              type: 'text',
              dbName: 'custom_note', // Descriptive but concise
            },
          ],
        },
      ],
    },
  ],
}

// Rationale Comments:
// - svc_grid: Services abbreviated to prevent long root identifiers
// - grid_config: Configuration abbreviated following project standards
// - pricing_info: Information abbreviated consistently with other patterns
// - features: Context allows removal of redundant 'service' prefix
```

## Collection Configurations

### User Collection - Profile and Preferences

```typescript
export const Users: CollectionConfig = {
  slug: 'users',
  dbName: 'users', // Explicit collection naming
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'personalInformation',
      type: 'group',
      dbName: 'personal_info', // Standard info abbreviation
      fields: [
        {
          name: 'firstName',
          type: 'text',
          dbName: 'first_name', // Snake case conversion
        },
        {
          name: 'lastName',
          type: 'text',
          dbName: 'last_name', // Consistent naming
        },
        {
          name: 'profilePicture',
          type: 'upload',
          dbName: 'profile_pic', // Picture abbreviated to 'pic'
          relationTo: 'media',
        },
        {
          name: 'contactInformation',
          type: 'group',
          dbName: 'contact', // Nested info simplified
          fields: [
            {
              name: 'phoneNumber',
              type: 'text',
              dbName: 'phone', // Standard abbreviation
            },
            {
              name: 'alternateEmail',
              type: 'email',
              dbName: 'alt_email', // Alternate abbreviated
            },
          ],
        },
      ],
    },
    {
      name: 'accountPreferences',
      type: 'group',
      dbName: 'account_prefs', // Preferences abbreviated to 'prefs'
      fields: [
        {
          name: 'notificationSettings',
          type: 'group',
          dbName: 'notifications', // Settings simplified in context
          fields: [
            {
              name: 'emailNotifications',
              type: 'checkbox',
              dbName: 'email_notify', // Descriptive boolean
            },
            {
              name: 'smsNotifications',
              type: 'checkbox',
              dbName: 'sms_notify', // Consistent with email_notify
            },
            {
              name: 'notificationFrequency',
              type: 'select',
              dbName: 'frequency', // Remove redundant 'notification'
              options: ['immediate', 'daily', 'weekly'],
            },
          ],
        },
        {
          name: 'privacySettings',
          type: 'group',
          dbName: 'privacy', // Settings simplified
          fields: [
            {
              name: 'profileVisibility',
              type: 'select',
              dbName: 'visibility', // Remove redundant 'profile'
              options: ['public', 'private', 'friends'],
            },
            {
              name: 'dataProcessingConsent',
              type: 'checkbox',
              dbName: 'data_consent', // Descriptive but concise
            },
          ],
        },
      ],
    },
    {
      name: 'organizationMemberships',
      type: 'array',
      dbName: 'org_memberships', // Organization abbreviated to 'org'
      fields: [
        {
          name: 'organization',
          type: 'relationship',
          dbName: 'org', // Consistent abbreviation
          relationTo: 'organizations',
        },
        {
          name: 'membershipRole',
          type: 'select',
          dbName: 'role', // Remove redundant 'membership'
          options: ['member', 'admin', 'owner'],
        },
        {
          name: 'membershipStatus',
          type: 'select',
          dbName: 'status', // Remove redundant 'membership'
          options: ['active', 'pending', 'suspended'],
        },
      ],
    },
  ],
}

// Rationale Comments:
// - personal_info: Information abbreviated following project standards
// - account_prefs: Preferences abbreviated to prevent long identifiers
// - org_memberships: Organization abbreviated consistently
// - profile_pic: Picture abbreviated while maintaining clarity
```

### Media Collection - Metadata and Processing

```typescript
export const Media: CollectionConfig = {
  slug: 'media',
  dbName: 'media', // Simple collection name
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
      },
    ],
  },
  fields: [
    {
      name: 'mediaMetadata',
      type: 'group',
      dbName: 'metadata', // Remove redundant 'media'
      fields: [
        {
          name: 'altText',
          type: 'text',
          dbName: 'alt_text', // Descriptive accessibility field
          required: true,
        },
        {
          name: 'caption',
          type: 'textarea',
          dbName: 'caption', // Keep semantic meaning
        },
        {
          name: 'photographerCredit',
          type: 'text',
          dbName: 'photographer', // Remove redundant 'credit'
        },
        {
          name: 'copyrightInformation',
          type: 'text',
          dbName: 'copyright_info', // Standard info abbreviation
        },
      ],
    },
    {
      name: 'technicalInformation',
      type: 'group',
      dbName: 'tech_info', // Technical abbreviated to 'tech'
      fields: [
        {
          name: 'originalDimensions',
          type: 'group',
          dbName: 'orig_dims', // Dimensions abbreviated to 'dims'
          fields: [
            {
              name: 'width',
              type: 'number',
              dbName: 'width', // Keep standard terms
            },
            {
              name: 'height',
              type: 'number',
              dbName: 'height', // Keep standard terms
            },
          ],
        },
        {
          name: 'fileInformation',
          type: 'group',
          dbName: 'file_info', // Standard info abbreviation
          fields: [
            {
              name: 'fileSize',
              type: 'number',
              dbName: 'size', // Remove redundant 'file'
            },
            {
              name: 'mimeType',
              type: 'text',
              dbName: 'mime_type', // Standard technical term
            },
            {
              name: 'compressionQuality',
              type: 'number',
              dbName: 'quality', // Remove redundant 'compression'
            },
          ],
        },
      ],
    },
    {
      name: 'usageTracking',
      type: 'group',
      dbName: 'usage_tracking', // Descriptive but concise
      fields: [
        {
          name: 'downloadCount',
          type: 'number',
          dbName: 'downloads', // Simplify count field
          defaultValue: 0,
        },
        {
          name: 'lastAccessedDate',
          type: 'date',
          dbName: 'last_accessed', // Descriptive date field
        },
        {
          name: 'usageRestrictions',
          type: 'select',
          dbName: 'restrictions', // Remove redundant 'usage'
          options: ['none', 'internal', 'licensed'],
        },
      ],
    },
  ],
}

// Rationale Comments:
// - tech_info: Technical abbreviated while maintaining clarity
// - orig_dims: Original dimensions abbreviated for brevity
// - file_info: Consistent with other info abbreviations
// - usage_tracking: Descriptive tracking functionality
```

## Field Factory Functions

### Link Field Factory - Comprehensive Example

```typescript
export interface LinkType {
  (options?: {
    appearances?: ('default' | 'outline')[]
    disableLabel?: boolean
    overrides?: Record<string, unknown>
  }): GroupField
}

export const link: LinkType = (options = {}) => {
  const { appearances, disableLabel = false, overrides = {} } = options

  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    dbName: 'link', // Explicit naming for predictability
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        name: 'type',
        type: 'radio',
        dbName: 'type', // Short field, keep as-is
        options: [
          {
            label: 'Internal Link',
            value: 'reference',
          },
          {
            label: 'Custom URL',
            value: 'custom',
          },
        ],
        defaultValue: 'reference',
        admin: {
          layout: 'horizontal',
        },
      },
      {
        name: 'newTab',
        type: 'checkbox',
        dbName: 'new_tab', // Descriptive boolean field
        admin: {
          style: {
            alignSelf: 'flex-end',
          },
        },
      },
      {
        name: 'reference',
        type: 'relationship',
        dbName: 'ref', // Standard abbreviation for reference
        relationTo: ['pages', 'posts'],
        required: true,
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'reference',
        },
      },
      {
        name: 'url',
        type: 'text',
        dbName: 'url', // Keep standard web terms
        label: 'Custom URL',
        required: true,
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'custom',
        },
      },
      {
        name: 'label',
        type: 'text',
        dbName: 'label', // Keep semantic meaning
        admin: {
          condition: (_, siblingData) => !disableLabel,
        },
      },
      {
        name: 'appearance',
        type: 'select',
        dbName: 'appearance', // Keep UI terminology
        defaultValue: 'default',
        options: appearances || ['default', 'outline'],
        admin: {
          condition: (_, siblingData) => Boolean(appearances),
        },
      },
    ],
  }

  return deepMerge(linkResult, overrides)
}

// Rationale Comments:
// - link: Explicit dbName ensures predictable identifier generation
// - ref: Standard abbreviation for reference relationships
// - new_tab: Descriptive boolean using snake_case
// - Other fields kept as-is due to short length and standard terminology
```

### Rich Text Field Factory

```typescript
export const richTextField = (options: {
  name: string
  label?: string
  required?: boolean
  features?: string[]
}) => {
  const { name, label, required = false, features = [] } = options

  return {
    name,
    type: 'richText' as const,
    dbName: name.includes('description') ? name.replace('description', 'desc') : name,
    label: label || name,
    required,
    editor: lexicalEditor({
      features: ({ defaultFeatures }) => [
        ...defaultFeatures,
        // Add custom features based on options
        ...(features.includes('heading') ? [HeadingFeature()] : []),
        ...(features.includes('link') ? [LinkFeature()] : []),
      ],
    }),
  }
}

// Usage examples:
const contentField = richTextField({
  name: 'content',
  required: true,
  features: ['heading', 'link'],
})

const descriptionField = richTextField({
  name: 'productDescription', // Automatically becomes 'product_desc'
  label: 'Product Description',
  features: ['link'],
})

// Rationale Comments:
// - Automatic abbreviation of 'description' to 'desc' in field names
// - Maintains flexibility while ensuring consistent naming
```

## Complex Nested Structures

### E-commerce Product Configuration

```typescript
export const ProductBlock: Block = {
  slug: 'product',
  dbName: 'product', // Simple root naming
  interfaceName: 'ProductBlock',
  fields: [
    {
      name: 'productInformation',
      type: 'group',
      dbName: 'product_info', // Standard info abbreviation
      fields: [
        {
          name: 'productName',
          type: 'text',
          dbName: 'name', // Remove redundant 'product'
          required: true,
        },
        {
          name: 'productDescription',
          type: 'richText',
          dbName: 'desc', // Standard abbreviation
        },
        {
          name: 'productCategories',
          type: 'relationship',
          dbName: 'categories', // Remove redundant 'product'
          relationTo: 'categories',
          hasMany: true,
        },
      ],
    },
    {
      name: 'pricingConfiguration',
      type: 'group',
      dbName: 'pricing_config', // Standard config abbreviation
      fields: [
        {
          name: 'basePrice',
          type: 'number',
          dbName: 'base_price', // Descriptive pricing field
          required: true,
        },
        {
          name: 'discountInformation',
          type: 'group',
          dbName: 'discount_info', // Standard info abbreviation
          fields: [
            {
              name: 'discountPercentage',
              type: 'number',
              dbName: 'percentage', // Remove redundant 'discount'
              min: 0,
              max: 100,
            },
            {
              name: 'discountStartDate',
              type: 'date',
              dbName: 'start_date', // Remove redundant 'discount'
            },
            {
              name: 'discountEndDate',
              type: 'date',
              dbName: 'end_date', // Consistent with start_date
            },
          ],
        },
        {
          name: 'pricingTiers',
          type: 'array',
          dbName: 'pricing_tiers', // Descriptive array name
          maxRows: 5,
          fields: [
            {
              name: 'tierName',
              type: 'text',
              dbName: 'name', // Remove redundant 'tier'
            },
            {
              name: 'minimumQuantity',
              type: 'number',
              dbName: 'min_qty', // Quantity abbreviated to 'qty'
            },
            {
              name: 'tierPrice',
              type: 'number',
              dbName: 'price', // Remove redundant 'tier'
            },
          ],
        },
      ],
    },
    {
      name: 'inventoryManagement',
      type: 'group',
      dbName: 'inventory_mgmt', // Management abbreviated to 'mgmt'
      fields: [
        {
          name: 'stockQuantity',
          type: 'number',
          dbName: 'stock_qty', // Quantity abbreviated consistently
          defaultValue: 0,
        },
        {
          name: 'lowStockThreshold',
          type: 'number',
          dbName: 'low_stock_threshold', // Descriptive threshold field
          defaultValue: 10,
        },
        {
          name: 'trackInventory',
          type: 'checkbox',
          dbName: 'track_inventory', // Descriptive boolean
          defaultValue: true,
        },
        {
          name: 'inventoryLocations',
          type: 'array',
          dbName: 'locations', // Remove redundant 'inventory'
          fields: [
            {
              name: 'locationName',
              type: 'text',
              dbName: 'name', // Remove redundant 'location'
            },
            {
              name: 'locationQuantity',
              type: 'number',
              dbName: 'qty', // Consistent quantity abbreviation
            },
          ],
        },
      ],
    },
    {
      name: 'productVariations',
      type: 'array',
      dbName: 'variations', // Remove redundant 'product'
      fields: [
        {
          name: 'variationName',
          type: 'text',
          dbName: 'name', // Remove redundant 'variation'
        },
        {
          name: 'variationAttributes',
          type: 'array',
          dbName: 'attributes', // Remove redundant 'variation'
          fields: [
            {
              name: 'attributeName',
              type: 'text',
              dbName: 'name', // Remove redundant 'attribute'
            },
            {
              name: 'attributeValue',
              type: 'text',
              dbName: 'value', // Remove redundant 'attribute'
            },
            {
              name: 'priceModifier',
              type: 'number',
              dbName: 'price_modifier', // Descriptive modifier field
              defaultValue: 0,
            },
          ],
        },
      ],
    },
  ],
}

// Rationale Comments:
// - inventory_mgmt: Management abbreviated to prevent long identifiers
// - pricing_config: Configuration abbreviated following project standards
// - min_qty/stock_qty: Quantity consistently abbreviated to 'qty'
// - variations/attributes: Context allows removal of redundant prefixes
```

## Real-World Scenarios

### Blog Post with Complex Content Structure

```typescript
export const BlogPost: CollectionConfig = {
  slug: 'posts',
  dbName: 'posts', // Simple collection name
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedDate', 'status'],
  },
  fields: [
    {
      name: 'postMetadata',
      type: 'group',
      dbName: 'post_meta', // Metadata abbreviated to 'meta'
      fields: [
        {
          name: 'title',
          type: 'text',
          dbName: 'title', // Keep semantic meaning
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          dbName: 'slug', // Keep standard web terms
          unique: true,
          index: true,
        },
        {
          name: 'excerpt',
          type: 'textarea',
          dbName: 'excerpt', // Keep semantic meaning
        },
        {
          name: 'publishedDate',
          type: 'date',
          dbName: 'published_date', // Descriptive date field
        },
        {
          name: 'featuredImage',
          type: 'upload',
          dbName: 'featured_img', // Standard abbreviations
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'contentStructure',
      type: 'group',
      dbName: 'content_structure', // Descriptive but concise
      fields: [
        {
          name: 'contentBlocks',
          type: 'blocks',
          dbName: 'content_blocks', // Descriptive blocks field
          blocks: [
            {
              slug: 'textContent',
              dbName: 'text_content', // Descriptive block name
              fields: [
                {
                  name: 'textContent',
                  type: 'richText',
                  dbName: 'content', // Simplify in text context
                },
              ],
            },
            {
              slug: 'imageGallery',
              dbName: 'img_gallery', // Image abbreviated to 'img'
              fields: [
                {
                  name: 'galleryImages',
                  type: 'array',
                  dbName: 'images', // Remove redundant 'gallery'
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      dbName: 'img', // Consistent abbreviation
                      relationTo: 'media',
                    },
                    {
                      name: 'imageCaption',
                      type: 'text',
                      dbName: 'caption', // Remove redundant 'image'
                    },
                  ],
                },
              ],
            },
            {
              slug: 'codeSnippet',
              dbName: 'code_snippet', // Descriptive technical block
              fields: [
                {
                  name: 'programmingLanguage',
                  type: 'select',
                  dbName: 'language', // Remove redundant 'programming'
                  options: ['javascript', 'typescript', 'python', 'css'],
                },
                {
                  name: 'codeContent',
                  type: 'code',
                  dbName: 'content', // Remove redundant 'code'
                },
                {
                  name: 'codeDescription',
                  type: 'textarea',
                  dbName: 'desc', // Standard abbreviation
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'authorInformation',
      type: 'group',
      dbName: 'author_info', // Standard info abbreviation
      fields: [
        {
          name: 'author',
          type: 'relationship',
          dbName: 'author', // Keep semantic meaning
          relationTo: 'users',
          required: true,
        },
        {
          name: 'coAuthors',
          type: 'relationship',
          dbName: 'co_authors', // Descriptive relationship
          relationTo: 'users',
          hasMany: true,
        },
        {
          name: 'authorNote',
          type: 'textarea',
          dbName: 'author_note', // Descriptive note field
        },
      ],
    },
    {
      name: 'seoConfiguration',
      type: 'group',
      dbName: 'seo_config', // SEO + config abbreviation
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          dbName: 'meta_title', // Standard SEO field
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          dbName: 'meta_desc', // Standard abbreviation
        },
        {
          name: 'socialMediaSettings',
          type: 'group',
          dbName: 'social_settings', // Social media abbreviated
          fields: [
            {
              name: 'ogTitle',
              type: 'text',
              dbName: 'og_title', // Keep standard OG terms
            },
            {
              name: 'ogDescription',
              type: 'textarea',
              dbName: 'og_desc', // Standard abbreviation
            },
            {
              name: 'ogImage',
              type: 'upload',
              dbName: 'og_img', // Consistent abbreviations
              relationTo: 'media',
            },
          ],
        },
      ],
    },
  ],
}

// Rationale Comments:
// - post_meta: Metadata abbreviated following project standards
// - content_structure: Descriptive but prevents long nested identifiers
// - img_gallery: Image abbreviated consistently throughout
// - seo_config: SEO is standard abbreviation, config follows project pattern
// - social_settings: Social media abbreviated while maintaining clarity
```

This comprehensive example demonstrates how `dbName` properties should be applied consistently across different types of Payload CMS configurations, always balancing brevity with semantic clarity.

## Summary

Key principles demonstrated in these examples:

1. **Consistent Abbreviations**: Use the same abbreviations across the project
2. **Context Awareness**: Remove redundant prefixes when context is clear
3. **Snake Case**: Always use snake_case for `dbName` properties
4. **Strategic Placement**: Apply `dbName` at key points to interrupt long identifier chains
5. **Semantic Preservation**: Maintain meaning while achieving brevity
6. **Documentation**: Include rationale comments for abbreviation decisions

These patterns ensure PostgreSQL identifier compliance while maintaining code readability and consistency across the entire Payload CMS project.
