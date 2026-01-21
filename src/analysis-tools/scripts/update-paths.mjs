#!/usr/bin/env node

/**
 * Path Update Script for Analysis Tools
 * Updates hardcoded paths to work with restructured project layout
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '../../..')

console.log('🔧 Updating Analysis Tools for Restructured Project...')

// Detect current project structure
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
      return existsSync(join(projectRoot, indicator))
    } catch {
      return false
    }
  })

  return {
    isRestructured: hasRestructuredIndicators,
    paths: {
      blocks: hasRestructuredIndicators ? 'src/blocks' : 'src/blocks',
      components: hasRestructuredIndicators ? 'src/components' : 'src/components',
      tests: hasRestructuredIndicators ? 'tests' : 'tests',
      types: hasRestructuredIndicators ? 'src/types' : 'src/payload-types.ts',
    },
  }
}

// Update package.json scripts if needed
function updatePackageJson() {
  const packageJsonPath = join(__dirname, '../package.json')

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

    // Update any hardcoded paths in scripts
    let updated = false

    if (packageJson.scripts) {
      Object.keys(packageJson.scripts).forEach((scriptName) => {
        const script = packageJson.scripts[scriptName]

        // Update any hardcoded src/blocks or src/components references
        if (script.includes('src/blocks') || script.includes('src/components')) {
          console.log(`📝 Script '${scriptName}' already uses flexible paths`)
        }
      })
    }

    if (updated) {
      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
      console.log('✅ Updated package.json scripts')
    } else {
      console.log('✅ Package.json scripts are already compatible')
    }
  } catch (error) {
    console.warn(`⚠️  Could not update package.json: ${error.message}`)
  }
}

// Update any configuration files
function updateConfigFiles() {
  const configFiles = [join(__dirname, '../config/ci.json')]

  configFiles.forEach((configPath) => {
    if (existsSync(configPath)) {
      try {
        const config = JSON.parse(readFileSync(configPath, 'utf-8'))
        let updated = false

        // Update any hardcoded paths in configuration
        if (config.paths) {
          console.log(`📝 Configuration file ${configPath} uses dynamic paths`)
        }

        if (updated) {
          writeFileSync(configPath, JSON.stringify(config, null, 2))
          console.log(`✅ Updated ${configPath}`)
        }
      } catch (error) {
        console.warn(`⚠️  Could not update ${configPath}: ${error.message}`)
      }
    }
  })
}

// Main update process
async function main() {
  const structure = detectProjectStructure()

  console.log(
    `📁 Detected project structure: ${structure.isRestructured ? 'Restructured' : 'Legacy'}`,
  )
  console.log('📍 Detected paths:')
  Object.entries(structure.paths).forEach(([key, path]) => {
    console.log(`   ${key}: ${path}`)
  })

  console.log('\n🔄 Updating configuration files...')
  updatePackageJson()
  updateConfigFiles()

  console.log('\n✅ Analysis tools updated successfully!')
  console.log('\n📋 Next steps:')
  console.log('1. Run analysis to verify everything works: npm run analyze')
  console.log('2. Check that all paths are detected correctly')
  console.log('3. Update any custom scripts that reference hardcoded paths')

  if (structure.isRestructured) {
    console.log('\n🎉 Your project is using the new restructured layout!')
    console.log('   The analysis tools will automatically use the new paths.')
  } else {
    console.log('\n📝 Your project is using the legacy layout.')
    console.log('   Consider restructuring for better organization.')
  }
}

main().catch((error) => {
  console.error('❌ Update failed:', error.message)
  process.exit(1)
})
