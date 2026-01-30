'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useState } from 'react'

const PAGE_TYPE_OPTIONS = [
  { label: 'All Pages', value: '' },
  { label: 'Regular Pages', value: 'page' },
  { label: 'Blog Posts', value: 'blog' },
  { label: 'Services', value: 'service' },
  { label: 'Legal Documents', value: 'legal' },
  { label: 'Contact Pages', value: 'contact' },
]

export const PageTypeFilter: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPageType = searchParams?.get('where[pageType][equals]') || ''
  const [selectedType, setSelectedType] = useState(currentPageType)

  const handleFilterChange = useCallback(
    (pageType: string) => {
      setSelectedType(pageType)

      const params = new URLSearchParams(searchParams?.toString())

      if (pageType) {
        params.set('where[pageType][equals]', pageType)
      } else {
        params.delete('where[pageType][equals]')
      }

      // Reset to first page when filtering
      params.delete('page')

      router.push(`?${params.toString()}`)
    },
    [searchParams, router],
  )

  return (
    <div className="page-type-filter">
      <div className="page-type-filter__header">
        <h3 className="page-type-filter__title">Filter by Page Type</h3>
        <p className="page-type-filter__description">
          Show only specific types of pages to focus your content management
        </p>
      </div>

      <div className="page-type-filter__options">
        {PAGE_TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`page-type-filter__option ${
              selectedType === option.value ? 'page-type-filter__option--active' : ''
            }`}
            onClick={() => handleFilterChange(option.value)}
          >
            <span className="page-type-filter__option-label">{option.label}</span>
            {selectedType === option.value && (
              <span className="page-type-filter__option-indicator">✓</span>
            )}
          </button>
        ))}
      </div>

      {selectedType && (
        <div className="page-type-filter__active">
          <span className="page-type-filter__active-label">Active filter:</span>
          <span className="page-type-filter__active-value">
            {PAGE_TYPE_OPTIONS.find((opt) => opt.value === selectedType)?.label}
          </span>
          <button
            type="button"
            className="page-type-filter__clear"
            onClick={() => handleFilterChange('')}
            title="Clear filter"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default PageTypeFilter
