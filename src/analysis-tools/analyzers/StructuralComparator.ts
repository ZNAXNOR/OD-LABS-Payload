/**
 * Structural Comparator
 * Compares field organization and structure between blocks
 */

import type { Block, Field, StructuralDiff, OrganizationDiff } from '../types'

export interface StructureAnalysis {
  fieldOrder: string[]
  groupedFields: Map<string, string[]>
  nestingDepth: number
  fieldTypes: Map<string, string>
  hasGroups: boolean
  hasArrays: boolean
  hasBlocks: boolean
  hasTabs: boolean
}

export class StructuralComparator {
  /**
   * Compare field organization between two blocks
   */
  compareStructure(localBlock: Block, officialBlock: Block): StructuralDiff[] {
    const diffs: StructuralDiff[] = []

    const localAnalysis = this.analyzeStructure(localBlock)
    const officialAnalysis = this.analyzeStructure(officialBlock)

    // Compare field order
    const orderDiff = this.compareFieldOrder(localAnalysis, officialAnalysis)
    if (orderDiff) {
      diffs.push(orderDiff)
    }

    // Compare field grouping
    const groupingDiff = this.compareFieldGrouping(localAnalysis, officialAnalysis)
    if (groupingDiff) {
      diffs.push(groupingDiff)
    }

    // Compare nesting depth
    const depthDiff = this.compareNestingDepth(localAnalysis, officialAnalysis)
    if (depthDiff) {
      diffs.push(depthDiff)
    }

    return diffs
  }

  /**
   * Identify organizational differences
   */
  compareOrganization(localBlock: Block, officialBlock: Block): OrganizationDiff[] {
    const diffs: OrganizationDiff[] = []

    const localAnalysis = this.analyzeStructure(localBlock)
    const officialAnalysis = this.analyzeStructure(officialBlock)

    // Check for different organizational patterns
    if (officialAnalysis.hasGroups && !localAnalysis.hasGroups) {
      diffs.push({
        type: 'field-organization',
        description:
          'Official pattern uses groups to organize fields, but local implementation uses flat structure',
        recommendation:
          'Consider grouping related fields using the "group" field type for better organization',
      })
    }

    if (officialAnalysis.hasTabs && !localAnalysis.hasTabs) {
      diffs.push({
        type: 'field-organization',
        description:
          'Official pattern uses tabs to organize fields, but local implementation does not',
        recommendation:
          'Consider using tabs to separate different aspects of the block (e.g., Content, Settings, SEO)',
      })
    }

    // Check naming conventions
    const namingDiff = this.compareNamingConventions(localBlock, officialBlock)
    if (namingDiff) {
      diffs.push(namingDiff)
    }

    // Check structure patterns
    const patternDiff = this.compareStructurePatterns(localAnalysis, officialAnalysis)
    if (patternDiff) {
      diffs.push(patternDiff)
    }

    return diffs
  }

  /**
   * Analyze block structure
   */
  private analyzeStructure(block: Block): StructureAnalysis {
    const fieldOrder: string[] = []
    const groupedFields = new Map<string, string[]>()
    const fieldTypes = new Map<string, string>()
    let maxDepth = 0

    const analyzeFields = (fields: Field[], depth: number = 0, groupName?: string) => {
      maxDepth = Math.max(maxDepth, depth)

      for (const field of fields) {
        if (field.name) {
          fieldOrder.push(field.name)
          fieldTypes.set(field.name, field.type)

          if (groupName) {
            const existing = groupedFields.get(groupName) || []
            existing.push(field.name)
            groupedFields.set(groupName, existing)
          }
        }

        // Recursively analyze nested fields
        if (field.type === 'group' && field.fields) {
          analyzeFields(field.fields, depth + 1, field.name)
        } else if (field.type === 'array' && field.fields) {
          analyzeFields(field.fields, depth + 1, field.name)
        } else if (field.type === 'blocks' && field.blocks) {
          for (const nestedBlock of field.blocks) {
            if (nestedBlock.fields) {
              analyzeFields(nestedBlock.fields, depth + 1, field.name)
            }
          }
        } else if (field.type === 'tabs' && field.tabs) {
          for (const tab of field.tabs) {
            if (tab.fields) {
              analyzeFields(tab.fields, depth + 1, tab.name || 'unnamed-tab')
            }
          }
        }
      }
    }

    analyzeFields(block.fields)

    return {
      fieldOrder,
      groupedFields,
      nestingDepth: maxDepth,
      fieldTypes,
      hasGroups: Array.from(fieldTypes.values()).includes('group'),
      hasArrays: Array.from(fieldTypes.values()).includes('array'),
      hasBlocks: Array.from(fieldTypes.values()).includes('blocks'),
      hasTabs: Array.from(fieldTypes.values()).includes('tabs'),
    }
  }

  /**
   * Compare field order between structures
   */
  private compareFieldOrder(
    local: StructureAnalysis,
    official: StructureAnalysis,
  ): StructuralDiff | null {
    // Find common fields
    const commonFields = local.fieldOrder.filter((field) => official.fieldOrder.includes(field))

    if (commonFields.length < 2) {
      return null // Not enough common fields to compare order
    }

    // Check if order is different
    const localOrder = commonFields.map((field) => local.fieldOrder.indexOf(field))
    const officialOrder = commonFields.map((field) => official.fieldOrder.indexOf(field))

    let orderDifferent = false
    for (let i = 0; i < localOrder.length - 1; i++) {
      for (let j = i + 1; j < localOrder.length; j++) {
        const localRelativeOrder = localOrder[i] < localOrder[j]
        const officialRelativeOrder = officialOrder[i] < officialOrder[j]
        if (localRelativeOrder !== officialRelativeOrder) {
          orderDifferent = true
          break
        }
      }
      if (orderDifferent) break
    }

    if (!orderDifferent) {
      return null
    }

    return {
      type: 'field-order',
      description: 'Field order differs from official pattern',
      officialApproach: `Fields ordered as: ${commonFields.map((f) => official.fieldOrder.indexOf(f)).join(', ')}`,
      currentApproach: `Fields ordered as: ${commonFields.map((f) => local.fieldOrder.indexOf(f)).join(', ')}`,
    }
  }

  /**
   * Compare field grouping strategies
   */
  private compareFieldGrouping(
    local: StructureAnalysis,
    official: StructureAnalysis,
  ): StructuralDiff | null {
    const localGroupCount = local.groupedFields.size
    const officialGroupCount = official.groupedFields.size

    if (localGroupCount === officialGroupCount) {
      return null
    }

    return {
      type: 'field-grouping',
      description: 'Field grouping strategy differs from official pattern',
      officialApproach: `Uses ${officialGroupCount} groups: ${Array.from(official.groupedFields.keys()).join(', ')}`,
      currentApproach: `Uses ${localGroupCount} groups: ${Array.from(local.groupedFields.keys()).join(', ')}`,
    }
  }

  /**
   * Compare nesting depth
   */
  private compareNestingDepth(
    local: StructureAnalysis,
    official: StructureAnalysis,
  ): StructuralDiff | null {
    if (local.nestingDepth === official.nestingDepth) {
      return null
    }

    const depthDifference = Math.abs(local.nestingDepth - official.nestingDepth)

    if (depthDifference <= 1) {
      return null // Minor difference, not significant
    }

    return {
      type: 'nesting-depth',
      description: 'Nesting depth differs significantly from official pattern',
      officialApproach: `Maximum nesting depth: ${official.nestingDepth}`,
      currentApproach: `Maximum nesting depth: ${local.nestingDepth}`,
    }
  }

  /**
   * Compare naming conventions
   */
  private compareNamingConventions(
    localBlock: Block,
    officialBlock: Block,
  ): OrganizationDiff | null {
    const localNames = this.extractFieldNames(localBlock.fields)
    const officialNames = this.extractFieldNames(officialBlock.fields)

    // Check naming patterns
    const localCamelCase = localNames.filter((name) => /^[a-z][a-zA-Z0-9]*$/.test(name)).length
    const officialCamelCase = officialNames.filter((name) =>
      /^[a-z][a-zA-Z0-9]*$/.test(name),
    ).length

    const localSnakeCase = localNames.filter((name) => /^[a-z][a-z0-9_]*$/.test(name)).length
    const officialSnakeCase = officialNames.filter((name) => /^[a-z][a-z0-9_]*$/.test(name)).length

    const localCamelRatio = localCamelCase / localNames.length
    const officialCamelRatio = officialCamelCase / officialNames.length

    const localSnakeRatio = localSnakeCase / localNames.length
    const officialSnakeRatio = officialSnakeCase / officialNames.length

    // If official uses camelCase but local uses snake_case (or vice versa)
    if (officialCamelRatio > 0.8 && localSnakeRatio > 0.5) {
      return {
        type: 'naming-convention',
        description: 'Field naming convention differs from official pattern',
        recommendation:
          'Official pattern uses camelCase for field names. Consider adopting this convention for consistency.',
      }
    }

    if (officialSnakeRatio > 0.8 && localCamelRatio > 0.5) {
      return {
        type: 'naming-convention',
        description: 'Field naming convention differs from official pattern',
        recommendation:
          'Official pattern uses snake_case for field names. Consider adopting this convention for consistency.',
      }
    }

    return null
  }

  /**
   * Compare structure patterns
   */
  private compareStructurePatterns(
    local: StructureAnalysis,
    official: StructureAnalysis,
  ): OrganizationDiff | null {
    const differences: string[] = []

    if (official.hasGroups && !local.hasGroups) {
      differences.push('groups')
    }

    if (official.hasArrays && !local.hasArrays) {
      differences.push('arrays')
    }

    if (official.hasBlocks && !local.hasBlocks) {
      differences.push('nested blocks')
    }

    if (official.hasTabs && !local.hasTabs) {
      differences.push('tabs')
    }

    if (differences.length === 0) {
      return null
    }

    return {
      type: 'structure-pattern',
      description: `Official pattern uses ${differences.join(', ')} which are not present in local implementation`,
      recommendation: `Consider using ${differences.join(', ')} to match the official pattern's structure`,
    }
  }

  /**
   * Extract all field names recursively
   */
  private extractFieldNames(fields: Field[]): string[] {
    const names: string[] = []

    const extract = (fields: Field[]) => {
      for (const field of fields) {
        if (field.name) {
          names.push(field.name)
        }

        if (field.type === 'group' && field.fields) {
          extract(field.fields)
        } else if (field.type === 'array' && field.fields) {
          extract(field.fields)
        } else if (field.type === 'blocks' && field.blocks) {
          for (const block of field.blocks) {
            if (block.fields) {
              extract(block.fields)
            }
          }
        } else if (field.type === 'tabs' && field.tabs) {
          for (const tab of field.tabs) {
            if (tab.fields) {
              extract(tab.fields)
            }
          }
        }
      }
    }

    extract(fields)
    return names
  }
}
