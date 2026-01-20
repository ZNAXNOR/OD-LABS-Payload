'use client'

import React, { useState, useEffect } from 'react'
import type { Block } from 'payload'
import { getBlockBySlug } from '@/fields/blockEmbedding'

interface BlockConfigPanelProps {
  blockSlug: string
  blockData: any
  onUpdateBlock: (data: any) => void
  onClose: () => void
  isOpen: boolean
}

export const BlockConfigPanel: React.FC<BlockConfigPanelProps> = ({
  blockSlug,
  blockData,
  onUpdateBlock,
  onClose,
  isOpen,
}) => {
  const [formData, setFormData] = useState(blockData || {})
  const [hasChanges, setHasChanges] = useState(false)

  const block = getBlockBySlug(blockSlug)

  useEffect(() => {
    setFormData(blockData || {})
    setHasChanges(false)
  }, [blockData, blockSlug])

  const handleFieldChange = (fieldName: string, value: any) => {
    const newData = { ...formData, [fieldName]: value }
    setFormData(newData)
    setHasChanges(true)
  }

  const handleSave = () => {
    onUpdateBlock(formData)
    setHasChanges(false)
    onClose()
  }

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setFormData(blockData || {})
        setHasChanges(false)
        onClose()
      }
    } else {
      onClose()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleCancel()
    } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      handleSave()
    }
  }

  if (!isOpen || !block) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleCancel}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Configure{' '}
                {typeof block.labels?.singular === 'string' ? block.labels.singular : block.slug}
              </h2>
              <p className="text-sm text-gray-600 mt-1">Customize the settings for this block</p>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <BlockConfigForm block={block} data={formData} onChange={handleFieldChange} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {hasChanges && (
                <span className="text-amber-600">
                  <svg
                    className="w-4 h-4 inline mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  Unsaved changes
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`px-4 py-2 rounded-md transition-colors ${
                  hasChanges
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Press{' '}
            <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded">Ctrl+Enter</kbd> to
            save,
            <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded ml-1">Esc</kbd> to
            cancel
          </div>
        </div>
      </div>
    </div>
  )
}

// Simplified form component for block configuration
interface BlockConfigFormProps {
  block: Block
  data: any
  onChange: (fieldName: string, value: any) => void
}

const BlockConfigForm: React.FC<BlockConfigFormProps> = ({ block, data, onChange }) => {
  // This is a simplified form renderer
  // In a real implementation, you'd want to use Payload's field rendering system
  // or create a more sophisticated form builder

  const renderField = (field: any, fieldPath: string = '') => {
    const fieldName = fieldPath ? `${fieldPath}.${field.name}` : field.name
    const value = getNestedValue(data, fieldName)

    switch (field.type) {
      case 'text':
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label || field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(fieldName, e.target.value)}
              placeholder={field.admin?.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {field.admin?.description && (
              <p className="text-xs text-gray-500 mt-1">{field.admin.description}</p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label || field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value || ''}
              onChange={(e) => onChange(fieldName, e.target.value)}
              placeholder={field.admin?.placeholder}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {field.admin?.description && (
              <p className="text-xs text-gray-500 mt-1">{field.admin.description}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label || field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value || field.defaultValue || ''}
              onChange={(e) => onChange(fieldName, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {field.options?.map((option: any) => (
                <option key={option.value || option} value={option.value || option}>
                  {option.label || option}
                </option>
              ))}
            </select>
            {field.admin?.description && (
              <p className="text-xs text-gray-500 mt-1">{field.admin.description}</p>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div key={fieldName} className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={value || false}
                onChange={(e) => onChange(fieldName, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {field.label || field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
            {field.admin?.description && (
              <p className="text-xs text-gray-500 mt-1 ml-6">{field.admin.description}</p>
            )}
          </div>
        )

      case 'number':
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label || field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              value={value || ''}
              onChange={(e) => onChange(fieldName, parseFloat(e.target.value) || 0)}
              min={field.min}
              max={field.max}
              step={field.step}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {field.admin?.description && (
              <p className="text-xs text-gray-500 mt-1">{field.admin.description}</p>
            )}
          </div>
        )

      case 'group':
        return (
          <div key={fieldName} className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">{field.label || field.name}</h3>
            <div className="pl-4 border-l-2 border-gray-200">
              {field.fields?.map((subField: any) => renderField(subField, fieldName))}
            </div>
          </div>
        )

      default:
        return (
          <div key={fieldName} className="mb-4">
            <div className="text-sm text-gray-500 italic">
              Field type "{field.type}" not yet supported in quick config
            </div>
          </div>
        )
    }
  }

  return <div className="space-y-4">{block.fields?.map((field) => renderField(field))}</div>
}

// Helper function to get nested object values
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

export default BlockConfigPanel
