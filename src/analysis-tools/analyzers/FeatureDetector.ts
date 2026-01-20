/**
 * Feature Detector
 * Identifies features in blocks and compares them
 */

import type { Block, Field, MissingFeature, FeatureDiff } from '../types'

export type FeatureType =
  | 'custom-validation'
  | 'hooks'
  | 'access-control'
  | 'admin-config'
  | 'conditional-fields'
  | 'array-fields'
  | 'group-fields'
  | 'nested-blocks'
  | 'relationships'
  | 'uploads'
  | 'typescript-interface'
  | 'localization'
  | 'default-values'
  | 'unique-constraints'
  | 'indexes'
  | 'field-level-access'
  | 'admin-descriptions'
  | 'admin-conditions'
  | 'field-hooks'
  | 'rich-text'
  | 'tabs'
  | 'collapsible'
  | 'row-layout'

export interface DetectedFeature {
  type: FeatureType
  description: string
  locations: string[]
  complexity: 'low' | 'medium' | 'high'
  benefit: string
}

export class FeatureDetector {
  /**
   * Detect all features in a block
   */
  detectFeatures(block: Block): DetectedFeature[] {
    const features: DetectedFeature[] = []

    // Block-level features
    if (block.interfaceName) {
      features.push({
        type: 'typescript-interface',
        description: 'Block uses TypeScript interface for type safety',
        locations: ['block.interfaceName'],
        complexity: 'low',
        benefit: 'Provides compile-time type checking and better IDE support',
      })
    }

    if (block.access) {
      features.push({
        type: 'access-control',
        description: 'Block has access control configured',
        locations: ['block.access'],
        complexity: 'medium',
        benefit: 'Restricts who can create, read, update, or delete this block',
      })
    }

    if (block.hooks) {
      const hookTypes = Object.keys(block.hooks)
      features.push({
        type: 'hooks',
        description: `Block uses hooks: ${hookTypes.join(', ')}`,
        locations: hookTypes.map((h) => `block.hooks.${h}`),
        complexity: 'medium',
        benefit: 'Allows custom logic to run at specific lifecycle points',
      })
    }

    if (block.admin) {
      features.push({
        type: 'admin-config',
        description: 'Block has admin UI configuration',
        locations: ['block.admin'],
        complexity: 'low',
        benefit: 'Customizes how the block appears in the admin panel',
      })
    }

    // Field-level features
    const fieldFeatures = this.detectFieldFeatures(block.fields)
    features.push(...fieldFeatures)

    return features
  }

  /**
   * Detect features in fields recursively
   */
  private detectFieldFeatures(fields: Field[], prefix: string = 'fields'): DetectedFeature[] {
    const featureMap = new Map<FeatureType, DetectedFeature>()

    const processFields = (fields: Field[], path: string) => {
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        if (!field) continue

        const fieldPath = `${path}[${i}]${field.name ? `.${field.name}` : ''}`

        // Custom validation
        if (field.validate) {
          this.addOrUpdateFeature(featureMap, {
            type: 'custom-validation',
            description: 'Fields use custom validation functions',
            locations: [fieldPath],
            complexity: 'medium',
            benefit: 'Ensures data integrity with custom business rules',
          })
        }

        // Access control
        if (field.access) {
          this.addOrUpdateFeature(featureMap, {
            type: 'field-level-access',
            description: 'Fields have field-level access control',
            locations: [fieldPath],
            complexity: 'medium',
            benefit: 'Fine-grained control over who can read/write specific fields',
          })
        }

        // Admin config
        if (field.admin) {
          if (field.admin.description) {
            this.addOrUpdateFeature(featureMap, {
              type: 'admin-descriptions',
              description: 'Fields have admin descriptions',
              locations: [fieldPath],
              complexity: 'low',
              benefit: 'Provides helpful context to content editors',
            })
          }

          if (field.admin.condition) {
            this.addOrUpdateFeature(featureMap, {
              type: 'conditional-fields',
              description: 'Fields use conditional visibility',
              locations: [fieldPath],
              complexity: 'medium',
              benefit: 'Shows/hides fields based on other field values',
            })
          }
        }

        // Default values
        if (field.defaultValue !== undefined) {
          this.addOrUpdateFeature(featureMap, {
            type: 'default-values',
            description: 'Fields have default values',
            locations: [fieldPath],
            complexity: 'low',
            benefit: 'Provides sensible defaults for content editors',
          })
        }

        // Unique constraints
        if (field.unique) {
          this.addOrUpdateFeature(featureMap, {
            type: 'unique-constraints',
            description: 'Fields have unique constraints',
            locations: [fieldPath],
            complexity: 'low',
            benefit: 'Ensures field values are unique across documents',
          })
        }

        // Indexes
        if (field.index) {
          this.addOrUpdateFeature(featureMap, {
            type: 'indexes',
            description: 'Fields are indexed for performance',
            locations: [fieldPath],
            complexity: 'low',
            benefit: 'Improves query performance for frequently searched fields',
          })
        }

        // Localization
        if (field.localized) {
          this.addOrUpdateFeature(featureMap, {
            type: 'localization',
            description: 'Fields support localization',
            locations: [fieldPath],
            complexity: 'medium',
            benefit: 'Allows content to be translated into multiple languages',
          })
        }

        // Field type specific features
        switch (field.type) {
          case 'array':
            this.addOrUpdateFeature(featureMap, {
              type: 'array-fields',
              description: 'Block uses array fields for repeatable content',
              locations: [fieldPath],
              complexity: 'medium',
              benefit: 'Allows editors to add multiple instances of a field group',
            })
            if (field.fields) {
              processFields(field.fields, `${fieldPath}.fields`)
            }
            break

          case 'group':
            this.addOrUpdateFeature(featureMap, {
              type: 'group-fields',
              description: 'Block uses group fields for organization',
              locations: [fieldPath],
              complexity: 'low',
              benefit: 'Groups related fields together for better organization',
            })
            if (field.fields) {
              processFields(field.fields, `${fieldPath}.fields`)
            }
            break

          case 'blocks':
            this.addOrUpdateFeature(featureMap, {
              type: 'nested-blocks',
              description: 'Block uses nested blocks for flexible layouts',
              locations: [fieldPath],
              complexity: 'high',
              benefit: 'Provides maximum flexibility for content structure',
            })
            if (field.blocks) {
              for (let j = 0; j < field.blocks.length; j++) {
                const nestedBlock = field.blocks[j]
                if (nestedBlock.fields) {
                  processFields(nestedBlock.fields, `${fieldPath}.blocks[${j}].fields`)
                }
              }
            }
            break

          case 'relationship':
            this.addOrUpdateFeature(featureMap, {
              type: 'relationships',
              description: 'Block uses relationships to link to other collections',
              locations: [fieldPath],
              complexity: 'medium',
              benefit: 'Creates connections between different content types',
            })
            break

          case 'upload':
            this.addOrUpdateFeature(featureMap, {
              type: 'uploads',
              description: 'Block supports file uploads',
              locations: [fieldPath],
              complexity: 'medium',
              benefit: 'Allows editors to upload and manage media files',
            })
            break

          case 'richText':
            this.addOrUpdateFeature(featureMap, {
              type: 'rich-text',
              description: 'Block uses rich text editor',
              locations: [fieldPath],
              complexity: 'medium',
              benefit: 'Provides formatted text editing capabilities',
            })
            break

          case 'tabs':
            this.addOrUpdateFeature(featureMap, {
              type: 'tabs',
              description: 'Block uses tabs for field organization',
              locations: [fieldPath],
              complexity: 'low',
              benefit: 'Organizes fields into separate tabs for better UX',
            })
            if (field.tabs) {
              for (let j = 0; j < field.tabs.length; j++) {
                const tab = field.tabs[j]
                if (tab.fields) {
                  processFields(tab.fields, `${fieldPath}.tabs[${j}].fields`)
                }
              }
            }
            break

          case 'collapsible':
            this.addOrUpdateFeature(featureMap, {
              type: 'collapsible',
              description: 'Block uses collapsible sections',
              locations: [fieldPath],
              complexity: 'low',
              benefit: 'Allows sections to be collapsed to reduce visual clutter',
            })
            if (field.fields) {
              processFields(field.fields, `${fieldPath}.fields`)
            }
            break

          case 'row':
            this.addOrUpdateFeature(featureMap, {
              type: 'row-layout',
              description: 'Block uses row layout for horizontal field arrangement',
              locations: [fieldPath],
              complexity: 'low',
              benefit: 'Arranges fields horizontally for compact layouts',
            })
            if (field.fields) {
              processFields(field.fields, `${fieldPath}.fields`)
            }
            break
        }

        // Field hooks
        if (field.hooks) {
          this.addOrUpdateFeature(featureMap, {
            type: 'field-hooks',
            description: 'Fields use hooks for custom logic',
            locations: [fieldPath],
            complexity: 'medium',
            benefit: 'Allows custom logic to run for specific fields',
          })
        }
      }
    }

    processFields(fields, prefix)

    return Array.from(featureMap.values())
  }

  /**
   * Add or update feature in map
   */
  private addOrUpdateFeature(
    map: Map<FeatureType, DetectedFeature>,
    feature: DetectedFeature,
  ): void {
    const existing = map.get(feature.type)
    if (existing) {
      existing.locations.push(...feature.locations)
    } else {
      map.set(feature.type, feature)
    }
  }

  /**
   * Compare features between blocks
   */
  compareFeatures(localBlock: Block, officialBlock: Block): FeatureDiff[] {
    const localFeatures = this.detectFeatures(localBlock)
    const officialFeatures = this.detectFeatures(officialBlock)

    const diffs: FeatureDiff[] = []

    const localFeatureTypes = new Set(localFeatures.map((f) => f.type))
    const officialFeatureTypes = new Set(officialFeatures.map((f) => f.type))

    // Features in official but not in local
    for (const feature of officialFeatures) {
      if (!localFeatureTypes.has(feature.type)) {
        diffs.push({
          featureName: feature.type,
          presentInOfficial: true,
          presentInCurrent: false,
          description: `Official pattern uses ${feature.description.toLowerCase()}, but local implementation does not`,
        })
      }
    }

    // Features in local but not in official
    for (const feature of localFeatures) {
      if (!officialFeatureTypes.has(feature.type)) {
        diffs.push({
          featureName: feature.type,
          presentInOfficial: false,
          presentInCurrent: true,
          description: `Local implementation uses ${feature.description.toLowerCase()}, but official pattern does not`,
        })
      }
    }

    return diffs
  }

  /**
   * Identify missing features across multiple blocks
   */
  identifyMissingFeatures(localBlocks: Block[], officialBlocks: Block[]): MissingFeature[] {
    const missingFeatures: MissingFeature[] = []
    const featureUsage = new Map<FeatureType, Set<string>>()

    // Collect feature usage from official blocks
    for (const block of officialBlocks) {
      const features = this.detectFeatures(block)
      for (const feature of features) {
        if (!featureUsage.has(feature.type)) {
          featureUsage.set(feature.type, new Set())
        }
        featureUsage.get(feature.type)!.add(block.slug)
      }
    }

    // Check which features are missing in local blocks
    const localFeatureTypes = new Set<FeatureType>()
    for (const block of localBlocks) {
      const features = this.detectFeatures(block)
      for (const feature of features) {
        localFeatureTypes.add(feature.type)
      }
    }

    // Create missing feature reports
    for (const entry of Array.from(featureUsage.entries())) {
      const [featureType, usedInBlocks] = entry
      if (!localFeatureTypes.has(featureType)) {
        const exampleFeature = this.getFeatureExample(featureType)
        missingFeatures.push({
          featureName: featureType,
          description: exampleFeature.description,
          usedInOfficial: Array.from(usedInBlocks),
          benefit: exampleFeature.benefit,
          implementationComplexity: exampleFeature.complexity,
        })
      }
    }

    return missingFeatures
  }

  /**
   * Get example feature for a type
   */
  private getFeatureExample(type: FeatureType): DetectedFeature {
    // Return a default feature description
    const examples: Record<FeatureType, DetectedFeature> = {
      'custom-validation': {
        type: 'custom-validation',
        description: 'Custom validation functions',
        locations: [],
        complexity: 'medium',
        benefit: 'Ensures data integrity with custom business rules',
      },
      hooks: {
        type: 'hooks',
        description: 'Lifecycle hooks',
        locations: [],
        complexity: 'medium',
        benefit: 'Allows custom logic to run at specific lifecycle points',
      },
      'access-control': {
        type: 'access-control',
        description: 'Access control',
        locations: [],
        complexity: 'medium',
        benefit: 'Restricts who can create, read, update, or delete content',
      },
      'admin-config': {
        type: 'admin-config',
        description: 'Admin UI configuration',
        locations: [],
        complexity: 'low',
        benefit: 'Customizes how content appears in the admin panel',
      },
      'conditional-fields': {
        type: 'conditional-fields',
        description: 'Conditional field visibility',
        locations: [],
        complexity: 'medium',
        benefit: 'Shows/hides fields based on other field values',
      },
      'array-fields': {
        type: 'array-fields',
        description: 'Array fields',
        locations: [],
        complexity: 'medium',
        benefit: 'Allows editors to add multiple instances of a field group',
      },
      'group-fields': {
        type: 'group-fields',
        description: 'Group fields',
        locations: [],
        complexity: 'low',
        benefit: 'Groups related fields together for better organization',
      },
      'nested-blocks': {
        type: 'nested-blocks',
        description: 'Nested blocks',
        locations: [],
        complexity: 'high',
        benefit: 'Provides maximum flexibility for content structure',
      },
      relationships: {
        type: 'relationships',
        description: 'Relationships',
        locations: [],
        complexity: 'medium',
        benefit: 'Creates connections between different content types',
      },
      uploads: {
        type: 'uploads',
        description: 'File uploads',
        locations: [],
        complexity: 'medium',
        benefit: 'Allows editors to upload and manage media files',
      },
      'typescript-interface': {
        type: 'typescript-interface',
        description: 'TypeScript interface',
        locations: [],
        complexity: 'low',
        benefit: 'Provides compile-time type checking and better IDE support',
      },
      localization: {
        type: 'localization',
        description: 'Localization support',
        locations: [],
        complexity: 'medium',
        benefit: 'Allows content to be translated into multiple languages',
      },
      'default-values': {
        type: 'default-values',
        description: 'Default values',
        locations: [],
        complexity: 'low',
        benefit: 'Provides sensible defaults for content editors',
      },
      'unique-constraints': {
        type: 'unique-constraints',
        description: 'Unique constraints',
        locations: [],
        complexity: 'low',
        benefit: 'Ensures field values are unique across documents',
      },
      indexes: {
        type: 'indexes',
        description: 'Database indexes',
        locations: [],
        complexity: 'low',
        benefit: 'Improves query performance for frequently searched fields',
      },
      'field-level-access': {
        type: 'field-level-access',
        description: 'Field-level access control',
        locations: [],
        complexity: 'medium',
        benefit: 'Fine-grained control over who can read/write specific fields',
      },
      'admin-descriptions': {
        type: 'admin-descriptions',
        description: 'Admin field descriptions',
        locations: [],
        complexity: 'low',
        benefit: 'Provides helpful context to content editors',
      },
      'admin-conditions': {
        type: 'admin-conditions',
        description: 'Admin conditions',
        locations: [],
        complexity: 'medium',
        benefit: 'Controls field visibility based on conditions',
      },
      'field-hooks': {
        type: 'field-hooks',
        description: 'Field-level hooks',
        locations: [],
        complexity: 'medium',
        benefit: 'Allows custom logic to run for specific fields',
      },
      'rich-text': {
        type: 'rich-text',
        description: 'Rich text editor',
        locations: [],
        complexity: 'medium',
        benefit: 'Provides formatted text editing capabilities',
      },
      tabs: {
        type: 'tabs',
        description: 'Tab organization',
        locations: [],
        complexity: 'low',
        benefit: 'Organizes fields into separate tabs for better UX',
      },
      collapsible: {
        type: 'collapsible',
        description: 'Collapsible sections',
        locations: [],
        complexity: 'low',
        benefit: 'Allows sections to be collapsed to reduce visual clutter',
      },
      'row-layout': {
        type: 'row-layout',
        description: 'Row layout',
        locations: [],
        complexity: 'low',
        benefit: 'Arranges fields horizontally for compact layouts',
      },
    }

    return examples[type]
  }
}
