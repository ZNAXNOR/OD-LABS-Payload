#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Simple analysis of blocks and components
async function runSimpleAnalysis() {
  console.log('🔍 Starting Simple Blocks and Components Analysis...')

  const results = {
    timestamp: new Date().toISOString(),
    summary: {
      blocksAnalyzed: 0,
      componentsAnalyzed: 0,
      totalIssues: 0,
      criticalIssues: 0,
      highIssues: 0,
      mediumIssues: 0,
      lowIssues: 0,
    },
    blocks: [],
    components: [],
    issues: [],
    recommendations: [],
  }

  try {
    // Analyze blocks
    console.log('📦 Analyzing blocks...')
    const blocksDir = join(__dirname, 'src/blocks')
    const blockResults = await analyzeBlocks(blocksDir)
    results.blocks = blockResults.blocks
    results.issues.push(...blockResults.issues)
    results.summary.blocksAnalyzed = blockResults.blocks.length

    // Analyze components
    console.log('⚛️ Analyzing components...')
    const componentsDir = join(__dirname, 'src/components')
    const componentResults = await analyzeComponents(componentsDir)
    results.components = componentResults.components
    results.issues.push(...componentResults.issues)
    results.summary.componentsAnalyzed = componentResults.components.length

    // Calculate issue counts
    results.summary.totalIssues = results.issues.length
    results.summary.criticalIssues = results.issues.filter((i) => i.severity === 'critical').length
    results.summary.highIssues = results.issues.filter((i) => i.severity === 'high').length
    results.summary.mediumIssues = results.issues.filter((i) => i.severity === 'medium').length
    results.summary.lowIssues = results.issues.filter((i) => i.severity === 'low').length

    // Generate recommendations
    results.recommendations = generateRecommendations(results.issues)

    // Save results
    const reportPath = join(__dirname, 'analysis-report.json')
    writeFileSync(reportPath, JSON.stringify(results, null, 2))

    console.log(`✅ Analysis complete! Report saved to: ${reportPath}`)
    console.log(`\n📊 Summary:`)
    console.log(`- Blocks analyzed: ${results.summary.blocksAnalyzed}`)
    console.log(`- Components analyzed: ${results.summary.componentsAnalyzed}`)
    console.log(`- Total issues: ${results.summary.totalIssues}`)
    console.log(`  - Critical: ${results.summary.criticalIssues}`)
    console.log(`  - High: ${results.summary.highIssues}`)
    console.log(`  - Medium: ${results.summary.mediumIssues}`)
    console.log(`  - Low: ${results.summary.lowIssues}`)

    return results
  } catch (error) {
    console.error('❌ Analysis failed:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

async function analyzeBlocks(blocksDir) {
  const blocks = []
  const issues = []

  function walkDirectory(dir, relativePath = '') {
    try {
      const items = readdirSync(dir)

      for (const item of items) {
        const fullPath = join(dir, item)
        const stat = statSync(fullPath)
        const currentRelativePath = relativePath ? join(relativePath, item) : item

        if (stat.isDirectory()) {
          walkDirectory(fullPath, currentRelativePath)
        } else if (item === 'config.ts' || item === 'config.js') {
          // Found a block config file
          try {
            const content = readFileSync(fullPath, 'utf-8')
            const blockName = basename(dirname(fullPath))

            const blockAnalysis = {
              name: blockName,
              path: fullPath,
              relativePath: currentRelativePath,
              hasConfig: true,
              hasComponent: false,
              issues: [],
            }

            // Check for corresponding component
            const componentPath = join(dirname(fullPath), 'Component.tsx')
            try {
              statSync(componentPath)
              blockAnalysis.hasComponent = true
            } catch {
              blockAnalysis.issues.push({
                type: 'missing-component',
                severity: 'high',
                message: `Block '${blockName}' has config but no Component.tsx file`,
                file: fullPath,
              })
            }

            // Analyze block config content
            const configIssues = analyzeBlockConfig(content, blockName, fullPath)
            blockAnalysis.issues.push(...configIssues)
            issues.push(...configIssues)

            blocks.push(blockAnalysis)
          } catch (error) {
            issues.push({
              type: 'parse-error',
              severity: 'critical',
              message: `Failed to read block config: ${error.message}`,
              file: fullPath,
            })
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${dir}: ${error.message}`)
    }
  }

  walkDirectory(blocksDir)
  return { blocks, issues }
}

function analyzeBlockConfig(content, blockName, filePath) {
  const issues = []

  // Check for interfaceName
  if (!content.includes('interfaceName')) {
    issues.push({
      type: 'missing-interface-name',
      severity: 'medium',
      message: `Block '${blockName}' is missing interfaceName property for TypeScript typing`,
      file: filePath,
      recommendation: 'Add interfaceName property to enable proper TypeScript integration',
    })
  }

  // Check for access control
  if (!content.includes('access:') && !content.includes('access =')) {
    issues.push({
      type: 'missing-access-control',
      severity: 'critical',
      message: `Block '${blockName}' has no access control defined`,
      file: filePath,
      recommendation: 'Add access control to secure the block',
    })
  }

  // Check for admin configuration
  if (!content.includes('admin:') && !content.includes('admin =')) {
    issues.push({
      type: 'missing-admin-config',
      severity: 'low',
      message: `Block '${blockName}' has minimal admin configuration`,
      file: filePath,
      recommendation: 'Add admin configuration for better user experience',
    })
  }

  // Check for field validation
  if (content.includes('fields:') || content.includes('fields =')) {
    if (!content.includes('required:') && !content.includes('validate:')) {
      issues.push({
        type: 'missing-validation',
        severity: 'medium',
        message: `Block '${blockName}' fields may lack validation rules`,
        file: filePath,
        recommendation: 'Add validation rules to ensure data integrity',
      })
    }
  }

  // Check for labels
  if (!content.includes('labels:') && !content.includes('labels =')) {
    issues.push({
      type: 'missing-labels',
      severity: 'low',
      message: `Block '${blockName}' is missing user-friendly labels`,
      file: filePath,
      recommendation: 'Add labels for better admin UI experience',
    })
  }

  return issues
}

async function analyzeComponents(componentsDir) {
  const components = []
  const issues = []

  function walkDirectory(dir, relativePath = '') {
    try {
      const items = readdirSync(dir)

      for (const item of items) {
        const fullPath = join(dir, item)
        const stat = statSync(fullPath)
        const currentRelativePath = relativePath ? join(relativePath, item) : item

        if (stat.isDirectory()) {
          walkDirectory(fullPath, currentRelativePath)
        } else if (
          extname(item) === '.tsx' &&
          !item.includes('.test.') &&
          !item.includes('.spec.')
        ) {
          // Found a React component file
          try {
            const content = readFileSync(fullPath, 'utf-8')
            const componentName = basename(item, '.tsx')

            const componentAnalysis = {
              name: componentName,
              path: fullPath,
              relativePath: currentRelativePath,
              isClientComponent: content.includes("'use client'"),
              issues: [],
            }

            // Analyze component content
            const componentIssues = analyzeComponent(content, componentName, fullPath)
            componentAnalysis.issues.push(...componentIssues)
            issues.push(...componentIssues)

            components.push(componentAnalysis)
          } catch (error) {
            issues.push({
              type: 'parse-error',
              severity: 'critical',
              message: `Failed to read component: ${error.message}`,
              file: fullPath,
            })
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${dir}: ${error.message}`)
    }
  }

  walkDirectory(componentsDir)
  return { components, issues }
}

function analyzeComponent(content, componentName, filePath) {
  const issues = []

  // Check for accessibility issues
  if (content.includes('<img') && !content.includes('alt=')) {
    issues.push({
      type: 'missing-alt-text',
      severity: 'high',
      message: `Component '${componentName}' has images without alt text`,
      file: filePath,
      recommendation: 'Add alt attributes to all images for accessibility',
    })
  }

  // Check for interactive elements without proper ARIA
  if ((content.includes('<button') || content.includes('<a ')) && !content.includes('aria-')) {
    issues.push({
      type: 'missing-aria-labels',
      severity: 'medium',
      message: `Component '${componentName}' may be missing ARIA labels on interactive elements`,
      file: filePath,
      recommendation: 'Add appropriate ARIA labels for screen readers',
    })
  }

  // Check for proper TypeScript typing
  if (!content.includes('interface') && !content.includes('type ') && content.includes('props')) {
    issues.push({
      type: 'weak-typing',
      severity: 'medium',
      message: `Component '${componentName}' may have weak TypeScript typing`,
      file: filePath,
      recommendation: 'Define proper TypeScript interfaces for props',
    })
  }

  // Check for error boundaries
  if (content.includes('async ') && !content.includes('try') && !content.includes('catch')) {
    issues.push({
      type: 'missing-error-handling',
      severity: 'medium',
      message: `Component '${componentName}' has async operations without error handling`,
      file: filePath,
      recommendation: 'Add proper error handling for async operations',
    })
  }

  // Check for performance issues
  if (content.includes('map(') && !content.includes('key=')) {
    issues.push({
      type: 'missing-react-keys',
      severity: 'low',
      message: `Component '${componentName}' may be missing React keys in lists`,
      file: filePath,
      recommendation: 'Add unique keys to list items for better performance',
    })
  }

  // Check for dangerouslySetInnerHTML
  if (content.includes('dangerouslySetInnerHTML')) {
    issues.push({
      type: 'xss-risk',
      severity: 'critical',
      message: `Component '${componentName}' uses dangerouslySetInnerHTML which may pose XSS risks`,
      file: filePath,
      recommendation: 'Ensure content is properly sanitized or use safer alternatives',
    })
  }

  return issues
}

function generateRecommendations(issues) {
  const recommendations = []

  // Group issues by type
  const issuesByType = issues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = []
    acc[issue.type].push(issue)
    return acc
  }, {})

  // Generate recommendations based on issue patterns
  Object.entries(issuesByType).forEach(([type, typeIssues]) => {
    const count = typeIssues.length
    const severity = typeIssues[0].severity

    switch (type) {
      case 'missing-access-control':
        recommendations.push({
          priority: 1,
          title: 'Implement Access Control',
          description: `${count} block(s) are missing access control. This is a critical security issue.`,
          impact: 'Critical security vulnerability - unauthorized access to data',
          effort: 'Medium',
          steps: [
            'Review each block configuration',
            'Add appropriate access control rules',
            'Test access control with different user roles',
            'Document access control decisions',
          ],
        })
        break

      case 'missing-interface-name':
        recommendations.push({
          priority: 2,
          title: 'Add TypeScript Interface Names',
          description: `${count} block(s) are missing interfaceName for proper TypeScript integration.`,
          impact: 'Reduced type safety and developer experience',
          effort: 'Low',
          steps: [
            'Add interfaceName property to each block config',
            'Ensure interface names match component prop types',
            'Run type generation to verify integration',
          ],
        })
        break

      case 'missing-alt-text':
        recommendations.push({
          priority: 2,
          title: 'Fix Accessibility Issues',
          description: `${count} component(s) have accessibility issues with images.`,
          impact: 'Poor accessibility for screen reader users',
          effort: 'Low',
          steps: [
            'Add alt attributes to all images',
            'Use empty alt="" for decorative images',
            'Test with screen readers',
            'Consider using next/image for optimization',
          ],
        })
        break

      case 'xss-risk':
        recommendations.push({
          priority: 1,
          title: 'Address XSS Security Risks',
          description: `${count} component(s) use dangerouslySetInnerHTML.`,
          impact: 'Critical security vulnerability - XSS attacks possible',
          effort: 'Medium',
          steps: [
            'Review all uses of dangerouslySetInnerHTML',
            'Implement proper content sanitization',
            'Consider using safer alternatives like markdown renderers',
            'Add security testing for user-generated content',
          ],
        })
        break
    }
  })

  return recommendations.sort((a, b) => a.priority - b.priority)
}

// Run the analysis
runSimpleAnalysis()
