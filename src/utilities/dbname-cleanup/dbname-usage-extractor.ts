/**
 * DbNameUsage extraction with comprehensive nesting analysis
 *
 * This module provides advanced functionality for:
 * - Calculating field nesting levels and full identifier paths
 * - Tracking field context including parent fields and collection information
 * - Generating comprehensive usage metadata for analysis
 *
 * Requirements: 3.5, 6.1
 */

import { DBNAME_POSTGRES_IDENTIFIER_LIMIT } from './index'
import type {
  CollectionConfig,
  DbNameUsage,
  FieldConfig,
  FieldContext,
  GlobalConfig,
} from './types'

/**
 * Advanced DbName usage extractor with nesting analysis
 */
export class DbNameUsageExtractor {
  /**
   * Extract all dbName usages from a configuration with comprehensive nesting analysis
   */
  extractUsagesWithNestingAnalysis(
    config: CollectionConfig | GlobalConfig,
    filePath: string,
  ): DbNameUsage[] {
    const usages: DbNameUsage[] = []
    const collectionSlug = config.slug

    // Extract collection-level dbName usage
    if (config.dbName) {
      const usage = this.createCollectionLevelUsage(config, filePath)
      usages.push(usage)
    }

    // Extract field-level dbName usages with nesting analysis
    if (config.fields && Array.isArray(config.fields)) {
      this.extractFieldUsagesRecursively(
        config.fields,
        usages,
        collectionSlug,
        filePath,
        [], // parentFields
        'fields', // basePath
        0, // nestingLevel
      )
    }

    return usages
  }

  /**
   * Create collection-level dbName usage
   */
  private createCollectionLevelUsage(
    config: CollectionConfig | GlobalConfig,
    filePath: string,
  ): DbNameUsage {
    const fullPath = config.slug
    const identifierPath = this.calculateFullIdentifierPath([], config.slug, config.dbName)

    return {
      location: 'dbName',
      fieldName: config.slug,
      dbNameValue: config.dbName!,
      fieldType: 'collection',
      nestingLevel: 0,
      context: {
        parentFields: [],
        collectionSlug: config.slug,
        isNested: false,
        fullPath,
        identifierPath,
        estimatedDatabaseName: config.dbName,
        wouldExceedLimit: config.dbName.length > DBNAME_POSTGRES_IDENTIFIER_LIMIT,
        parentFieldTypes: [],
        fieldDepth: 0,
        isInArray: false,
        isInGroup: false,
        isInBlocks: false,
        arrayNestingLevel: 0,
        groupNestingLevel: 0,
        blocksNestingLevel: 0,
      },
    }
  }

  /**
   * Recursively extract field-level dbName usages with comprehensive nesting analysis
   */
  private extractFieldUsagesRecursively(
    fields: FieldConfig[],
    usages: DbNameUsage[],
    collectionSlug: string,
    filePath: string,
    parentFields: string[],
    basePath: string,
    nestingLevel: number,
    parentFieldTypes: string[] = [],
    arrayNestingLevel: number = 0,
    groupNestingLevel: number = 0,
    blocksNestingLevel: number = 0,
  ): void {
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      const fieldPath = `${basePath}[${i}]`
      const currentParentFields = [...parentFields, field.name]
      const currentParentFieldTypes = [...parentFieldTypes, field.type]
      const fullPath = currentParentFields.join('.')

      // Calculate nesting context
      const isInArray = arrayNestingLevel > 0
      const isInGroup = groupNestingLevel > 0
      const isInBlocks = blocksNestingLevel > 0
      const fieldDepth = currentParentFields.length - 1

      // Check if field has dbName
      if (field.dbName) {
        const identifierPath = this.calculateFullIdentifierPath(
          parentFields,
          field.name,
          field.dbName,
        )

        const estimatedDatabaseName = this.estimateDatabaseColumnName(
          collectionSlug,
          currentParentFields,
          field.dbName,
        )

        const usage: DbNameUsage = {
          location: `${fieldPath}.dbName`,
          fieldName: field.name,
          dbNameValue: field.dbName,
          fieldType: field.type,
          nestingLevel,
          context: {
            parentFields,
            collectionSlug,
            isNested: nestingLevel > 0,
            fullPath,
            identifierPath,
            estimatedDatabaseName,
            wouldExceedLimit: estimatedDatabaseName.length > DBNAME_POSTGRES_IDENTIFIER_LIMIT,
            parentFieldTypes,
            fieldDepth,
            isInArray,
            isInGroup,
            isInBlocks,
            arrayNestingLevel,
            groupNestingLevel,
            blocksNestingLevel,
          },
        }

        usages.push(usage)
      }

      // Recursively process nested fields based on field type
      if (field.fields && Array.isArray(field.fields)) {
        let newArrayNesting = arrayNestingLevel
        let newGroupNesting = groupNestingLevel
        let newBlocksNesting = blocksNestingLevel

        // Update nesting counters based on field type
        switch (field.type) {
          case 'array':
            newArrayNesting++
            break
          case 'group':
            newGroupNesting++
            break
          case 'blocks':
            newBlocksNesting++
            break
        }

        this.extractFieldUsagesRecursively(
          field.fields,
          usages,
          collectionSlug,
          filePath,
          currentParentFields,
          `${fieldPath}.fields`,
          nestingLevel + 1,
          currentParentFieldTypes,
          newArrayNesting,
          newGroupNesting,
          newBlocksNesting,
        )
      }

      // Handle blocks field type with block definitions
      if (field.type === 'blocks' && field.blocks && Array.isArray(field.blocks)) {
        for (let blockIndex = 0; blockIndex < field.blocks.length; blockIndex++) {
          const block = field.blocks[blockIndex]
          if (block.fields && Array.isArray(block.fields)) {
            const blockPath = `${fieldPath}.blocks[${blockIndex}]`
            const blockParentFields = [...currentParentFields, block.slug || `block_${blockIndex}`]

            this.extractFieldUsagesRecursively(
              block.fields,
              usages,
              collectionSlug,
              filePath,
              blockParentFields,
              `${blockPath}.fields`,
              nestingLevel + 2, // Blocks add extra nesting
              [...currentParentFieldTypes, 'block'],
              arrayNestingLevel,
              groupNestingLevel,
              blocksNestingLevel + 1,
            )
          }
        }
      }
    }
  }

  /**
   * Calculate the full identifier path for a field
   */
  private calculateFullIdentifierPath(
    parentFields: string[],
    fieldName: string,
    dbName?: string,
  ): string {
    const pathSegments = [...parentFields, dbName || fieldName]
    return pathSegments.join('.')
  }

  /**
   * Estimate the actual database column name that would be generated
   */
  private estimateDatabaseColumnName(
    collectionSlug: string,
    fieldPath: string[],
    dbName?: string,
  ): string {
    // This is a simplified estimation of how PayloadCMS generates database column names
    // In reality, the exact algorithm depends on the database adapter and configuration

    const segments: string[] = []

    // Add collection prefix for nested fields
    if (fieldPath.length > 1) {
      segments.push(collectionSlug)
    }

    // Add parent field segments
    for (let i = 0; i < fieldPath.length - 1; i++) {
      segments.push(fieldPath[i])
    }

    // Add final field name (use dbName if provided)
    const finalFieldName = fieldPath[fieldPath.length - 1]
    segments.push(dbName || finalFieldName)

    return segments.join('_')
  }

  /**
   * Analyze the strategic value of a dbName usage based on nesting context
   */
  analyzeStrategicValue(usage: DbNameUsage): {
    isStrategic: boolean
    reasons: string[]
    score: number
  } {
    const reasons: string[] = []
    let score = 0

    const context = usage.context

    // Check identifier length concerns
    if (context.wouldExceedLimit) {
      reasons.push('Prevents database identifier length limit violation')
      score += 10
    }

    if (context.estimatedDatabaseName.length > 50) {
      reasons.push('Significantly reduces identifier length')
      score += 5
    }

    // Check nesting complexity
    if (context.fieldDepth >= 3) {
      reasons.push('Simplifies deeply nested field identifier')
      score += 3
    }

    if (context.isInArray && context.arrayNestingLevel >= 2) {
      reasons.push('Reduces complexity in nested array structures')
      score += 2
    }

    if (context.isInBlocks && context.blocksNestingLevel >= 1) {
      reasons.push('Simplifies block field identifiers')
      score += 2
    }

    // Check for meaningful abbreviation
    if (usage.dbNameValue.length < usage.fieldName.length * 0.7) {
      reasons.push('Provides meaningful abbreviation')
      score += 1
    }

    // Check for redundancy
    if (usage.dbNameValue === usage.fieldName) {
      reasons.push('Redundant - dbName equals field name')
      score -= 5
    }

    if (usage.dbNameValue.toLowerCase() === usage.fieldName.toLowerCase()) {
      reasons.push('Redundant - dbName only differs in case')
      score -= 3
    }

    // Check for field type compatibility
    const incompatibleTypes = ['ui', 'tabs', 'row', 'collapsible']
    if (incompatibleTypes.includes(usage.fieldType)) {
      reasons.push('Field type does not support dbName')
      score -= 10
    }

    return {
      isStrategic: score > 0,
      reasons,
      score,
    }
  }

  /**
   * Generate comprehensive metadata for a dbName usage
   */
  generateUsageMetadata(usage: DbNameUsage): {
    identifierAnalysis: {
      currentLength: number
      estimatedLength: number
      wouldExceedLimit: boolean
      compressionRatio: number
    }
    nestingAnalysis: {
      totalDepth: number
      arrayDepth: number
      groupDepth: number
      blocksDepth: number
      complexityScore: number
    }
    strategicAnalysis: {
      isStrategic: boolean
      reasons: string[]
      score: number
    }
  } {
    const context = usage.context

    // Identifier analysis
    const identifierAnalysis = {
      currentLength: usage.dbNameValue.length,
      estimatedLength: context.estimatedDatabaseName.length,
      wouldExceedLimit: context.wouldExceedLimit,
      compressionRatio:
        usage.fieldName.length > 0 ? usage.dbNameValue.length / usage.fieldName.length : 1,
    }

    // Nesting analysis
    const nestingAnalysis = {
      totalDepth: context.fieldDepth,
      arrayDepth: context.arrayNestingLevel,
      groupDepth: context.groupNestingLevel,
      blocksDepth: context.blocksNestingLevel,
      complexityScore: this.calculateComplexityScore(context),
    }

    // Strategic analysis
    const strategicAnalysis = this.analyzeStrategicValue(usage)

    return {
      identifierAnalysis,
      nestingAnalysis,
      strategicAnalysis,
    }
  }

  /**
   * Calculate a complexity score based on nesting context
   */
  private calculateComplexityScore(context: FieldContext): number {
    let score = 0

    // Base score for field depth
    score += context.fieldDepth * 2

    // Additional score for specific nesting types
    score += context.arrayNestingLevel * 3
    score += context.groupNestingLevel * 2
    score += context.blocksNestingLevel * 4

    // Bonus for multiple nesting types
    const nestingTypes = [context.isInArray, context.isInGroup, context.isInBlocks].filter(
      Boolean,
    ).length

    if (nestingTypes > 1) {
      score += nestingTypes * 2
    }

    return score
  }
}

/**
 * Factory function to create a DbNameUsageExtractor instance
 */
export function createDbNameUsageExtractor(): DbNameUsageExtractor {
  return new DbNameUsageExtractor()
}

/**
 * Enhanced FieldContext interface with additional nesting analysis
 */
export interface EnhancedFieldContext extends FieldContext {
  identifierPath: string
  estimatedDatabaseName: string
  wouldExceedLimit: boolean
  parentFieldTypes: string[]
  fieldDepth: number
  isInArray: boolean
  isInGroup: boolean
  isInBlocks: boolean
  arrayNestingLevel: number
  groupNestingLevel: number
  blocksNestingLevel: number
}

/**
 * Update the DbNameUsage interface to use enhanced context
 */
export interface EnhancedDbNameUsage extends Omit<DbNameUsage, 'context'> {
  context: EnhancedFieldContext
}
