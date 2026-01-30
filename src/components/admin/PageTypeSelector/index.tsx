'use client'
import { SelectInput, useField } from '@payloadcms/ui'
import type { SelectFieldClientComponent } from 'payload'

const PAGE_TYPE_DESCRIPTIONS = {
  page: {
    title: 'Regular Page',
    description:
      'General content pages like About, Home, or informational pages. Supports hierarchical structure and all content blocks.',
    icon: '📄',
    examples: 'About Us, Home, Company Info',
  },
  blog: {
    title: 'Blog Post',
    description:
      'Articles and blog posts with author, tags, and publishing features. Optimized for content marketing and SEO.',
    icon: '📝',
    examples: 'News articles, tutorials, announcements',
  },
  service: {
    title: 'Service Page',
    description:
      'Service descriptions with pricing, service types, and portfolio features. Perfect for showcasing your offerings.',
    icon: '🛠️',
    examples: 'Web Development, Consulting, Design Services',
  },
  legal: {
    title: 'Legal Document',
    description:
      'Legal documents with effective dates and notification settings. Includes version tracking and compliance features.',
    icon: '⚖️',
    examples: 'Privacy Policy, Terms of Service, Cookie Policy',
  },
  contact: {
    title: 'Contact Page',
    description:
      'Contact pages with form integration and contact information display. Supports multiple contact purposes.',
    icon: '📞',
    examples: 'Contact Us, Support, Sales Inquiries',
  },
}

export const PageTypeSelector: SelectFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError } = useField<string>({ path })

  const options =
    field.options?.map((option: any) => {
      const optionValue = typeof option === 'string' ? option : option.value
      const optionLabel = typeof option === 'string' ? option : option.label
      const description = PAGE_TYPE_DESCRIPTIONS[optionValue as keyof typeof PAGE_TYPE_DESCRIPTIONS]

      return {
        label: optionLabel,
        value: optionValue,
        description,
      }
    }) || []

  return (
    <div className="page-type-selector">
      <div className="page-type-selector__field">
        <SelectInput
          path={path}
          name={field.name}
          label={field.label}
          value={value}
          onChange={setValue}
          options={options.map((opt) => ({ label: opt.label, value: opt.value }))}
          showError={showError}
          required={field.required}
        />
      </div>

      {value && PAGE_TYPE_DESCRIPTIONS[value as keyof typeof PAGE_TYPE_DESCRIPTIONS] && (
        <div className="page-type-selector__info">
          <div className="page-type-selector__info-header">
            <span className="page-type-selector__info-icon">
              {PAGE_TYPE_DESCRIPTIONS[value as keyof typeof PAGE_TYPE_DESCRIPTIONS].icon}
            </span>
            <h4 className="page-type-selector__info-title">
              {PAGE_TYPE_DESCRIPTIONS[value as keyof typeof PAGE_TYPE_DESCRIPTIONS].title}
            </h4>
          </div>
          <p className="page-type-selector__info-description">
            {PAGE_TYPE_DESCRIPTIONS[value as keyof typeof PAGE_TYPE_DESCRIPTIONS].description}
          </p>
          <div className="page-type-selector__info-examples">
            <strong>Examples:</strong>{' '}
            {PAGE_TYPE_DESCRIPTIONS[value as keyof typeof PAGE_TYPE_DESCRIPTIONS].examples}
          </div>
        </div>
      )}

      {!value && (
        <div className="page-type-selector__help">
          <h4 className="page-type-selector__help-title">Choose a Page Type</h4>
          <div className="page-type-selector__help-options">
            {Object.entries(PAGE_TYPE_DESCRIPTIONS).map(([key, info]) => (
              <div key={key} className="page-type-selector__help-option">
                <span className="page-type-selector__help-option-icon">{info.icon}</span>
                <div className="page-type-selector__help-option-content">
                  <strong>{info.title}</strong>
                  <p>{info.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PageTypeSelector
