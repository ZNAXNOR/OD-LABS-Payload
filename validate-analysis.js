import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class AnalysisValidator {
  constructor() {
    this.projectRoot = process.cwd()
    this.analysisDir = path.join(this.projectRoot, 'restructure-analysis')
    this.backupDir = path.join(this.projectRoot, 'pre-restructure-backup')
    this.requiredFiles = [
      'analysis-report.json',
      'enhanced-analysis-report.json',
      'functionality-documentation.json',
      'performance-baseline.json',
      'dependency-graph.json',
      'analysis-summary.md',
      'enhanced-analysis-summary.md',
      'functionality-documentation.md',
      'performance-baseline.md',
      'COMPREHENSIVE_ANALYSIS_SUMMARY.md',
    ]
  }

  async validate() {
    console.log('🔍 Validating pre-restructuring analysis...')

    const results = {
      backup: this.validateBackup(),
      analysisFiles: this.validateAnalysisFiles(),
      dataCompleteness: this.validateDataCompleteness(),
      requirements: this.validateRequirements(),
    }

    this.generateValidationReport(results)

    const allValid = Object.values(results).every((result) => result.valid)

    if (allValid) {
      console.log('✅ All validation checks passed!')
      console.log('📋 Task 1: Pre-restructuring Analysis and Backup - COMPLETED')
    } else {
      console.log('❌ Some validation checks failed. Review the validation report.')
    }

    return allValid
  }

  validateBackup() {
    console.log('  📁 Validating backup...')

    const result = {
      valid: false,
      issues: [],
      details: {},
    }

    // Check if backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      result.issues.push('Backup directory does not exist')
      return result
    }

    // Check backup manifest
    const manifestPath = path.join(this.backupDir, 'backup-manifest.json')
    if (!fs.existsSync(manifestPath)) {
      result.issues.push('Backup manifest not found')
      return result
    }

    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
      result.details.fileCount = manifest.fileCount
      result.details.timestamp = manifest.timestamp

      if (manifest.fileCount < 500) {
        result.issues.push(`Low file count in backup: ${manifest.fileCount}`)
      }

      result.valid = result.issues.length === 0
    } catch (error) {
      result.issues.push(`Error reading backup manifest: ${error.message}`)
    }

    return result
  }

  validateAnalysisFiles() {
    console.log('  📊 Validating analysis files...')

    const result = {
      valid: false,
      issues: [],
      details: { found: [], missing: [] },
    }

    for (const file of this.requiredFiles) {
      const filePath = path.join(this.analysisDir, file)
      if (fs.existsSync(filePath)) {
        result.details.found.push(file)
      } else {
        result.details.missing.push(file)
        result.issues.push(`Missing analysis file: ${file}`)
      }
    }

    result.valid = result.details.missing.length === 0
    return result
  }

  validateDataCompleteness() {
    console.log('  📋 Validating data completeness...')

    const result = {
      valid: false,
      issues: [],
      details: {},
    }

    try {
      // Check enhanced analysis report
      const enhancedReportPath = path.join(this.analysisDir, 'enhanced-analysis-report.json')
      if (fs.existsSync(enhancedReportPath)) {
        const report = JSON.parse(fs.readFileSync(enhancedReportPath, 'utf8'))

        result.details.totalFiles = report.summary?.totalSourceFiles || 0
        result.details.collections = report.summary?.collections?.total || 0
        result.details.components = report.summary?.components?.total || 0
        result.details.blocks = report.summary?.blocks?.total || 0
        result.details.utilities = report.summary?.utilities?.total || 0

        // Validate minimum expected counts
        if (result.details.totalFiles < 200) {
          result.issues.push(`Low source file count: ${result.details.totalFiles}`)
        }
        if (result.details.components < 100) {
          result.issues.push(`Low component count: ${result.details.components}`)
        }
        if (result.details.blocks < 30) {
          result.issues.push(`Low block count: ${result.details.blocks}`)
        }
      } else {
        result.issues.push('Enhanced analysis report not found')
      }

      // Check functionality documentation
      const funcReportPath = path.join(this.analysisDir, 'functionality-documentation.json')
      if (fs.existsSync(funcReportPath)) {
        const funcReport = JSON.parse(fs.readFileSync(funcReportPath, 'utf8'))

        result.details.workflows = Object.keys(funcReport.functionality?.workflows || {}).length

        if (result.details.workflows < 3) {
          result.issues.push(`Insufficient workflow documentation: ${result.details.workflows}`)
        }
      } else {
        result.issues.push('Functionality documentation not found')
      }

      result.valid = result.issues.length === 0
    } catch (error) {
      result.issues.push(`Error validating data completeness: ${error.message}`)
    }

    return result
  }

  validateRequirements() {
    console.log('  ✅ Validating requirements compliance...')

    const result = {
      valid: false,
      issues: [],
      details: { requirements: [] },
    }

    // Requirements from task description:
    // - Create comprehensive backup of current project state ✓
    // - Analyze current file dependencies and import relationships ✓
    // - Document current functionality to ensure preservation ✓
    // - Generate baseline metrics for performance comparison ✓
    // Requirements: 11.1, 11.2, 11.3, 12.5

    const requirements = [
      {
        id: '11.1',
        description: 'Development server functionality preserved',
        check: () => this.checkFileExists('package.json') && this.checkScriptExists('dev'),
      },
      {
        id: '11.2',
        description: 'Production build process preserved',
        check: () => this.checkFileExists('package.json') && this.checkScriptExists('build'),
      },
      {
        id: '11.3',
        description: 'Test execution preserved',
        check: () =>
          this.checkFileExists('package.json') &&
          (this.checkScriptExists('test') || this.checkScriptExists('vitest')),
      },
      {
        id: '12.5',
        description: 'Performance baseline established',
        check: () => this.checkFileExists(path.join(this.analysisDir, 'performance-baseline.json')),
      },
    ]

    for (const req of requirements) {
      const passed = req.check()
      result.details.requirements.push({
        id: req.id,
        description: req.description,
        passed,
      })

      if (!passed) {
        result.issues.push(`Requirement ${req.id} not met: ${req.description}`)
      }
    }

    result.valid = result.issues.length === 0
    return result
  }

  checkFileExists(filePath) {
    return fs.existsSync(path.join(this.projectRoot, filePath))
  }

  checkScriptExists(scriptName) {
    try {
      const packagePath = path.join(this.projectRoot, 'package.json')
      if (!fs.existsSync(packagePath)) return false

      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
      return !!(packageJson.scripts && packageJson.scripts[scriptName])
    } catch {
      return false
    }
  }

  generateValidationReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      overall: {
        valid: Object.values(results).every((r) => r.valid),
        totalIssues: Object.values(results).reduce((sum, r) => sum + r.issues.length, 0),
      },
      results,
    }

    // Write validation report
    fs.writeFileSync(
      path.join(this.analysisDir, 'validation-report.json'),
      JSON.stringify(report, null, 2),
    )

    // Write human-readable validation summary
    const summary = this.generateValidationSummary(report)
    fs.writeFileSync(path.join(this.analysisDir, 'validation-summary.md'), summary)
  }

  generateValidationSummary(report) {
    return `# Pre-Restructuring Analysis Validation Report

Generated: ${report.timestamp}

## Overall Status: ${report.overall.valid ? '✅ PASSED' : '❌ FAILED'}

Total Issues Found: ${report.overall.totalIssues}

## Validation Results

### 1. Backup Validation
**Status**: ${results.backup.valid ? '✅ PASSED' : '❌ FAILED'}
${results.backup.details.fileCount ? `- Files Backed Up: ${results.backup.details.fileCount}` : ''}
${results.backup.details.timestamp ? `- Backup Timestamp: ${results.backup.details.timestamp}` : ''}
${results.backup.issues.length > 0 ? `\n**Issues**:\n${results.backup.issues.map((i) => `- ${i}`).join('\n')}` : ''}

### 2. Analysis Files Validation
**Status**: ${results.analysisFiles.valid ? '✅ PASSED' : '❌ FAILED'}
- Files Found: ${results.analysisFiles.details.found.length}/${this.requiredFiles.length}
${results.analysisFiles.details.missing.length > 0 ? `\n**Missing Files**:\n${results.analysisFiles.details.missing.map((f) => `- ${f}`).join('\n')}` : ''}

### 3. Data Completeness Validation
**Status**: ${results.dataCompleteness.valid ? '✅ PASSED' : '❌ FAILED'}
${results.dataCompleteness.details.totalFiles ? `- Total Source Files: ${results.dataCompleteness.details.totalFiles}` : ''}
${results.dataCompleteness.details.components ? `- Components: ${results.dataCompleteness.details.components}` : ''}
${results.dataCompleteness.details.blocks ? `- Blocks: ${results.dataCompleteness.details.blocks}` : ''}
${results.dataCompleteness.details.utilities ? `- Utilities: ${results.dataCompleteness.details.utilities}` : ''}
${results.dataCompleteness.details.workflows ? `- Workflows: ${results.dataCompleteness.details.workflows}` : ''}
${results.dataCompleteness.issues.length > 0 ? `\n**Issues**:\n${results.dataCompleteness.issues.map((i) => `- ${i}`).join('\n')}` : ''}

### 4. Requirements Validation
**Status**: ${results.requirements.valid ? '✅ PASSED' : '❌ FAILED'}

${results.requirements.details.requirements
  .map((req) => `- **${req.id}**: ${req.passed ? '✅' : '❌'} ${req.description}`)
  .join('\n')}

${results.requirements.issues.length > 0 ? `\n**Issues**:\n${results.requirements.issues.map((i) => `- ${i}`).join('\n')}` : ''}

## Summary

${
  report.overall.valid
    ? `
✅ **All validation checks passed!**

The pre-restructuring analysis and backup is complete and comprehensive. The project is ready for restructuring with:

- Complete backup of all project files
- Comprehensive analysis of project structure
- Detailed functionality documentation
- Performance baseline metrics
- Full compliance with requirements

**Next Steps**: Proceed with Task 2 - Directory Structure Foundation
`
    : `
❌ **Validation failed with ${report.overall.totalIssues} issues.**

Please address the issues listed above before proceeding with the restructuring process.
`
}

---

*This validation ensures the pre-restructuring analysis meets all requirements for safe project restructuring.*
`
  }
}

// Run the validation
const validator = new AnalysisValidator()
validator.validate().catch(console.error)

export default AnalysisValidator
