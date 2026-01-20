/**
 * Block Analyzer
 * Main analyzer that orchestrates all block analysis components
 */

import type { Block, BlockAnalysisResult, BlockMetrics, Issue, Suggestion } from '../types'
import { BlockConfigParser } from './BlockConfigParser'
import { FieldValidator } from './FieldValidator'
import { TypingAnalyzer } from './TypingAnalyzer'
import { AccessControlAnalyzer } from './AccessControlAnalyzer'
import { AdminConfigAnalyzer } from './AdminConfigAnalyzer'
import { generateId, calculateComplexityScore } from '../utils'

export class BlockAnalyzer {
  private parser: BlockConfigParser
  private fieldValidator: FieldValidator
  private typingAnalyzer: TypingAnalyzer
  private accessControlAnalyzer: AccessControlAnalyzer
  private adminConfigAnalyzer: AdminConfigAnalyzer

  constructor() {
    this.parser = new BlockConfigParser()
    this.fieldValidator = new FieldValidator()
    this.typingAnalyzer = new TypingAnalyzer()
    this.accessControlAnalyzer = new AccessControlAnalyzer()
    this.adminConfigAnalyzer = new AdminConfigAnalyzer()
  }

  /**
   * Analyze a block configuration file
   */
  async analyzeBlock(blockPath: string): Promise<BlockAnalysisResult> {
    try {
      // Parse the block configuration
      const parsed = await this.parser.parseBlockConfig(blockPath)
      const block = parsed.block

      // Run all analyzers
      const issues: Issue[] = []
      const suggestions: Suggestion[] = []

      // 1. Field validation analysis
      const fieldValidationResults = this.fieldValidator.validateFields(block)
      const fieldValidationIssues = this.convertFieldValidationToIssues(
        fieldValidationResults,
        blockPath,
        block.slug,
      )
      issues.push(...fieldValidationIssues)

      // 2. TypeScript typing analysis
      const typingIssues = this.typingAnalyzer.checkTyping(block)
      const typingIssuesConverted = this.convertTypingIssuesToIssues(
        typingIssues,
        blockPath,
        block.slug,
      )
      issues.push(...typingIssuesConverted)

      // 3. Access control analysis
      const securityIssues = this.accessControlAnalyzer.checkAccessControl(block)
      const securityIssuesConverted = this.convertSecurityIssuesToIssues(
        securityIssues,
        blockPath,
        block.slug,
      )
      issues.push(...securityIssuesConverted)

      // 4. Admin configuration analysis
      const adminConfigIssues = this.adminConfigAnalyzer.checkAdminConfig(block)
      const adminConfigIssuesConverted = this.convertAdminConfigIssuesToIssues(
        adminConfigIssues,
        blockPath,
        block.slug,
      )
      issues.push(...adminConfigIssuesConverted)

      // Generate suggestions
      const typingSuggestions = this.typingAnalyzer.suggestTypingPatterns(block)
      suggestions.push(
        ...typingSuggestions.map((suggestion) => ({
          type: 'improvement' as const,
          title: 'TypeScript Typing Improvement',
          description: suggestion,
          benefit: 'Better type safety and IDE support',
          effort: 'low' as const,
        })),
      )

      const accessControlSuggestions = this.accessControlAnalyzer.suggestImprovements(block)
      suggestions.push(
        ...accessControlSuggestions.map((suggestion) => ({
          type: 'improvement' as const,
          title: 'Access Control Improvement',
          description: suggestion,
          benefit: 'Enhanced security and data protection',
          effort: 'medium' as const,
        })),
      )

      const adminConfigSuggestions = this.adminConfigAnalyzer.suggestImprovements(block)
      suggestions.push(
        ...adminConfigSuggestions.map((suggestion) => ({
          type: 'improvement' as const,
          title: 'Admin UI Improvement',
          description: suggestion,
          benefit: 'Better editor experience and usability',
          effort: 'low' as const,
        })),
      )

      // Calculate metrics
      const metrics = this.calculateMetrics(block)

      return {
        blockPath,
        blockSlug: block.slug,
        issues,
        suggestions,
        metrics,
      }
    } catch (error) {
      // Return error result
      return {
        blockPath,
        blockSlug: 'unknown',
        issues: [
          {
            id: generateId('error'),
            type: 'missing-validation',
            severity: 'critical',
            category: 'best-practice',
            title: 'Block Analysis Failed',
            description: `Failed to analyze block: ${(error as Error).message}`,
            location: {
              file: blockPath,
            },
            remediation:
              'Check the block configuration file for syntax errors or invalid structure.',
          },
        ],
        suggestions: [],
        metrics: {
          fieldCount: 0,
          nestedDepth: 0,
          hasAccessControl: false,
          hasValidation: false,
          hasInterfaceName: false,
          complexityScore: 0,
        },
      }
    }
  }

  /**
   * Validate fields in a block
   */
  validateFields(block: Block) {
    return this.fieldValidator.validateFields(block)
  }

  /**
   * Check TypeScript typing
   */
  checkTyping(block: Block) {
    return this.typingAnalyzer.checkTyping(block)
  }

  /**
   * Check access control
   */
  checkAccessControl(block: Block) {
    return this.accessControlAnalyzer.checkAccessControl(block)
  }

  /**
   * Check admin configuration
   */
  checkAdminConfig(block: Block) {
    return this.adminConfigAnalyzer.checkAdminConfig(block)
  }

  /**
   * Calculate block metrics
   */
  private calculateMetrics(block: Block): BlockMetrics {
    const fieldCount = this.fieldValidator.countTotalFields(block)
    const nestedDepth = this.fieldValidator.calculateMaxDepth(block)
    const hasAccessControl = block.access !== undefined
    const hasValidation = this.fieldValidator.getFieldsWithValidation(block).length > 0
    const hasInterfaceName = block.interfaceName !== undefined

    const complexityScore = calculateComplexityScore({
      fieldCount,
      nestedDepth,
      conditionalFields: 0, // TODO: Count conditional fields
      validationRules: this.fieldValidator.getFieldsWithValidation(block).length,
    })

    return {
      fieldCount,
      nestedDepth,
      hasAccessControl,
      hasValidation,
      hasInterfaceName,
      complexityScore,
    }
  }

  /**
   * Convert field validation results to issues
   */
  private convertFieldValidationToIssues(
    results: any[],
    blockPath: string,
    _blockSlug: string,
  ): Issue[] {
    const issues: Issue[] = []

    results.forEach((result) => {
      if (result.missingValidations.length > 0) {
        issues.push({
          id: generateId('validation'),
          type: 'missing-validation',
          severity: result.severity,
          category: 'best-practice',
          title: 'Missing Field Validation',
          description: `Field '${result.fieldPath}' is missing validation: ${result.missingValidations.join(', ')}`,
          location: {
            file: blockPath,
            snippet: `Field: ${result.fieldPath}`,
          },
          remediation: `Add validation rules to the field:\n${result.missingValidations.map((v: string) => `- ${v}`).join('\n')}`,
        })
      }
    })

    return issues
  }

  /**
   * Convert typing issues to standard issues
   */
  private convertTypingIssuesToIssues(
    typingIssues: any[],
    blockPath: string,
    _blockSlug: string,
  ): Issue[] {
    return typingIssues.map((issue) => ({
      id: generateId('typing'),
      type: issue.type,
      severity: issue.type === 'missing-interface-name' ? 'high' : 'medium',
      category: 'typing' as const,
      title: 'TypeScript Typing Issue',
      description: issue.suggestion,
      location: {
        file: blockPath,
        snippet: issue.location,
      },
      remediation: issue.suggestion,
    }))
  }

  /**
   * Convert security issues to standard issues
   */
  private convertSecurityIssuesToIssues(
    securityIssues: any[],
    blockPath: string,
    _blockSlug: string,
  ): Issue[] {
    return securityIssues.map((issue) => ({
      id: generateId('security'),
      type: issue.type,
      severity: issue.severity,
      category: 'security' as const,
      title: 'Security Issue',
      description: issue.description,
      location: {
        file: blockPath,
      },
      remediation: issue.remediation,
    }))
  }

  /**
   * Convert admin config issues to standard issues
   */
  private convertAdminConfigIssuesToIssues(
    adminConfigIssues: any[],
    blockPath: string,
    _blockSlug: string,
  ): Issue[] {
    return adminConfigIssues.map((issue) => ({
      id: generateId('admin-config'),
      type: 'missing-validation', // Using generic type
      severity: 'low' as const,
      category: 'best-practice' as const,
      title: 'Admin Configuration Issue',
      description: `${issue.fieldPath}: ${issue.type}`,
      location: {
        file: blockPath,
        snippet: issue.fieldPath,
      },
      remediation: issue.suggestion,
    }))
  }
}
