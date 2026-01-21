/**
 * Project-wide separation of concerns validation
 *
 * This script validates that the entire project follows proper separation of concerns
 * between frontend, backend, and shared code.
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import { validateFileSeparation } from './separationOfConcerns'

interface ProjectValidationResult {
  totalFiles: number
  validFiles: number
  invalidFiles: number
  violations: Array<{
    file: string
    violations: string[]
    warnings: string[]
  }>
}

/**
 * Extracts import statements from a TypeScript/JavaScript file
 */
function extractImports(fileContent: string): string[] {
  const imports: string[] = []

  // Match import statements
  const importRegex =
    /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"]([^'"]+)['"]/g

  let match
  while ((match = importRegex.exec(fileContent)) !== null) {
    if (match[1]) {
      imports.push(match[1])
    }
  }

  // Match require statements
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g
  while ((match = requireRegex.exec(fileContent)) !== null) {
    if (match[1]) {
      imports.push(match[1])
    }
  }

  return imports
}

/**
 * Recursively gets all TypeScript/JavaScript files in a directory
 */
function getSourceFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      // Skip node_modules and other non-source directories
      if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(entry)) {
        getSourceFiles(fullPath, files)
      }
    } else if (stat.isFile()) {
      const ext = extname(entry)
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        files.push(fullPath)
      }
    }
  }

  return files
}

/**
 * Validates separation of concerns for the entire project
 */
export function validateProject(projectRoot: string = process.cwd()): ProjectValidationResult {
  const srcDir = join(projectRoot, 'src')
  const sourceFiles = getSourceFiles(srcDir)

  const result: ProjectValidationResult = {
    totalFiles: sourceFiles.length,
    validFiles: 0,
    invalidFiles: 0,
    violations: [],
  }

  for (const filePath of sourceFiles) {
    try {
      const fileContent = readFileSync(filePath, 'utf-8')
      const imports = extractImports(fileContent)
      const relativePath = filePath.replace(projectRoot, '').replace(/\\/g, '/')

      const validation = validateFileSeparation(relativePath, imports)

      if (validation.isValid) {
        result.validFiles++
      } else {
        result.invalidFiles++
        result.violations.push({
          file: relativePath,
          violations: validation.violations,
          warnings: validation.warnings,
        })
      }
    } catch (error) {
      // Skip files that can't be read
      console.warn(`Could not validate file: ${filePath}`)
    }
  }

  return result
}

/**
 * Prints a formatted validation report
 */
export function printValidationReport(result: ProjectValidationResult): void {
  console.log('\n=== Separation of Concerns Validation Report ===\n')

  console.log(`Total files analyzed: ${result.totalFiles}`)
  console.log(`Valid files: ${result.validFiles}`)
  console.log(`Invalid files: ${result.invalidFiles}`)

  if (result.violations.length > 0) {
    console.log('\n=== Violations ===\n')

    for (const violation of result.violations) {
      console.log(`File: ${violation.file}`)

      if (violation.violations.length > 0) {
        console.log('  Violations:')
        for (const v of violation.violations) {
          console.log(`    - ${v}`)
        }
      }

      if (violation.warnings.length > 0) {
        console.log('  Warnings:')
        for (const w of violation.warnings) {
          console.log(`    - ${w}`)
        }
      }

      console.log('')
    }
  } else {
    console.log('\n✅ No separation of concerns violations found!')
  }
}

// CLI usage
if (require.main === module) {
  const result = validateProject()
  printValidationReport(result)

  // Exit with error code if violations found
  process.exit(result.invalidFiles > 0 ? 1 : 0)
}
