#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Auto-detect project structure
function detectProjectStructure() {
  const restructuredIndicators = [
    'src/types/index.ts',
    'src/blocks/index.ts',
    'src/components/index.ts',
    'tests/unit',
    'tests/integration',
    'tests/property-based',
  ]

  const hasRestructuredIndicators = restructuredIndicators.some((indicator) => {
    try {
      return existsSync(join(__dirname, indicator))
    } catch {
      return false
    }
  })

  return {
    isRestructured: hasRestructuredIndicators,
    blocksDir: 'src/blocks',
    componentsDir: 'src/components',
  }
}

// Simple analysis runner that bypasses TypeScript compilation issues
async function runAnalysis() {
  console.log('🔍 Starting Blocks and Components Analysis...')

  // Detect project structure
  const projectStructure = detectProjectStructure()
  console.log(
    `📁 Project structure: ${projectStructure.isRestructured ? 'Restructured' : 'Legacy'}`,
  )

  try {
    // Import the orchestrator dynamically
    const { AnalysisOrchestrator } =
      await import('./src/analysis-tools/analyzers/AnalysisOrchestrator.js')

    const orchestrator = new AnalysisOrchestrator()

    const analysisOptions = {
      blockDir: join(__dirname, projectStructure.blocksDir),
      componentDir: join(__dirname, projectStructure.componentsDir),
      includeTests: true,
      compareOfficial: false, // Skip GitHub API calls for now
      severity: 'all',
    }

    console.log('📊 Running comprehensive analysis...')
    const result = await orchestrator.analyze(analysisOptions)

    // Generate report
    console.log('📝 Generating report...')
    const reportPath = join(__dirname, 'analysis-report.json')
    writeFileSync(reportPath, JSON.stringify(result, null, 2))

    console.log(`✅ Analysis complete! Report saved to: ${reportPath}`)

    // Print summary
    if (result.blocks) {
      console.log(`\n📋 Summary:`)
      console.log(`- Blocks analyzed: ${result.blocks.length}`)
      console.log(`- Components analyzed: ${result.components?.length || 0}`)

      const totalIssues = result.blocks.reduce((sum, block) => sum + (block.issues?.length || 0), 0)
      console.log(`- Total issues found: ${totalIssues}`)
    }

    return result
  } catch (error) {
    console.error('❌ Analysis failed:', error.message)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
    process.exit(1)
  }
}

// Run the analysis
runAnalysis()
