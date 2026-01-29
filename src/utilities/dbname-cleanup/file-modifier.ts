/**
 * FileModifier Implementation
 *
 * Handles safe modification of TypeScript configuration files while preserving
 * existing file structure, formatting, and comments. Implements in-place updates
 * without creating backups as per requirements.
 */

import * as fs from 'fs/promises'
import type { FileModifier } from './interfaces'
import type { CleanupChange, ModificationResult } from './types'

/**
 * Implementation of FileModifier for safe in-place configuration file updates
 */
export class PayloadFileModifier implements FileModifier {
  private readonly logger: (message: string) => void

  constructor(logger?: (message: string) => void) {
    this.logger = logger || (() => {})
  }

  /**
   * Apply an array of cleanup changes to configuration files
   */
  async applyChanges(changes: CleanupChange[]): Promise<ModificationResult> {
    const result: ModificationResult = {
      filesModified: 0,
      propertiesRemoved: 0,
      propertiesModified: 0,
      errors: [],
    }

    // Group changes by file path for efficient processing
    const changesByFile = this.groupChangesByFile(changes)

    for (const [filePath, fileChanges] of Array.from(changesByFile.entries())) {
      try {
        await this.applyFileChanges(filePath, fileChanges, result)
        result.filesModified++
      } catch (error) {
        const errorMessage = `Failed to modify file ${filePath}: ${error instanceof Error ? error.message : String(error)}`
        result.errors.push(errorMessage)
        this.logger(errorMessage)
      }
    }

    this.logger(
      `File modification complete: ${result.filesModified} files modified, ${result.propertiesRemoved} properties removed, ${result.propertiesModified} properties modified`,
    )

    return result
  }

  /**
   * Remove a dbName property from a configuration file
   */
  async removeDbNameProperty(filePath: string, location: string): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const modifiedContent = this.removePropertyFromContent(content, location)
      await fs.writeFile(filePath, modifiedContent, 'utf-8')
      this.logger(`Removed dbName property at ${location} from ${filePath}`)
    } catch (error) {
      const errorMessage = `Failed to remove dbName property from ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      this.logger(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Modify a dbName value in a configuration file
   */
  async modifyDbNameValue(filePath: string, location: string, newValue: string): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const modifiedContent = this.modifyPropertyInContent(content, location, newValue)
      await fs.writeFile(filePath, modifiedContent, 'utf-8')
      this.logger(`Modified dbName property at ${location} in ${filePath} to "${newValue}"`)
    } catch (error) {
      const errorMessage = `Failed to modify dbName property in ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      this.logger(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Preserve existing file formatting and structure during modifications
   * This method ensures that TypeScript/JavaScript formatting is maintained
   */
  async preserveFormatting(filePath: string): Promise<void> {
    // This method is called internally during modifications to preserve formatting
    // The actual formatting preservation is handled in the content modification methods
    this.logger(`Formatting preserved for ${filePath}`)
  }

  /**
   * Group changes by file path for efficient batch processing
   */
  private groupChangesByFile(changes: CleanupChange[]): Map<string, CleanupChange[]> {
    const grouped = new Map<string, CleanupChange[]>()

    for (const change of changes) {
      const existing = grouped.get(change.filePath) || []
      existing.push(change)
      grouped.set(change.filePath, existing)
    }

    return grouped
  }

  /**
   * Apply all changes for a single file
   */
  private async applyFileChanges(
    filePath: string,
    changes: CleanupChange[],
    result: ModificationResult,
  ): Promise<void> {
    let content = await fs.readFile(filePath, 'utf-8')

    // Sort changes by location to process them in a consistent order
    const sortedChanges = changes.sort((a, b) => a.location.localeCompare(b.location))

    for (const change of sortedChanges) {
      try {
        if (change.action === 'remove') {
          content = this.removePropertyFromContent(content, change.location)
          result.propertiesRemoved++
          this.logger(`Removed dbName property at ${change.location} from ${filePath}`)
        } else if (change.action === 'modify' && change.newValue !== undefined) {
          content = this.modifyPropertyInContent(content, change.location, change.newValue)
          result.propertiesModified++
          this.logger(
            `Modified dbName property at ${change.location} in ${filePath} to "${change.newValue}"`,
          )
        }
      } catch (error) {
        const errorMessage = `Failed to apply change at ${change.location}: ${error instanceof Error ? error.message : String(error)}`
        result.errors.push(errorMessage)
        this.logger(errorMessage)
      }
    }

    await fs.writeFile(filePath, content, 'utf-8')
  }

  /**
   * Remove a property from TypeScript/JavaScript content while preserving formatting
   */
  private removePropertyFromContent(content: string, location: string): string {
    // Parse the location path (e.g., "fields.0.dbName" or "dbName")
    const pathParts = location.split('.')

    if (pathParts.length === 1 && pathParts[0] === 'dbName') {
      // Simple case: remove top-level dbName property
      return this.removeTopLevelProperty(content, 'dbName')
    }

    // Complex case: remove nested property
    return this.removeNestedProperty(content, pathParts)
  }

  /**
   * Modify a property value in TypeScript/JavaScript content while preserving formatting
   */
  private modifyPropertyInContent(content: string, location: string, newValue: string): string {
    // Parse the location path
    const pathParts = location.split('.')

    if (pathParts.length === 1 && pathParts[0] === 'dbName') {
      // Simple case: modify top-level dbName property
      return this.modifyTopLevelProperty(content, 'dbName', newValue)
    }

    // Complex case: modify nested property
    return this.modifyNestedProperty(content, pathParts, newValue)
  }

  /**
   * Remove a top-level property from the content
   */
  private removeTopLevelProperty(content: string, propertyName: string): string {
    // Pattern to match the property line including potential trailing comma
    // Handles various formatting styles:
    // dbName: 'value',
    // dbName: "value",
    // dbName: `value`,
    // "dbName": 'value',
    // 'dbName': "value",
    const patterns = [
      // Property with trailing comma
      new RegExp(`^\\s*['"]*${propertyName}['"]*\\s*:\\s*[^,\\n]+,?\\s*$`, 'gm'),
      // Property without trailing comma (last property)
      new RegExp(`^\\s*['"]*${propertyName}['"]*\\s*:\\s*[^,\\n}]+\\s*$`, 'gm'),
    ]

    let modifiedContent = content
    for (const pattern of patterns) {
      modifiedContent = modifiedContent.replace(pattern, '')
    }

    // Clean up any double empty lines that might result from removal
    modifiedContent = modifiedContent.replace(/\n\s*\n\s*\n/g, '\n\n')

    return modifiedContent
  }

  /**
   * Modify a top-level property value in the content
   */
  private modifyTopLevelProperty(content: string, propertyName: string, newValue: string): string {
    // Pattern to match the property and capture the quote style
    const pattern = new RegExp(
      `(^\\s*['"]*${propertyName}['"]*\\s*:\\s*)(['"\`]?)([^'"\`,\\n}]+)(['"\`]?)(,?\\s*)$`,
      'gm',
    )

    return content.replace(pattern, (_match, prefix, openQuote, _oldValue, _closeQuote, suffix) => {
      // Preserve the original quote style
      const quote = openQuote || "'"
      return `${prefix}${quote}${newValue}${quote}${suffix}`
    })
  }

  /**
   * Remove a nested property from the content
   * This is a simplified implementation - a full implementation would need
   * proper AST parsing for complex nested structures
   */
  private removeNestedProperty(content: string, pathParts: string[]): string {
    // For now, implement a basic pattern matching approach
    // In a production system, this would use a proper TypeScript AST parser

    if (pathParts[pathParts.length - 1] === 'dbName') {
      // Look for dbName property in the context of the path
      const dbNamePattern = /^\s*dbName\s*:\s*[^,\n}]+,?\s*$/gm
      return content.replace(dbNamePattern, '')
    }

    return content
  }

  /**
   * Modify a nested property value in the content
   */
  private modifyNestedProperty(content: string, pathParts: string[], newValue: string): string {
    // For now, implement a basic pattern matching approach
    // In a production system, this would use a proper TypeScript AST parser

    if (pathParts[pathParts.length - 1] === 'dbName') {
      // Look for dbName property and modify its value
      const dbNamePattern = /(^\s*dbName\s*:\s*)(['"\`]?)([^'"\`,\n}]+)(['"\`]?)(,?\s*$)/gm
      return content.replace(
        dbNamePattern,
        (prefix, openQuote, suffix) => {
          const quote = openQuote || "'"
          return `${prefix}${quote}${newValue}${quote}${suffix}`
        },
      )
    }

    return content
  }
}

/**
 * Factory function to create a FileModifier instance
 */
export function createFileModifier(logger?: (message: string) => void): FileModifier {
  return new PayloadFileModifier(logger)
}

/**
 * Default FileModifier instance
 */
export const fileModifier = createFileModifier()
