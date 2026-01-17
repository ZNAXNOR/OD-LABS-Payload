import { existsSync, statSync } from 'fs'
import { resolve } from 'path'
import chalk from 'chalk'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateDirectories(blocksDir: string, componentsDir: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  }

  // Validate blocks directory
  const resolvedBlocksDir = resolve(blocksDir)
  if (!existsSync(resolvedBlocksDir)) {
    result.isValid = false
    result.errors.push(`Blocks directory does not exist: ${resolvedBlocksDir}`)
  } else if (!statSync(resolvedBlocksDir).isDirectory()) {
    result.isValid = false
    result.errors.push(`Blocks path is not a directory: ${resolvedBlocksDir}`)
  }

  // Validate components directory
  const resolvedComponentsDir = resolve(componentsDir)
  if (!existsSync(resolvedComponentsDir)) {
    result.isValid = false
    result.errors.push(`Components directory does not exist: ${resolvedComponentsDir}`)
  } else if (!statSync(resolvedComponentsDir).isDirectory()) {
    result.isValid = false
    result.errors.push(`Components path is not a directory: ${resolvedComponentsDir}`)
  }

  return result
}

export function validateOutputPath(outputPath: string, format: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  }

  if (!outputPath) {
    result.isValid = false
    result.errors.push(`Output path is required for ${format} format`)
    return result
  }

  const resolvedPath = resolve(outputPath)
  const expectedExtension = format === 'json' ? '.json' : '.html'

  if (!resolvedPath.endsWith(expectedExtension)) {
    result.warnings.push(
      `Output file should have ${expectedExtension} extension for ${format} format`,
    )
  }

  // Check if parent directory exists
  const parentDir = resolve(resolvedPath, '..')
  if (!existsSync(parentDir)) {
    result.isValid = false
    result.errors.push(`Output directory does not exist: ${parentDir}`)
  }

  return result
}

export function printValidationResults(result: ValidationResult): void {
  if (result.errors.length > 0) {
    console.error(chalk.red('Validation Errors:'))
    result.errors.forEach((error) => {
      console.error(chalk.red(`  ✗ ${error}`))
    })
  }

  if (result.warnings.length > 0) {
    console.warn(chalk.yellow('Validation Warnings:'))
    result.warnings.forEach((warning) => {
      console.warn(chalk.yellow(`  ⚠ ${warning}`))
    })
  }
}
