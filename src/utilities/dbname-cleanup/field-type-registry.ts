/**
 * PayloadCMS Field Type Registry
 * Maintains knowledge of which PayloadCMS field types support dbName and their database impact
 */

import type { FieldTypeInfo } from './types'

/**
 * Comprehensive registry of PayloadCMS field types and their dbName support
 * Based on PayloadCMS official documentation and field type capabilities
 */
export const FIELD_TYPE_REGISTRY: Record<string, FieldTypeInfo> = {
  // ============================================================================
  // Data-Storing Fields (Support dbName)
  // ============================================================================

  text: {
    name: 'text',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'low',
  },

  textarea: {
    name: 'textarea',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'low',
  },

  email: {
    name: 'email',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'low',
  },

  number: {
    name: 'number',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'low',
  },

  date: {
    name: 'date',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'low',
  },

  checkbox: {
    name: 'checkbox',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'low',
  },

  select: {
    name: 'select',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'low',
  },

  radio: {
    name: 'radio',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'low',
  },

  relationship: {
    name: 'relationship',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'medium',
  },

  upload: {
    name: 'upload',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'medium',
  },

  richText: {
    name: 'richText',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'low',
  },

  json: {
    name: 'json',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'low',
  },

  point: {
    name: 'point',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'medium',
  },

  // ============================================================================
  // Container Fields (Support dbName, High Impact)
  // ============================================================================

  array: {
    name: 'array',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'high',
  },

  group: {
    name: 'group',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'high',
  },

  blocks: {
    name: 'blocks',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'high',
  },

  // ============================================================================
  // Layout/UI Fields (Do NOT Support dbName)
  // ============================================================================

  tabs: {
    name: 'tabs',
    supportsDbName: false,
    affectsDatabase: false,
    canBeNested: false,
    identifierImpact: 'none',
  },

  row: {
    name: 'row',
    supportsDbName: false,
    affectsDatabase: false,
    canBeNested: false,
    identifierImpact: 'none',
  },

  collapsible: {
    name: 'collapsible',
    supportsDbName: false,
    affectsDatabase: false,
    canBeNested: false,
    identifierImpact: 'none',
  },

  ui: {
    name: 'ui',
    supportsDbName: false,
    affectsDatabase: false,
    canBeNested: false,
    identifierImpact: 'none',
  },

  // ============================================================================
  // Special Fields
  // ============================================================================

  code: {
    name: 'code',
    supportsDbName: true,
    affectsDatabase: true,
    canBeNested: true,
    identifierImpact: 'low',
  },

  join: {
    name: 'join',
    supportsDbName: true,
    affectsDatabase: false, // Virtual field
    canBeNested: true,
    identifierImpact: 'low',
  },
}

/**
 * Helper functions for field type checking
 */
export class FieldTypeRegistry {
  /**
   * Check if a field type supports dbName property
   */
  static supportsDbName(fieldType: string): boolean {
    const fieldInfo = FIELD_TYPE_REGISTRY[fieldType]
    return fieldInfo?.supportsDbName ?? false
  }

  /**
   * Check if a field type affects the database schema
   */
  static affectsDatabase(fieldType: string): boolean {
    const fieldInfo = FIELD_TYPE_REGISTRY[fieldType]
    return fieldInfo?.affectsDatabase ?? false
  }

  /**
   * Get the identifier impact level for a field type
   */
  static getIdentifierImpact(fieldType: string): 'none' | 'low' | 'medium' | 'high' {
    const fieldInfo = FIELD_TYPE_REGISTRY[fieldType]
    return fieldInfo?.identifierImpact ?? 'none'
  }

  /**
   * Check if a field type can be nested within other fields
   */
  static canBeNested(fieldType: string): boolean {
    const fieldInfo = FIELD_TYPE_REGISTRY[fieldType]
    return fieldInfo?.canBeNested ?? false
  }

  /**
   * Get all field types that support dbName
   */
  static getDbNameSupportedTypes(): string[] {
    return Object.keys(FIELD_TYPE_REGISTRY).filter((type) => {
      const fieldInfo = FIELD_TYPE_REGISTRY[type]
      return fieldInfo?.supportsDbName ?? false
    })
  }

  /**
   * Get all field types that do NOT support dbName
   */
  static getDbNameUnsupportedTypes(): string[] {
    return Object.keys(FIELD_TYPE_REGISTRY).filter((type) => {
      const fieldInfo = FIELD_TYPE_REGISTRY[type]
      return !(fieldInfo?.supportsDbName ?? false)
    })
  }

  /**
   * Get field types by identifier impact level
   */
  static getFieldTypesByImpact(impact: 'none' | 'low' | 'medium' | 'high'): string[] {
    return Object.keys(FIELD_TYPE_REGISTRY).filter((type) => {
      const fieldInfo = FIELD_TYPE_REGISTRY[type]
      return fieldInfo?.identifierImpact === impact
    })
  }

  /**
   * Check if a field type is a UI/layout field
   */
  static isUIField(fieldType: string): boolean {
    const uiFields = ['tabs', 'row', 'collapsible', 'ui']
    return uiFields.includes(fieldType)
  }

  /**
   * Check if a field type is a container field (can contain other fields)
   */
  static isContainerField(fieldType: string): boolean {
    const containerFields = ['array', 'group', 'blocks', 'tabs', 'row', 'collapsible']
    return containerFields.includes(fieldType)
  }

  /**
   * Get field type information
   */
  static getFieldTypeInfo(fieldType: string): FieldTypeInfo | undefined {
    return FIELD_TYPE_REGISTRY[fieldType]
  }

  /**
   * Validate if a field type exists in the registry
   */
  static isKnownFieldType(fieldType: string): boolean {
    return fieldType in FIELD_TYPE_REGISTRY
  }
}
