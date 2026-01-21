import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class PerformanceBaseline {
  constructor() {
    this.projectRoot = process.cwd()
    this.analysisDir = path.join(this.projectRoot, 'restructure-analysis')
    this.results = {
      timestamp: new Date().toISOString(),
      build: {},
      tests: {},
      bundle: {},
      dependencies: {},
      typecheck: {},
    }
  }

  async run() {
    console.log('📊 Generating performance baseline metrics...')

    try {
      await this.measureTypeCheck()
      await this.measureBuildTime()
      await this.measureTestExecution()
      await this.analyzeBundleSize()
      await this.analyzeDependencies()
      await this.generateBaselineReport()

      console.log('✅ Performance baseline completed!')
    } catch (error) {
      console.error('❌ Error during performance baseline:', error.message)
      // Don't exit on error, just log and continue
    }
  }

  async measureTypeCheck() {
    console.log('🔍 Measuring TypeScript compilation time...')

    try {
      const startTime = Date.now()
      execSync('npx tsc --noEmit', {
        stdio: 'pipe',
        timeout: 60000, // 1 minute timeout
      })
      const endTime = Date.now()

      this.results.typecheck = {
        success: true,
        duration: endTime - startTime,
        timestamp: new Date().toISOString(),
      }

      console.log(`  ✅ TypeScript check completed in ${this.results.typecheck.duration}ms`)
    } catch (error) {
      this.results.typecheck = {
        success: false,
        error: error.message,
        duration: null,
        timestamp: new Date().toISOString(),
      }
      console.log('  ⚠️  TypeScript check failed:', error.message.split('\n')[0])
    }
  }

  async measureBuildTime() {
    console.log('🏗️  Measuring build performance...')

    try {
      // Check if build script exists
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'),
      )
      if (!packageJson.scripts?.build) {
        console.log('  ⚠️  No build script found in package.json')
        return
      }

      const startTime = Date.now()
      const buildOutput = execSync('npm run build', {
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 300000, // 5 minute timeout
      })
      const endTime = Date.now()

      this.results.build = {
        success: true,
        duration: endTime - startTime,
        output: buildOutput.slice(-1000), // Last 1000 chars
        timestamp: new Date().toISOString(),
      }

      console.log(`  ✅ Build completed in ${this.results.build.duration}ms`)
    } catch (error) {
      this.results.build = {
        success: false,
        error: error.message,
        duration: null,
        timestamp: new Date().toISOString(),
      }
      console.log('  ⚠️  Build failed:', error.message.split('\n')[0])
    }
  }

  async measureTestExecution() {
    console.log('🧪 Measuring test execution time...')

    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'),
      )

      // Try different test commands
      const testCommands = ['test', 'test:unit', 'vitest']
      let testCommand = null

      for (const cmd of testCommands) {
        if (packageJson.scripts?.[cmd]) {
          testCommand = cmd
          break
        }
      }

      if (!testCommand) {
        console.log('  ⚠️  No test script found in package.json')
        return
      }

      const startTime = Date.now()
      const testOutput = execSync(`npm run ${testCommand} -- --run`, {
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 120000, // 2 minute timeout
      })
      const endTime = Date.now()

      this.results.tests = {
        success: true,
        duration: endTime - startTime,
        command: testCommand,
        output: testOutput.slice(-1000), // Last 1000 chars
        timestamp: new Date().toISOString(),
      }

      console.log(`  ✅ Tests completed in ${this.results.tests.duration}ms`)
    } catch (error) {
      this.results.tests = {
        success: false,
        error: error.message,
        duration: null,
        timestamp: new Date().toISOString(),
      }
      console.log('  ⚠️  Tests failed or timed out:', error.message.split('\n')[0])
    }
  }

  async analyzeBundleSize() {
    console.log('📦 Analyzing bundle size...')

    try {
      // Check if .next directory exists (Next.js build)
      const nextDir = path.join(this.projectRoot, '.next')
      if (fs.existsSync(nextDir)) {
        const bundleAnalysis = this.analyzeNextJsBundle(nextDir)
        this.results.bundle = bundleAnalysis
        console.log(`  📊 Bundle analysis completed`)
      } else {
        console.log('  ⚠️  No .next directory found, skipping bundle analysis')
      }
    } catch (error) {
      console.log('  ⚠️  Bundle analysis failed:', error.message)
      this.results.bundle = { error: error.message }
    }
  }

  analyzeNextJsBundle(nextDir) {
    const analysis = {
      timestamp: new Date().toISOString(),
      pages: {},
      chunks: {},
      totalSize: 0,
    }

    try {
      // Analyze static directory
      const staticDir = path.join(nextDir, 'static')
      if (fs.existsSync(staticDir)) {
        analysis.static = this.getDirectorySize(staticDir)
      }

      // Analyze server directory
      const serverDir = path.join(nextDir, 'server')
      if (fs.existsSync(serverDir)) {
        analysis.server = this.getDirectorySize(serverDir)
      }

      // Get total .next directory size
      analysis.totalSize = this.getDirectorySize(nextDir)
    } catch (error) {
      analysis.error = error.message
    }

    return analysis
  }

  getDirectorySize(dirPath) {
    let totalSize = 0

    try {
      const items = fs.readdirSync(dirPath)

      for (const item of items) {
        const itemPath = path.join(dirPath, item)
        const stat = fs.statSync(itemPath)

        if (stat.isDirectory()) {
          totalSize += this.getDirectorySize(itemPath)
        } else {
          totalSize += stat.size
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }

    return totalSize
  }

  async analyzeDependencies() {
    console.log('📋 Analyzing dependency metrics...')

    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'),
      )

      this.results.dependencies = {
        production: Object.keys(packageJson.dependencies || {}).length,
        development: Object.keys(packageJson.devDependencies || {}).length,
        payload: Object.keys(packageJson.dependencies || {}).filter(
          (dep) => dep.includes('payload') || dep.includes('@payloadcms'),
        ).length,
        react: Object.keys(packageJson.dependencies || {}).filter(
          (dep) => dep.includes('react') || dep.includes('@types/react'),
        ).length,
        nextjs: Object.keys(packageJson.dependencies || {}).filter((dep) => dep.includes('next'))
          .length,
      }

      // Analyze node_modules size if it exists
      const nodeModulesPath = path.join(this.projectRoot, 'node_modules')
      if (fs.existsSync(nodeModulesPath)) {
        this.results.dependencies.nodeModulesSize = this.getDirectorySize(nodeModulesPath)
      }

      console.log(`  📊 Dependency analysis completed`)
    } catch (error) {
      console.log('  ⚠️  Dependency analysis failed:', error.message)
      this.results.dependencies = { error: error.message }
    }
  }

  async generateBaselineReport() {
    console.log('📋 Generating performance baseline report...')

    const report = {
      metadata: {
        timestamp: this.results.timestamp,
        projectRoot: this.projectRoot,
        nodeVersion: process.version,
        platform: process.platform,
      },
      performance: this.results,
      summary: this.generatePerformanceSummary(),
    }

    // Write performance baseline report
    fs.writeFileSync(
      path.join(this.analysisDir, 'performance-baseline.json'),
      JSON.stringify(report, null, 2),
    )

    // Write human-readable summary
    const summary = this.generatePerformanceMarkdown(report)
    fs.writeFileSync(path.join(this.analysisDir, 'performance-baseline.md'), summary)

    console.log('📊 Performance baseline reports generated!')
  }

  generatePerformanceSummary() {
    const summary = {
      typecheck: {
        status: this.results.typecheck.success ? 'PASS' : 'FAIL',
        duration: this.results.typecheck.duration,
      },
      build: {
        status: this.results.build.success ? 'PASS' : 'FAIL',
        duration: this.results.build.duration,
      },
      tests: {
        status: this.results.tests.success ? 'PASS' : 'FAIL',
        duration: this.results.tests.duration,
      },
      bundle: {
        totalSize: this.results.bundle.totalSize || 0,
        staticSize: this.results.bundle.static || 0,
        serverSize: this.results.bundle.server || 0,
      },
      dependencies: this.results.dependencies,
    }

    return summary
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  formatDuration(ms) {
    if (!ms) return 'N/A'
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  generatePerformanceMarkdown(report) {
    return `# Performance Baseline Report

Generated: ${report.metadata.timestamp}
Node.js: ${report.metadata.nodeVersion}
Platform: ${report.metadata.platform}

## Summary

| Metric | Status | Duration | Notes |
|--------|--------|----------|-------|
| TypeScript Check | ${report.performance.typecheck.success ? '✅ PASS' : '❌ FAIL'} | ${this.formatDuration(report.performance.typecheck.duration)} | ${report.performance.typecheck.success ? 'No type errors' : 'Type errors found'} |
| Build Process | ${report.performance.build.success ? '✅ PASS' : '❌ FAIL'} | ${this.formatDuration(report.performance.build.duration)} | ${report.performance.build.success ? 'Build successful' : 'Build failed'} |
| Test Execution | ${report.performance.tests.success ? '✅ PASS' : '❌ FAIL'} | ${this.formatDuration(report.performance.tests.duration)} | ${report.performance.tests.success ? 'All tests passed' : 'Tests failed or timed out'} |

## Bundle Analysis

${
  report.performance.bundle.totalSize
    ? `
- **Total Bundle Size**: ${this.formatBytes(report.performance.bundle.totalSize)}
- **Static Assets**: ${this.formatBytes(report.performance.bundle.static || 0)}
- **Server Bundle**: ${this.formatBytes(report.performance.bundle.server || 0)}
`
    : 'Bundle analysis not available (no build output found)'
}

## Dependency Metrics

${
  report.performance.dependencies.production
    ? `
- **Production Dependencies**: ${report.performance.dependencies.production}
- **Development Dependencies**: ${report.performance.dependencies.development}
- **Payload Dependencies**: ${report.performance.dependencies.payload}
- **React Dependencies**: ${report.performance.dependencies.react}
- **Next.js Dependencies**: ${report.performance.dependencies.nextjs}
${report.performance.dependencies.nodeModulesSize ? `- **node_modules Size**: ${this.formatBytes(report.performance.dependencies.nodeModulesSize)}` : ''}
`
    : 'Dependency analysis not available'
}

## Detailed Results

### TypeScript Compilation
${
  report.performance.typecheck.success
    ? `
✅ **Status**: Successful
⏱️ **Duration**: ${this.formatDuration(report.performance.typecheck.duration)}
📝 **Notes**: No TypeScript compilation errors found
`
    : `
❌ **Status**: Failed
📝 **Error**: ${report.performance.typecheck.error || 'Unknown error'}
`
}

### Build Process
${
  report.performance.build.success
    ? `
✅ **Status**: Successful
⏱️ **Duration**: ${this.formatDuration(report.performance.build.duration)}
📝 **Notes**: Build completed without errors
`
    : `
❌ **Status**: Failed
📝 **Error**: ${report.performance.build.error || 'Unknown error'}
`
}

### Test Execution
${
  report.performance.tests.success
    ? `
✅ **Status**: Successful
⏱️ **Duration**: ${this.formatDuration(report.performance.tests.duration)}
📝 **Command**: ${report.performance.tests.command || 'Unknown'}
`
    : `
❌ **Status**: Failed
📝 **Error**: ${report.performance.tests.error || 'Unknown error'}
`
}

## Baseline Metrics for Comparison

Use these metrics to compare performance before and after restructuring:

1. **TypeScript Compilation Time**: ${this.formatDuration(report.performance.typecheck.duration)}
2. **Build Time**: ${this.formatDuration(report.performance.build.duration)}
3. **Test Execution Time**: ${this.formatDuration(report.performance.tests.duration)}
4. **Bundle Size**: ${this.formatBytes(report.performance.bundle.totalSize || 0)}
5. **Dependency Count**: ${(report.performance.dependencies.production || 0) + (report.performance.dependencies.development || 0)}

## Post-Restructuring Validation

After completing the restructuring, run the same performance tests and compare:

- ✅ TypeScript compilation should remain fast or improve
- ✅ Build time should remain similar or improve
- ✅ Test execution should remain similar or improve  
- ✅ Bundle size should remain similar or improve
- ✅ No new dependencies should be added unnecessarily

---

*This baseline provides measurable metrics to ensure the restructuring process maintains or improves performance.*
`
  }
}

// Run the performance baseline
const baseline = new PerformanceBaseline()
baseline.run().catch(console.error)

export default PerformanceBaseline
