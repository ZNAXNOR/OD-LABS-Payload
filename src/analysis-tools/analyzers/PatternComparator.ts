/**
 * Pattern Comparator
 * Main class that compares local blocks against official Payload CMS patterns
 */

import type {
  Block,
  OfficialPattern,
  PatternComparisonResult,
  MissingFeature,
  Recommendation,
} from '../types'
import { GitHubPatternFetcher } from './GitHubPatternFetcher'
import { StructuralComparator } from './StructuralComparator'
import { FeatureDetector } from './FeatureDetector'

export interface PatternComparatorConfig {
  githubToken?: string
  cacheDir?: string
  cacheTTL?: number
}

export class PatternComparator {
  private fetcher: GitHubPatternFetcher
  private structuralComparator: StructuralComparator
  private featureDetector: FeatureDetector

  constructor(config: PatternComparatorConfig = {}) {
    this.fetcher = new GitHubPatternFetcher({
      token: config.githubToken,
      cacheDir: config.cacheDir,
      cacheTTL: config.cacheTTL,
    })
    this.structuralComparator = new StructuralComparator()
    this.featureDetector = new FeatureDetector()
  }

  /**
   * Fetch official patterns from Payload CMS repositories
   */
  async fetchOfficialPatterns(): Promise<OfficialPattern[]> {
    return this.fetcher.fetchOfficialPatterns()
  }

  /**
   * Compare a local block against an official block
   */
  compareBlock(localBlock: Block, officialBlock: Block): PatternComparisonResult {
    // Structural comparison
    const structuralDifferences = this.structuralComparator.compareStructure(
      localBlock,
      officialBlock,
    )

    // Organization comparison
    const organizationDifferences = this.structuralComparator.compareOrganization(
      localBlock,
      officialBlock,
    )

    // Feature comparison
    const featureDifferences = this.featureDetector.compareFeatures(localBlock, officialBlock)

    return {
      blockSlug: localBlock.slug,
      structuralDifferences,
      featureDifferences,
      organizationDifferences,
    }
  }

  /**
   * Identify missing features across all blocks
   */
  identifyMissingFeatures(localBlocks: Block[], officialBlocks: Block[]): MissingFeature[] {
    return this.featureDetector.identifyMissingFeatures(localBlocks, officialBlocks)
  }

  /**
   * Suggest improvements based on comparison results
   */
  suggestImprovements(comparison: PatternComparisonResult): Recommendation[] {
    const recommendations: Recommendation[] = []
    let priority = 1

    // Recommendations from structural differences
    for (const diff of comparison.structuralDifferences) {
      recommendations.push({
        priority: priority++,
        title: `Align ${diff.type.replace(/-/g, ' ')} with official pattern`,
        description: diff.description,
        codeExample: {
          title: 'Official approach',
          after: diff.officialApproach,
          language: 'typescript',
        },
        estimatedTime: this.estimateTime(diff.type),
      })
    }

    // Recommendations from organization differences
    for (const diff of comparison.organizationDifferences) {
      recommendations.push({
        priority: priority++,
        title: `Improve ${diff.type.replace(/-/g, ' ')}`,
        description: diff.description,
        codeExample: {
          title: 'Recommendation',
          after: diff.recommendation,
          language: 'typescript',
        },
        estimatedTime: this.estimateTime(diff.type),
      })
    }

    // Recommendations from feature differences
    for (const diff of comparison.featureDifferences) {
      if (diff.presentInOfficial && !diff.presentInCurrent) {
        recommendations.push({
          priority: priority++,
          title: `Add ${diff.featureName.replace(/-/g, ' ')}`,
          description: diff.description,
          estimatedTime: this.estimateFeatureTime(diff.featureName),
        })
      }
    }

    return recommendations
  }

  /**
   * Find matching official pattern for a local block
   */
  findMatchingPattern(
    localBlock: Block,
    officialPatterns: OfficialPattern[],
  ): OfficialPattern | null {
    // Try exact slug match first
    const exactMatch = officialPatterns.find((p) => p.blockSlug === localBlock.slug)
    if (exactMatch) {
      return exactMatch
    }

    // Try fuzzy matching based on slug similarity
    const similarPatterns = officialPatterns.filter((p) => {
      const similarity = this.calculateSimilarity(localBlock.slug, p.blockSlug)
      return similarity > 0.6
    })

    if (similarPatterns.length > 0) {
      // Return the most similar one
      const sorted = similarPatterns.sort((a, b) => {
        const simA = this.calculateSimilarity(localBlock.slug, a.blockSlug)
        const simB = this.calculateSimilarity(localBlock.slug, b.blockSlug)
        return simB - simA
      })
      return sorted[0] || null
    }

    return null
  }

  /**
   * Calculate string similarity (simple Levenshtein-based)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) {
      return 1.0
    }

    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0]![j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i]![j] = matrix[i - 1]![j - 1]!
        } else {
          matrix[i]![j] = Math.min(
            matrix[i - 1]![j - 1]! + 1, // substitution
            matrix[i]![j - 1]! + 1, // insertion
            matrix[i - 1]![j]! + 1, // deletion
          )
        }
      }
    }

    return matrix[str2.length]![str1.length]!
  }

  /**
   * Estimate time for structural/organizational changes
   */
  private estimateTime(type: string): string {
    const estimates: Record<string, string> = {
      'field-order': '15 minutes',
      'field-grouping': '30 minutes',
      'nesting-depth': '1 hour',
      'field-organization': '1 hour',
      'naming-convention': '30 minutes',
      'structure-pattern': '2 hours',
    }

    return estimates[type] || '1 hour'
  }

  /**
   * Estimate time for feature additions
   */
  private estimateFeatureTime(feature: string): string {
    const estimates: Record<string, string> = {
      'custom-validation': '30 minutes',
      hooks: '1 hour',
      'access-control': '45 minutes',
      'admin-config': '15 minutes',
      'conditional-fields': '30 minutes',
      'array-fields': '1 hour',
      'group-fields': '30 minutes',
      'nested-blocks': '3 hours',
      relationships: '45 minutes',
      uploads: '1 hour',
      'typescript-interface': '20 minutes',
      localization: '2 hours',
      'default-values': '10 minutes',
      'unique-constraints': '15 minutes',
      indexes: '15 minutes',
      'field-level-access': '45 minutes',
      'admin-descriptions': '20 minutes',
      'field-hooks': '45 minutes',
      'rich-text': '30 minutes',
      tabs: '45 minutes',
      collapsible: '20 minutes',
      'row-layout': '15 minutes',
    }

    return estimates[feature] || '1 hour'
  }

  /**
   * Get rate limit status
   */
  getRateLimit() {
    return this.fetcher.getRateLimit()
  }

  /**
   * Clear pattern cache
   */
  async clearCache(): Promise<void> {
    await this.fetcher.clearCache()
  }
}
