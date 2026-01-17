/**
 * Test Generator
 * Main orchestrator for generating comprehensive test suites
 * Implements the TestGenerator interface from types
 */

import type {
  Block,
  Component,
  TestSuite,
  PropertyTest,
  AccessibilityTest,
  TestGenerationResult,
} from '../types'
import { BlockTestGenerator } from './BlockTestGenerator'
import { PropertyTestGenerator } from './PropertyTestGenerator'
import { ComponentTestGenerator } from './ComponentTestGenerator'
import { AccessibilityTestGenerator } from './AccessibilityTestGenerator'
import { IntegrationTestGenerator } from './IntegrationTestGenerator'

export class TestGenerator {
  private blockTestGenerator: BlockTestGenerator
  private propertyTestGenerator: PropertyTestGenerator
  private componentTestGenerator: ComponentTestGenerator
  private accessibilityTestGenerator: AccessibilityTestGenerator
  private integrationTestGenerator: IntegrationTestGenerator

  constructor() {
    this.blockTestGenerator = new BlockTestGenerator()
    this.propertyTestGenerator = new PropertyTestGenerator()
    this.componentTestGenerator = new ComponentTestGenerator()
    this.accessibilityTestGenerator = new AccessibilityTestGenerator()
    this.integrationTestGenerator = new IntegrationTestGenerator()
  }

  /**
   * Generate complete test suite for blocks
   */
  generateBlockTests(block: Block): TestSuite {
    return this.blockTestGenerator.generateBlockTests(block)
  }

  /**
   * Generate complete test suite for components
   */
  generateComponentTests(component: Component): TestSuite {
    return this.componentTestGenerator.generateComponentTests(component)
  }

  /**
   * Generate integration tests for block-component pairs
   */
  generateIntegrationTests(block: Block, component: Component): TestSuite {
    return this.integrationTestGenerator.generateIntegrationTests(block, component)
  }

  /**
   * Generate property-based tests for validation rules
   */
  generatePropertyTests(block: Block): PropertyTest[] {
    return this.propertyTestGenerator.generatePropertyTests(block)
  }

  /**
   * Generate accessibility tests for components
   */
  generateAccessibilityTests(component: Component): AccessibilityTest[] {
    return this.accessibilityTestGenerator.generateAccessibilityTests(component)
  }

  /**
   * Generate all tests for a complete analysis
   */
  generateAllTests(
    blocks: Block[],
    components: Component[],
    blockComponentPairs: Array<{ block: Block; component: Component }>,
  ): TestGenerationResult {
    const blockTests: TestSuite[] = []
    const componentTests: TestSuite[] = []
    const integrationTests: TestSuite[] = []
    const propertyTests: PropertyTest[] = []
    const accessibilityTests: AccessibilityTest[] = []

    // Generate block tests
    for (const block of blocks) {
      blockTests.push(this.generateBlockTests(block))
      propertyTests.push(...this.generatePropertyTests(block))
    }

    // Generate component tests
    for (const component of components) {
      componentTests.push(this.generateComponentTests(component))
      accessibilityTests.push(...this.generateAccessibilityTests(component))
    }

    // Generate integration tests
    for (const pair of blockComponentPairs) {
      integrationTests.push(this.generateIntegrationTests(pair.block, pair.component))
    }

    return {
      blockTests,
      componentTests,
      integrationTests,
      propertyTests,
      accessibilityTests,
    }
  }

  /**
   * Write test suite to file
   */
  async writeTestSuite(testSuite: TestSuite): Promise<void> {
    const content = this.generateTestFileContent(testSuite)
    // In a real implementation, this would write to the file system
    // For now, we'll just return the content
    console.log(`Would write test file to: ${testSuite.testFilePath}`)
    console.log(content)
  }

  /**
   * Generate complete test file content
   */
  private generateTestFileContent(testSuite: TestSuite): string {
    const parts: string[] = []

    // Add imports
    parts.push(testSuite.imports.join('\n'))
    parts.push('')

    // Add describe block
    const suiteName = this.extractSuiteName(testSuite.testFilePath)
    parts.push(`describe('${suiteName}', () => {`)

    // Add setup
    if (testSuite.setup) {
      parts.push(testSuite.setup)
    }

    // Add tests
    for (const test of testSuite.tests) {
      parts.push(test.code)
    }

    // Add teardown
    if (testSuite.teardown) {
      parts.push(testSuite.teardown)
    }

    parts.push('})')

    return parts.join('\n')
  }

  /**
   * Extract suite name from file path
   */
  private extractSuiteName(filePath: string): string {
    const fileName = filePath.split('/').pop() || ''
    return fileName.replace(/\.test\.(ts|tsx|js|jsx)$/, '')
  }
}
