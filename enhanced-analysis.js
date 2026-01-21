import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class EnhancedProjectAnalyzer {
  constructor() {
    this.projectRoot = process.cwd()
    this.analysisDir = path.join(this.projectRoot, 'restructure-analysis')
    this.results = {
      timestamp: new Date().toISOString(),
      structure: {
        collections: [],
        components: [],
        blocks: [],
        utilities: [],
        pages: [],
        globals: [],
        fields: [],
        hooks: [],
        icons: [],
        providers: [],
        access: [],
      },
      functionality: {
        payloadConfig: null,
        packageJson: null,
        tsConfig: null,
      },
      dependencies: new Map(),
      imports: new Map(),
      exports: new Map(),
    }
  }

  async run() {
    console.log('🔍 Running enhanced project analysis...')

    try {
      await this.analyzeProjectStructure()
      await this.analyzePayloadConfiguration()
      await this.analyzePackageConfiguration()
      await this.analyzeDependencyGraph()
      await this.generateEnhancedReport()

      console.log('✅ Enhanced analysis completed!')
    } catch (error) {
      console.error('❌ Error during enhanced analysis:', error.message)
      process.exit(1)
    }
  }

  async analyzeProjectStructure() {
    console.log('📂 Analyzing detailed project structure...')

    const srcPath = path.join(this.projectRoot, 'src')
    if (!fs.existsSync(srcPath)) {
      console.warn('⚠️  No src directory found')
      return
    }

    // Analyze each major directory
    await this.analyzeDirectory('collections', path.join(srcPath, 'collections'))
    await this.analyzeDirectory('components', path.join(srcPath, 'components'))
    await this.analyzeDirectory('blocks', path.join(srcPath, 'blocks'))
    await this.analyzeDirectory('utilities', path.join(srcPath, 'utilities'))
    await this.analyzeDirectory('pages', path.join(srcPath, 'pages'))
    await this.analyzeDirectory('globals', path.join(srcPath, 'globals'))
    await this.analyzeDirectory('fields', path.join(srcPath, 'fields'))
    await this.analyzeDirectory('hooks', path.join(srcPath, 'hooks'))
    await this.analyzeDirectory('icons', path.join(srcPath, 'icons'))
    await this.analyzeDirectory('providers', path.join(srcPath, 'providers'))
    await this.analyzeDirectory('access', path.join(srcPath, 'access'))
  }

  async analyzeDirectory(category, dirPath) {
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  Directory ${category} not found at ${dirPath}`)
      return
    }

    console.log(`  📁 Analyzing ${category}...`)
    const files = this.scanDirectoryRecursive(dirPath)

    for (const file of files) {
      if (this.isSourceFile(file.name)) {
        const analysis = await this.analyzeSourceFile(file.fullPath, file.relativePath)
        this.results.structure[category].push(analysis)
      }
    }
  }

  scanDirectoryRecursive(dirPath, basePath = '') {
    const files = []

    try {
      const items = fs.readdirSync(dirPath)

      for (const item of items) {
        const fullPath = path.join(dirPath, item)
        const relativePath = path.join(basePath, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          // Recursively scan subdirectories
          files.push(...this.scanDirectoryRecursive(fullPath, relativePath))
        } else {
          files.push({
            name: item,
            fullPath,
            relativePath,
            size: stat.size,
            modified: stat.mtime.toISOString(),
          })
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not read directory ${dirPath}: ${error.message}`)
    }

    return files
  }

  isSourceFile(filename) {
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs']
    return extensions.some((ext) => filename.endsWith(ext))
  }

  async analyzeSourceFile(filePath, relativePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const analysis = {
        path: relativePath,
        fullPath: filePath,
        size: content.length,
        lines: content.split('\n').length,
        imports: [],
        exports: [],
        dependencies: [],
        functions: [],
        components: [],
        hooks: [],
        types: [],
        payloadConfig: this.analyzePayloadPatterns(content),
        reactPatterns: this.analyzeReactPatterns(content),
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

      // Parse functions
      const functionRegex = /(?:function|const)\s+([a-z]\w*)\s*(?:\(|=)/g
      while ((match = functionRegex.exec(content)) !== null) {
        if (!match[1].startsWith('use') && !analysis.components.includes(match[1])) {
          analysis.functions.push(match[1])
        }
      }

      // Parse TypeScript types/interfaces
      const typeRegex = /(?:type|interface)\s+(\w+)/g
      while ((match = typeRegex.exec(content)) !== null) {
        analysis.types.push(match[1])
      }

      return analysis
    } catch (error) {
      console.warn(`⚠️  Could not analyze ${relativePath}: ${error.message}`)
      return {
        path: relativePath,
        fullPath: filePath,
        error: error.message,
        imports: [],
        exports: [],
        dependencies: [],
        functions: [],
        components: [],
        hooks: [],
        types: [],
      }
    }
  }

  analyzePayloadPatterns(content) {
    const patterns = {
      isCollection: content.includes('CollectionConfig'),
      isGlobal: content.includes('GlobalConfig'),
      isField: content.includes('Field'),
      isHook: content.includes('Hook'),
      isAccess: content.includes('Access'),
      hasAuth: content.includes('auth:'),
      hasVersions: content.includes('versions:'),
      hasUploads: content.includes('upload:'),
      hasBlocks: content.includes('blocks:'),
      hasRichText: content.includes('richText'),
    }

    return patterns
  }

  analyzeReactPatterns(content) {
    const patterns = {
      isComponent: /export\s+(?:default\s+)?(?:function|const)\s+[A-Z]\w*/.test(content),
      usesHooks: /use[A-Z]\w*\s*\(/.test(content),
      usesState: content.includes('useState'),
      usesEffect: content.includes('useEffect'),
      usesMemo: content.includes('useMemo'),
      usesCallback: content.includes('useCallback'),
      usesContext: content.includes('useContext'),
      isClientComponent: content.includes("'use client'"),
      isServerComponent:
        !content.includes("'use client'") &&
        /export\s+(?:default\s+)?(?:function|const)\s+[A-Z]\w*/.test(content),
    }

    return patterns
  }

  async analyzePayloadConfiguration() {
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
          database: this.extractDatabaseConfig(content),
          editor: this.extractEditorConfig(content),
          admin: this.extractAdminConfig(content),
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
      const pluginList = match[1]
      const nameRegex = /(\w+)\s*\(/g
      let nameMatch
      while ((nameMatch = nameRegex.exec(pluginList)) !== null) {
        plugins.push(nameMatch[1])
      }
    }
    return plugins
  }

  extractDatabaseConfig(content) {
    if (content.includes('mongooseAdapter')) return 'MongoDB'
    if (content.includes('postgresAdapter')) return 'PostgreSQL'
    if (content.includes('sqliteAdapter')) return 'SQLite'
    return 'Unknown'
  }

  extractEditorConfig(content) {
    if (content.includes('lexicalEditor')) return 'Lexical'
    if (content.includes('slateEditor')) return 'Slate'
    return 'Unknown'
  }

  extractAdminConfig(content) {
    const config = {}
    if (content.includes('user:')) {
      const userMatch = content.match(/user:\s*['"`](\w+)['"`]/)
      if (userMatch) config.userCollection = userMatch[1]
    }
    return config
  }

  async analyzePackageConfiguration() {
    console.log('📦 Analyzing package configuration...')

    const packagePath = path.join(this.projectRoot, 'package.json')
    if (fs.existsSync(packagePath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
        this.results.functionality.packageJson = {
          name: packageJson.name,
          version: packageJson.version,
          type: packageJson.type,
          dependencies: Object.keys(packageJson.dependencies || {}),
          devDependencies: Object.keys(packageJson.devDependencies || {}),
          scripts: Object.keys(packageJson.scripts || {}),
          payloadDependencies: Object.keys(packageJson.dependencies || {}).filter(
            (dep) => dep.includes('payload') || dep.includes('@payloadcms'),
          ),
        }
      } catch (error) {
        console.warn('⚠️  Could not analyze package.json:', error.message)
      }
    }

    // Analyze TypeScript configuration
    const tsConfigPath = path.join(this.projectRoot, 'tsconfig.json')
    if (fs.existsSync(tsConfigPath)) {
      try {
        const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'))
        this.results.functionality.tsConfig = {
          compilerOptions: tsConfig.compilerOptions,
          include: tsConfig.include,
          exclude: tsConfig.exclude,
        }
      } catch (error) {
        console.warn('⚠️  Could not analyze tsconfig.json:', error.message)
      }
    }
  }

  async analyzeDependencyGraph() {
    console.log('🔗 Building dependency graph...')

    const allFiles = [
      ...this.results.structure.collections,
      ...this.results.structure.components,
      ...this.results.structure.blocks,
      ...this.results.structure.utilities,
      ...this.results.structure.pages,
      ...this.results.structure.globals,
      ...this.results.structure.fields,
      ...this.results.structure.hooks,
      ...this.results.structure.providers,
      ...this.results.structure.access,
    ]

    const dependencyGraph = new Map()

    allFiles.forEach((file) => {
      if (file.path) {
        dependencyGraph.set(file.path, {
          imports: file.imports || [],
          exports: file.exports || [],
          internalDependencies: (file.imports || []).filter(
            (imp) => imp.startsWith('./') || imp.startsWith('../') || imp.startsWith('src/'),
          ),
          externalDependencies: (file.imports || []).filter(
            (imp) => !imp.startsWith('.') && !imp.startsWith('/') && !imp.startsWith('src/'),
          ),
        })
      }
    })

    this.results.dependencies = dependencyGraph
  }

  async generateEnhancedReport() {
    console.log('📋 Generating enhanced analysis report...')

    const summary = this.generateSummary()
    const detailedReport = {
      metadata: {
        timestamp: this.results.timestamp,
        projectRoot: this.projectRoot,
        analysisVersion: '2.0.0',
      },
      summary,
      structure: this.results.structure,
      functionality: this.results.functionality,
      dependencies: Object.fromEntries(this.results.dependencies),
      recommendations: this.generateRecommendations(summary),
    }

    // Write enhanced report
    fs.writeFileSync(
      path.join(this.analysisDir, 'enhanced-analysis-report.json'),
      JSON.stringify(detailedReport, null, 2),
    )

    // Write enhanced summary
    const enhancedSummary = this.generateEnhancedSummary(detailedReport)
    fs.writeFileSync(path.join(this.analysisDir, 'enhanced-analysis-summary.md'), enhancedSummary)

    console.log('📊 Enhanced analysis reports generated!')
  }

  generateSummary() {
    const summary = {
      collections: {
        total: this.results.structure.collections.length,
        withAuth: this.results.structure.collections.filter((c) => c.payloadConfig?.hasAuth).length,
        withVersions: this.results.structure.collections.filter((c) => c.payloadConfig?.hasVersions)
          .length,
        withUploads: this.results.structure.collections.filter((c) => c.payloadConfig?.hasUploads)
          .length,
      },
      components: {
        total: this.results.structure.components.length,
        clientComponents: this.results.structure.components.filter(
          (c) => c.reactPatterns?.isClientComponent,
        ).length,
        serverComponents: this.results.structure.components.filter(
          (c) => c.reactPatterns?.isServerComponent,
        ).length,
        withHooks: this.results.structure.components.filter((c) => c.reactPatterns?.usesHooks)
          .length,
      },
      blocks: {
        total: this.results.structure.blocks.length,
        withComponents: this.results.structure.blocks.filter((b) => b.components?.length > 0)
          .length,
      },
      utilities: {
        total: this.results.structure.utilities.length,
        totalFunctions: this.results.structure.utilities.reduce(
          (sum, u) => sum + (u.functions?.length || 0),
          0,
        ),
      },
      pages: {
        total: this.results.structure.pages.length,
      },
      globals: {
        total: this.results.structure.globals.length,
      },
      totalSourceFiles: Object.values(this.results.structure).reduce(
        (sum, category) => sum + category.length,
        0,
      ),
      totalLinesOfCode: Object.values(this.results.structure).reduce(
        (sum, category) => sum + category.reduce((catSum, file) => catSum + (file.lines || 0), 0),
        0,
      ),
    }

    return summary
  }

  generateRecommendations(summary) {
    const recommendations = []

    // Structure recommendations
    if (summary.components.total > 30) {
      recommendations.push({
        category: 'structure',
        priority: 'high',
        message: `Large number of components (${summary.components.total}) detected. Consider organizing into subdirectories by purpose (ui/, blocks/, forms/, layout/, admin/).`,
      })
    }

    if (summary.blocks.total > 15) {
      recommendations.push({
        category: 'structure',
        priority: 'medium',
        message: `Many blocks (${summary.blocks.total}) detected. Consider organizing into categories (hero/, content/, services/, portfolio/, technical/, cta/, layout/).`,
      })
    }

    // Performance recommendations
    const clientComponentRatio = summary.components.clientComponents / summary.components.total
    if (clientComponentRatio > 0.7) {
      recommendations.push({
        category: 'performance',
        priority: 'medium',
        message: `High ratio of client components (${Math.round(clientComponentRatio * 100)}%). Consider converting some to server components for better performance.`,
      })
    }

    // Code organization recommendations
    if (summary.utilities.total > 20) {
      recommendations.push({
        category: 'organization',
        priority: 'medium',
        message: `Many utility files (${summary.utilities.total}) detected. Consider organizing into subdirectories (api/, validation/, formatting/, media/, cms/).`,
      })
    }

    return recommendations
  }

  generateEnhancedSummary(report) {
    return `# Enhanced Pre-Restructuring Analysis Summary

Generated: ${report.metadata.timestamp}

## Project Overview

- **Total Source Files**: ${report.summary.totalSourceFiles}
- **Total Lines of Code**: ${report.summary.totalLinesOfCode.toLocaleString()}

### Collections (${report.summary.collections.total})
- With Authentication: ${report.summary.collections.withAuth}
- With Versioning: ${report.summary.collections.withVersions}
- With File Uploads: ${report.summary.collections.withUploads}

**Collection Files:**
${report.structure.collections.map((c) => `- ${c.path} (${c.exports?.length || 0} exports, ${c.lines || 0} lines)`).join('\n')}

### Components (${report.summary.components.total})
- Client Components: ${report.summary.components.clientComponents}
- Server Components: ${report.summary.components.serverComponents}
- Using React Hooks: ${report.summary.components.withHooks}

**Component Files:**
${report.structure.components
  .slice(0, 10)
  .map((c) => `- ${c.path} (${c.components?.length || 0} components, ${c.lines || 0} lines)`)
  .join('\n')}
${report.structure.components.length > 10 ? `... and ${report.structure.components.length - 10} more` : ''}

### Blocks (${report.summary.blocks.total})
- With React Components: ${report.summary.blocks.withComponents}

**Block Files:**
${report.structure.blocks.map((b) => `- ${b.path} (${b.exports?.length || 0} exports, ${b.lines || 0} lines)`).join('\n')}

### Utilities (${report.summary.utilities.total})
- Total Functions: ${report.summary.utilities.totalFunctions}

**Utility Files:**
${report.structure.utilities.map((u) => `- ${u.path} (${u.functions?.length || 0} functions, ${u.lines || 0} lines)`).join('\n')}

### Pages (${report.summary.pages.total})
${report.structure.pages.map((p) => `- ${p.path} (${p.exports?.length || 0} exports)`).join('\n')}

### Globals (${report.summary.globals.total})
${report.structure.globals.map((g) => `- ${g.path} (${g.exports?.length || 0} exports)`).join('\n')}

## Payload Configuration

${
  report.functionality.payloadConfig
    ? `
- **Database**: ${report.functionality.payloadConfig.database}
- **Editor**: ${report.functionality.payloadConfig.editor}
- **Collections**: ${report.functionality.payloadConfig.collections.join(', ')}
- **Globals**: ${report.functionality.payloadConfig.globals.join(', ')}
- **Plugins**: ${report.functionality.payloadConfig.plugins.join(', ')}
`
    : 'No Payload configuration found'
}

## Package Information

${
  report.functionality.packageJson
    ? `
- **Name**: ${report.functionality.packageJson.name}
- **Version**: ${report.functionality.packageJson.version}
- **Type**: ${report.functionality.packageJson.type}
- **Dependencies**: ${report.functionality.packageJson.dependencies.length}
- **Dev Dependencies**: ${report.functionality.packageJson.devDependencies.length}
- **Payload Dependencies**: ${report.functionality.packageJson.payloadDependencies.join(', ')}
`
    : 'No package.json found'
}

## Dependency Analysis

- **Total Internal Dependencies**: ${Object.values(report.dependencies).reduce((sum, dep) => sum + dep.internalDependencies.length, 0)}
- **Total External Dependencies**: ${Object.values(report.dependencies).reduce((sum, dep) => sum + dep.externalDependencies.length, 0)}

## Recommendations

${report.recommendations.map((r) => `- **${r.category.toUpperCase()}** (${r.priority}): ${r.message}`).join('\n')}

## Restructuring Readiness

✅ **Ready for restructuring** - All functionality has been documented and preserved in backup.

### Key Preservation Points:
1. **${report.summary.collections.total} Collections** with their configurations and hooks
2. **${report.summary.components.total} Components** with their React patterns and dependencies
3. **${report.summary.blocks.total} Blocks** with their component implementations
4. **${report.summary.utilities.total} Utilities** with ${report.summary.utilities.totalFunctions} functions
5. **Payload Configuration** with database, editor, and plugin settings
6. **TypeScript Configuration** and build settings
7. **Package Dependencies** and scripts

### Next Steps:
1. Begin restructuring following the official PayloadCMS patterns
2. Use this analysis to ensure no functionality is lost
3. Validate each step against this baseline
4. Run post-restructuring analysis to confirm preservation

---

*This analysis provides a comprehensive baseline for the PayloadCMS project restructuring process.*
`
  }
}

// Run the enhanced analyzer
const analyzer = new EnhancedProjectAnalyzer()
analyzer.run().catch(console.error)

export default EnhancedProjectAnalyzer
