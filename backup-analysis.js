#!/usr/bin/env node

/**
 * Pre-restructuring Analysis and Backup Script
 *
 * This script performs comprehensive analysis and backup of the PayloadCMS project
 * before restructuring to ensure all functionality is preserved.
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class ProjectAnalyzer {
  constructor() {
    this.projectRoot = process.cwd()
    this.backupDir = path.join(this.projectRoot, 'pre-restructure-backup')
    this.analysisDir = path.join(this.projectRoot, 'restructure-analysis')
    this.results = {
      timestamp: new Date().toISOString(),
      fileCount: 0,
      dependencies: new Map(),
      imports: new Map(),
      exports: new Map(),
      collections: [],
      components: [],
      blocks: [],
      utilities: [],
      tests: [],
      performance: {},
      functionality: {},
    }
  }

  async run() {
    console.log('🚀 Starting pre-restructuring analysis and backup...')

    try {
      await this.createDirectories()
      await this.createBackup()
      await this.analyzeProject()
      await this.generateReport()

      console.log('✅ Analysis and backup completed successfully!')
      console.log(`📁 Backup location: ${this.backupDir}`)
      console.log(`📊 Analysis report: ${path.join(this.analysisDir, 'analysis-report.json')}`)
    } catch (error) {
      console.error('❌ Error during analysis:', error.message)
      process.exit(1)
    }
  }

  async createDirectories() {
    console.log('📁 Creating backup and analysis directories...')

    if (fs.existsSync(this.backupDir)) {
      fs.rmSync(this.backupDir, { recursive: true, force: true })
    }
    if (fs.existsSync(this.analysisDir)) {
      fs.rmSync(this.analysisDir, { recursive: true, force: true })
    }

    fs.mkdirSync(this.backupDir, { recursive: true })
    fs.mkdirSync(this.analysisDir, { recursive: true })
  }

  async createBackup() {
    console.log('💾 Creating comprehensive project backup...')

    const excludePatterns = [
      'node_modules',
      '.next',
      '.git',
      'pre-restructure-backup',
      'restructure-analysis',
      '*.log',
      '.env.local',
      '.env.production',
      'coverage',
      'dist',
      'build',
    ]

    // Create backup using rsync-like functionality
    this.copyDirectory(this.projectRoot, this.backupDir, excludePatterns)

    // Create a manifest of backed up files
    const manifest = this.createBackupManifest(this.backupDir)
    fs.writeFileSync(
      path.join(this.backupDir, 'backup-manifest.json'),
      JSON.stringify(manifest, null, 2),
    )

    console.log(`✅ Backup created with ${manifest.fileCount} files`)
  }

  copyDirectory(src, dest, excludePatterns = []) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }

    const items = fs.readdirSync(src)

    for (const item of items) {
      const srcPath = path.join(src, item)
      const destPath = path.join(dest, item)

      // Check if item should be excluded
      if (
        excludePatterns.some((pattern) => {
          if (pattern.includes('*')) {
            const regex = new RegExp(pattern.replace(/\*/g, '.*'))
            return regex.test(item)
          }
          return item === pattern
        })
      ) {
        continue
      }

      const stat = fs.statSync(srcPath)

      if (stat.isDirectory()) {
        this.copyDirectory(srcPath, destPath, excludePatterns)
      } else {
        fs.copyFileSync(srcPath, destPath)
        this.results.fileCount++
      }
    }
  }

  createBackupManifest(backupPath) {
    const manifest = {
      timestamp: new Date().toISOString(),
      fileCount: 0,
      files: [],
    }

    const scanDirectory = (dir, relativePath = '') => {
      const items = fs.readdirSync(dir)

      for (const item of items) {
        const fullPath = path.join(dir, item)
        const relPath = path.join(relativePath, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          scanDirectory(fullPath, relPath)
        } else {
          manifest.files.push({
            path: relPath,
            size: stat.size,
            modified: stat.mtime.toISOString(),
          })
          manifest.fileCount++
        }
      }
    }

    scanDirectory(backupPath)
    return manifest
  }

  async analyzeProject() {
    console.log('🔍 Analyzing project structure and dependencies...')

    await this.analyzeFileStructure()
    await this.analyzeImportsExports()
    await this.analyzePayloadConfig()
    await this.analyzeComponents()
    await this.analyzeTests()
    await this.generatePerformanceBaseline()
  }

  analyzeFileStructure() {
    console.log('📂 Analyzing file structure...')

    const srcPath = path.join(this.projectRoot, 'src')
    if (!fs.existsSync(srcPath)) {
      console.warn('⚠️  No src directory found')
      return
    }

    this.scanDirectory(srcPath, 'src')
  }

  scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const relPath = path.join(relativePath, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        this.scanDirectory(fullPath, relPath)
      } else if (this.isSourceFile(item)) {
        this.analyzeSourceFile(fullPath, relPath)
      }
    }
  }

  isSourceFile(filename) {
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs']
    return extensions.some((ext) => filename.endsWith(ext))
  }

  analyzeSourceFile(filePath, relativePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const analysis = this.parseSourceFile(content, relativePath)

      // Categorize files
      if (relativePath.includes('/collections/')) {
        this.results.collections.push(analysis)
      } else if (relativePath.includes('/components/')) {
        this.results.components.push(analysis)
      } else if (relativePath.includes('/blocks/')) {
        this.results.blocks.push(analysis)
      } else if (relativePath.includes('/utilities/')) {
        this.results.utilities.push(analysis)
      } else if (relativePath.includes('test') || relativePath.includes('spec')) {
        this.results.tests.push(analysis)
      }
    } catch (error) {
      console.warn(`⚠️  Could not analyze ${relativePath}: ${error.message}`)
    }
  }

  parseSourceFile(content, filePath) {
    const analysis = {
      path: filePath,
      imports: [],
      exports: [],
      dependencies: [],
      functions: [],
      components: [],
      hooks: [],
      types: [],
    }

    // Parse imports
    const importRegex =
      /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"`]([^'"`]+)['"`]/g
    let match
    while ((match = importRegex.exec(content)) !== null) {
      analysis.imports.push(match[1])
      if (!match[1].startsWith('.') && !match[1].startsWith('/')) {
        analysis.dependencies.push(match[1])
      }
    }

    // Parse exports
    const exportRegex =
      /export\s+(?:default\s+)?(?:const|let|var|function|class|interface|type)\s+(\w+)/g
    while ((match = exportRegex.exec(content)) !== null) {
      analysis.exports.push(match[1])
    }

    // Parse React components
    const componentRegex = /(?:function|const)\s+([A-Z]\w*)\s*(?:\(|=)/g
    while ((match = componentRegex.exec(content)) !== null) {
      analysis.components.push(match[1])
    }

    // Parse hooks
    const hookRegex = /(?:function|const)\s+(use[A-Z]\w*)\s*(?:\(|=)/g
    while ((match = hookRegex.exec(content)) !== null) {
      analysis.hooks.push(match[1])
    }

    // Parse TypeScript types/interfaces
    const typeRegex = /(?:type|interface)\s+(\w+)/g
    while ((match = typeRegex.exec(content)) !== null) {
      analysis.types.push(match[1])
    }

    return analysis
  }

  analyzeImportsExports() {
    console.log('🔗 Analyzing import/export relationships...')

    // Build dependency graph
    const dependencyGraph = new Map()

    ;[
      ...this.results.collections,
      ...this.results.components,
      ...this.results.blocks,
      ...this.results.utilities,
    ].forEach((file) => {
      dependencyGraph.set(file.path, {
        imports: file.imports,
        exports: file.exports,
        dependencies: file.dependencies,
      })
    })

    this.results.dependencies = dependencyGraph
  }

  analyzePayloadConfig() {
    console.log('⚙️  Analyzing Payload configuration...')

    const configPath = path.join(this.projectRoot, 'src', 'payload.config.ts')
    if (fs.existsSync(configPath)) {
      try {
        const content = fs.readFileSync(configPath, 'utf8')
        this.results.functionality.payloadConfig = {
          path: configPath,
          collections: this.extractCollectionNames(content),
          globals: this.extractGlobalNames(content),
          plugins: this.extractPluginNames(content),
        }
      } catch (error) {
        console.warn('⚠️  Could not analyze payload.config.ts:', error.message)
      }
    }
  }

  extractCollectionNames(content) {
    const collections = []
    const collectionRegex = /collections:\s*\[([\s\S]*?)\]/
    const match = content.match(collectionRegex)
    if (match) {
      const collectionList = match[1]
      const nameRegex = /(\w+)(?:\s*,|\s*\])/g
      let nameMatch
      while ((nameMatch = nameRegex.exec(collectionList)) !== null) {
        collections.push(nameMatch[1])
      }
    }
    return collections
  }

  extractGlobalNames(content) {
    const globals = []
    const globalRegex = /globals:\s*\[([\s\S]*?)\]/
    const match = content.match(globalRegex)
    if (match) {
      const globalList = match[1]
      const nameRegex = /(\w+)(?:\s*,|\s*\])/g
      let nameMatch
      while ((nameMatch = nameRegex.exec(globalList)) !== null) {
        globals.push(nameMatch[1])
      }
    }
    return globals
  }

  extractPluginNames(content) {
    const plugins = []
    const pluginRegex = /plugins:\s*\[([\s\S]*?)\]/
    const match = content.match(pluginRegex)
    if (match) {
      // Extract plugin function calls
      const pluginList = match[1]
      const nameRegex = /(\w+)\s*\(/g
      let nameMatch
      while ((nameMatch = nameRegex.exec(pluginList)) !== null) {
        plugins.push(nameMatch[1])
      }
    }
    return plugins
  }

  analyzeComponents() {
    console.log('🧩 Analyzing React components...')

    this.results.functionality.components = {
      total: this.results.components.length,
      byCategory: this.categorizeComponents(),
      dependencies: this.analyzeComponentDependencies(),
    }
  }

  categorizeComponents() {
    const categories = {
      ui: [],
      blocks: [],
      layout: [],
      forms: [],
      admin: [],
      other: [],
    }

    this.results.components.forEach((component) => {
      if (component.path.includes('/ui/')) {
        categories.ui.push(component.path)
      } else if (component.path.includes('/blocks/')) {
        categories.blocks.push(component.path)
      } else if (component.path.includes('/layout/')) {
        categories.layout.push(component.path)
      } else if (component.path.includes('/form')) {
        categories.forms.push(component.path)
      } else if (component.path.includes('/admin/')) {
        categories.admin.push(component.path)
      } else {
        categories.other.push(component.path)
      }
    })

    return categories
  }

  analyzeComponentDependencies() {
    const dependencies = new Map()

    this.results.components.forEach((component) => {
      const deps = component.imports.filter(
        (imp) => imp.startsWith('./') || imp.startsWith('../') || imp.startsWith('src/'),
      )
      dependencies.set(component.path, deps)
    })

    return dependencies
  }

  analyzeTests() {
    console.log('🧪 Analyzing test files...')

    this.results.functionality.tests = {
      total: this.results.tests.length,
      byType: this.categorizeTests(),
      coverage: this.analyzeTestCoverage(),
    }
  }

  categorizeTests() {
    const types = {
      unit: [],
      integration: [],
      e2e: [],
      performance: [],
      pbt: [],
    }

    this.results.tests.forEach((test) => {
      if (test.path.includes('/unit/')) {
        types.unit.push(test.path)
      } else if (test.path.includes('/int/')) {
        types.integration.push(test.path)
      } else if (test.path.includes('/e2e/')) {
        types.e2e.push(test.path)
      } else if (test.path.includes('/performance/')) {
        types.performance.push(test.path)
      } else if (test.path.includes('/pbt/')) {
        types.pbt.push(test.path)
      }
    })

    return types
  }

  analyzeTestCoverage() {
    // Basic coverage analysis - count test files vs source files
    const sourceFiles =
      this.results.components.length +
      this.results.collections.length +
      this.results.blocks.length +
      this.results.utilities.length

    const testFiles = this.results.tests.length

    return {
      sourceFiles,
      testFiles,
      ratio: sourceFiles > 0 ? (testFiles / sourceFiles).toFixed(2) : 0,
    }
  }

  generatePerformanceBaseline() {
    console.log('📊 Generating performance baseline...')

    try {
      // Get package.json info
      const packagePath = path.join(this.projectRoot, 'package.json')
      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
        this.results.performance.dependencies = Object.keys(packageJson.dependencies || {}).length
        this.results.performance.devDependencies = Object.keys(
          packageJson.devDependencies || {},
        ).length
      }

      // Analyze bundle size potential
      this.results.performance.fileMetrics = {
        totalSourceFiles: this.results.fileCount,
        componentFiles: this.results.components.length,
        utilityFiles: this.results.utilities.length,
        testFiles: this.results.tests.length,
      }

      // Check for common performance patterns
      this.results.performance.patterns = this.analyzePerformancePatterns()
    } catch (error) {
      console.warn('⚠️  Could not generate performance baseline:', error.message)
    }
  }

  analyzePerformancePatterns() {
    const patterns = {
      dynamicImports: 0,
      lazyComponents: 0,
      memoizedComponents: 0,
      useCallbackUsage: 0,
      useMemoUsage: 0,
    }

    ;[...this.results.components, ...this.results.utilities].forEach((file) => {
      try {
        const filePath = path.join(this.projectRoot, file.path)
        const content = fs.readFileSync(filePath, 'utf8')

        if (content.includes('import(')) patterns.dynamicImports++
        if (content.includes('React.lazy') || content.includes('lazy(')) patterns.lazyComponents++
        if (content.includes('React.memo') || content.includes('memo('))
          patterns.memoizedComponents++
        if (content.includes('useCallback')) patterns.useCallbackUsage++
        if (content.includes('useMemo')) patterns.useMemoUsage++
      } catch (error) {
        // Skip files that can't be read
      }
    })

    return patterns
  }

  async generateReport() {
    console.log('📋 Generating analysis report...')

    const report = {
      metadata: {
        timestamp: this.results.timestamp,
        projectRoot: this.projectRoot,
        backupLocation: this.backupDir,
        analysisVersion: '1.0.0',
      },
      summary: {
        totalFiles: this.results.fileCount,
        collections: this.results.collections.length,
        components: this.results.components.length,
        blocks: this.results.blocks.length,
        utilities: this.results.utilities.length,
        tests: this.results.tests.length,
      },
      structure: {
        collections: this.results.collections.map((c) => ({ path: c.path, exports: c.exports })),
        components: this.results.components.map((c) => ({
          path: c.path,
          components: c.components,
        })),
        blocks: this.results.blocks.map((b) => ({ path: b.path, exports: b.exports })),
        utilities: this.results.utilities.map((u) => ({ path: u.path, exports: u.exports })),
      },
      dependencies: Object.fromEntries(this.results.dependencies),
      functionality: this.results.functionality,
      performance: this.results.performance,
      recommendations: this.generateRecommendations(),
    }

    // Write detailed report
    fs.writeFileSync(
      path.join(this.analysisDir, 'analysis-report.json'),
      JSON.stringify(report, null, 2),
    )

    // Write human-readable summary
    const summary = this.generateHumanReadableSummary(report)
    fs.writeFileSync(path.join(this.analysisDir, 'analysis-summary.md'), summary)

    // Write dependency graph
    fs.writeFileSync(
      path.join(this.analysisDir, 'dependency-graph.json'),
      JSON.stringify(Object.fromEntries(this.results.dependencies), null, 2),
    )
  }

  generateRecommendations() {
    const recommendations = []

    // File organization recommendations
    if (this.results.components.length > 20) {
      recommendations.push({
        category: 'organization',
        priority: 'high',
        message:
          'Large number of components detected. Consider organizing into subdirectories by purpose.',
      })
    }

    // Performance recommendations
    if (this.results.performance.patterns?.dynamicImports < 3) {
      recommendations.push({
        category: 'performance',
        priority: 'medium',
        message:
          'Consider implementing code splitting with dynamic imports for better performance.',
      })
    }

    // Test coverage recommendations
    const testRatio = parseFloat(this.results.functionality.tests?.coverage?.ratio || 0)
    if (testRatio < 0.5) {
      recommendations.push({
        category: 'testing',
        priority: 'high',
        message: 'Low test coverage detected. Consider adding more test files.',
      })
    }

    return recommendations
  }

  generateHumanReadableSummary(report) {
    return `# Pre-Restructuring Analysis Summary

Generated: ${report.metadata.timestamp}

## Project Overview

- **Total Files Analyzed**: ${report.summary.totalFiles}
- **Collections**: ${report.summary.collections}
- **Components**: ${report.summary.components}
- **Blocks**: ${report.summary.blocks}
- **Utilities**: ${report.summary.utilities}
- **Test Files**: ${report.summary.tests}

## Structure Analysis

### Collections
${report.structure.collections.map((c) => `- ${c.path} (${c.exports.length} exports)`).join('\n')}

### Components
${report.structure.components.map((c) => `- ${c.path} (${c.components.length} components)`).join('\n')}

### Blocks
${report.structure.blocks.map((b) => `- ${b.path} (${b.exports.length} exports)`).join('\n')}

## Performance Baseline

- **Dependencies**: ${report.performance.dependencies || 0}
- **Dev Dependencies**: ${report.performance.devDependencies || 0}
- **Dynamic Imports**: ${report.performance.patterns?.dynamicImports || 0}
- **Lazy Components**: ${report.performance.patterns?.lazyComponents || 0}
- **Memoized Components**: ${report.performance.patterns?.memoizedComponents || 0}

## Test Coverage

- **Test Ratio**: ${report.functionality.tests?.coverage?.ratio || 0} (tests per source file)
- **Unit Tests**: ${report.functionality.tests?.byType?.unit?.length || 0}
- **Integration Tests**: ${report.functionality.tests?.byType?.integration?.length || 0}
- **E2E Tests**: ${report.functionality.tests?.byType?.e2e?.length || 0}
- **Performance Tests**: ${report.functionality.tests?.byType?.performance?.length || 0}
- **Property-Based Tests**: ${report.functionality.tests?.byType?.pbt?.length || 0}

## Recommendations

${report.recommendations.map((r) => `- **${r.category.toUpperCase()}** (${r.priority}): ${r.message}`).join('\n')}

## Next Steps

1. Review the detailed analysis report: \`restructure-analysis/analysis-report.json\`
2. Examine dependency relationships: \`restructure-analysis/dependency-graph.json\`
3. Proceed with restructuring while preserving all identified functionality
4. Use this baseline for post-restructuring comparison

## Backup Information

A complete backup has been created at: \`${path.relative(process.cwd(), report.metadata.backupLocation)}\`

This backup includes all source files, configurations, and documentation, excluding:
- node_modules
- .next build directory
- .git repository
- Log files
- Environment files with secrets
`
  }
}

// Run the analyzer
const analyzer = new ProjectAnalyzer()
analyzer.run().catch(console.error)

export default ProjectAnalyzer
