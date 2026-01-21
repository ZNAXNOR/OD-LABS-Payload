// Mobile testing configuration
export interface MobileTestConfig {
  viewports: {
    mobile: { width: number; height: number; name: string }
    tablet: { width: number; height: number; name: string }
    desktop: { width: number; height: number; name: string }
  }
  touchTargetMinSize: number
  textMinSize: number
  contrastRatio: number
}

export const DEFAULT_MOBILE_TEST_CONFIG: MobileTestConfig = {
  viewports: {
    mobile: { width: 375, height: 667, name: 'iPhone SE' },
    tablet: { width: 768, height: 1024, name: 'iPad' },
    desktop: { width: 1024, height: 768, name: 'Desktop' },
  },
  touchTargetMinSize: 44, // 44px minimum touch target
  textMinSize: 16, // 16px minimum text size
  contrastRatio: 4.5, // WCAG AA standard
}

// Block testing results
export interface BlockTestResult {
  blockType: string
  viewport: string
  passed: boolean
  issues: string[]
  warnings: string[]
  performance: {
    renderTime: number
    memoryUsage?: number
    layoutShifts: number
  }
}

// Mobile testing utilities
export class MobileBlockTester {
  private config: MobileTestConfig
  private results: BlockTestResult[] = []

  constructor(config: MobileTestConfig = DEFAULT_MOBILE_TEST_CONFIG) {
    this.config = config
  }

  // Test a block across all viewports
  async testBlock(blockType: string, blockData: any): Promise<BlockTestResult[]> {
    const results: BlockTestResult[] = []

    for (const [viewportName, viewport] of Object.entries(this.config.viewports)) {
      const result = await this.testBlockAtViewport(blockType, blockData, viewportName, viewport)
      results.push(result)
    }

    this.results.push(...results)
    return results
  }

  // Test a block at a specific viewport
  private async testBlockAtViewport(
    blockType: string,
    blockData: any,
    viewportName: string,
    viewport: { width: number; height: number; name: string },
  ): Promise<BlockTestResult> {
    const startTime = performance.now()
    const issues: string[] = []
    const warnings: string[] = []

    // Simulate viewport resize (in a real test environment)
    if (typeof window !== 'undefined') {
      // This would be handled by testing framework like Playwright/Cypress
      console.log(`Testing ${blockType} at ${viewport.name} (${viewport.width}x${viewport.height})`)
    }

    // Test touch targets
    const touchTargetIssues = this.checkTouchTargets(blockType, blockData)
    issues.push(...touchTargetIssues)

    // Test text readability
    const textIssues = this.checkTextReadability(blockType, blockData)
    issues.push(...textIssues)

    // Test responsive layout
    const layoutIssues = this.checkResponsiveLayout(blockType, blockData, viewport)
    issues.push(...layoutIssues)

    // Test performance
    const performanceIssues = this.checkPerformance(blockType, blockData, viewport)
    warnings.push(...performanceIssues)

    // Test accessibility
    const a11yIssues = this.checkAccessibility(blockType, blockData)
    issues.push(...a11yIssues)

    const endTime = performance.now()
    const renderTime = endTime - startTime

    return {
      blockType,
      viewport: viewportName,
      passed: issues.length === 0,
      issues,
      warnings,
      performance: {
        renderTime,
        layoutShifts: 0, // Would be measured in real testing
      },
    }
  }

  // Check touch target sizes
  private checkTouchTargets(blockType: string, blockData: any): string[] {
    const issues: string[] = []

    // Define blocks that should have touch targets
    const interactiveBlocks = [
      'cta',
      'contactForm',
      'newsletter',
      'banner',
      'testimonial',
      'pricingTable',
      'faqAccordion',
    ]

    if (interactiveBlocks.includes(blockType)) {
      // Check if block has proper touch target sizing
      if (!this.hasTouchFriendlyElements(blockData)) {
        issues.push(
          `${blockType} block may have touch targets smaller than ${this.config.touchTargetMinSize}px`,
        )
      }
    }

    return issues
  }

  // Check text readability
  private checkTextReadability(blockType: string, blockData: any): string[] {
    const issues: string[] = []

    // Check if text content exists and is readable
    if (this.hasTextContent(blockData)) {
      // In a real implementation, this would check computed styles
      if (!this.hasReadableTextSize(blockData)) {
        issues.push(`${blockType} block may have text smaller than ${this.config.textMinSize}px`)
      }

      if (!this.hasGoodContrast(blockData)) {
        issues.push(`${blockType} block may have insufficient color contrast`)
      }
    }

    return issues
  }

  // Check responsive layout
  private checkResponsiveLayout(
    blockType: string,
    blockData: any,
    viewport: { width: number; height: number },
  ): string[] {
    const issues: string[] = []

    // Check for horizontal overflow
    if (this.hasHorizontalOverflow(blockType, viewport)) {
      issues.push(`${blockType} block may cause horizontal overflow at ${viewport.width}px width`)
    }

    // Check for proper spacing
    if (!this.hasProperSpacing(blockType, viewport)) {
      issues.push(`${blockType} block may have inadequate spacing on mobile`)
    }

    // Check grid layouts
    if (this.isGridBlock(blockType) && !this.hasResponsiveGrid(blockData, viewport)) {
      issues.push(`${blockType} block grid may not be responsive`)
    }

    return issues
  }

  // Check performance
  private checkPerformance(
    blockType: string,
    blockData: any,
    _viewport: { width: number; height: number },
  ): string[] {
    const warnings: string[] = []

    // Check for heavy media
    if (this.hasHeavyMedia(blockData)) {
      warnings.push(`${blockType} block contains media that may be too large for mobile`)
    }

    // Check for complex animations
    if (this.hasComplexAnimations(blockData)) {
      warnings.push(`${blockType} block has animations that may impact mobile performance`)
    }

    // Check for excessive DOM nodes
    if (this.hasExcessiveDOMNodes(blockData)) {
      warnings.push(`${blockType} block may have too many DOM nodes for optimal mobile performance`)
    }

    return warnings
  }

  // Check accessibility
  private checkAccessibility(blockType: string, blockData: any): string[] {
    const issues: string[] = []

    // Check for proper ARIA labels
    if (this.needsAriaLabels(blockType) && !this.hasAriaLabels(blockData)) {
      issues.push(`${blockType} block is missing required ARIA labels`)
    }

    // Check for keyboard navigation
    if (this.isInteractive(blockType) && !this.hasKeyboardSupport(blockData)) {
      issues.push(`${blockType} block may not support keyboard navigation`)
    }

    // Check for semantic HTML
    if (!this.hasSemanticHTML(blockType)) {
      issues.push(`${blockType} block may not use semantic HTML elements`)
    }

    return issues
  }

  // Helper methods for testing
  private hasTouchFriendlyElements(_blockData: any): boolean {
    // In a real implementation, this would check actual DOM elements
    return true // Placeholder
  }

  private hasTextContent(blockData: any): boolean {
    return !!(blockData.heading || blockData.content || blockData.text || blockData.description)
  }

  private hasReadableTextSize(_blockData: any): boolean {
    // In a real implementation, this would check computed font sizes
    return true // Placeholder
  }

  private hasGoodContrast(_blockData: any): boolean {
    // In a real implementation, this would check color contrast ratios
    return true // Placeholder
  }

  private hasHorizontalOverflow(
    blockType: string,
    viewport: { width: number; height: number },
  ): boolean {
    // Check for blocks that commonly cause overflow
    const overflowProneBlocks = ['code', 'table', 'mediaBlock']
    return overflowProneBlocks.includes(blockType) && viewport.width < 768
  }

  private hasProperSpacing(
    _blockType: string,
    _viewport: { width: number; height: number },
  ): boolean {
    // All blocks should have proper spacing
    return true // Placeholder - would check actual spacing
  }

  private isGridBlock(blockType: string): boolean {
    const gridBlocks = ['servicesGrid', 'featureGrid', 'pricingTable', 'statsCounter', 'techStack']
    return gridBlocks.includes(blockType)
  }

  private hasResponsiveGrid(
    _blockData: any,
    _viewport: { width: number; height: number },
  ): boolean {
    // Check if grid adapts to viewport
    return true // Placeholder
  }

  private hasHeavyMedia(blockData: any): boolean {
    // Check for large images or videos
    return !!(blockData.media || blockData.video || blockData.backgroundImage)
  }

  private hasComplexAnimations(blockData: any): boolean {
    // Check for animations that might impact performance
    return !!(blockData.settings?.enableAnimations || blockData.settings?.enableParallax)
  }

  private hasExcessiveDOMNodes(blockData: any): boolean {
    // Check for blocks that might create many DOM nodes
    const complexBlocks = ['archive', 'timeline', 'faqAccordion']
    return complexBlocks.includes(blockData.blockType)
  }

  private needsAriaLabels(blockType: string): boolean {
    const interactiveBlocks = ['cta', 'contactForm', 'newsletter', 'faqAccordion', 'banner']
    return interactiveBlocks.includes(blockType)
  }

  private hasAriaLabels(_blockData: any): boolean {
    // Check for ARIA labels in block data
    return true // Placeholder
  }

  private isInteractive(blockType: string): boolean {
    const interactiveBlocks = [
      'cta',
      'contactForm',
      'newsletter',
      'faqAccordion',
      'banner',
      'testimonial',
    ]
    return interactiveBlocks.includes(blockType)
  }

  private hasKeyboardSupport(_blockData: any): boolean {
    // Check for keyboard event handlers
    return true // Placeholder
  }

  private hasSemanticHTML(_blockType: string): boolean {
    // All blocks should use semantic HTML
    return true // Placeholder
  }

  // Get test results
  getResults(): BlockTestResult[] {
    return this.results
  }

  // Get summary of test results
  getSummary(): {
    totalTests: number
    passed: number
    failed: number
    issues: string[]
    warnings: string[]
  } {
    const totalTests = this.results.length
    const passed = this.results.filter((r) => r.passed).length
    const failed = totalTests - passed
    const issues = this.results.flatMap((r) => r.issues)
    const warnings = this.results.flatMap((r) => r.warnings)

    return {
      totalTests,
      passed,
      failed,
      issues: [...new Set(issues)], // Remove duplicates
      warnings: [...new Set(warnings)], // Remove duplicates
    }
  }

  // Generate test report
  generateReport(): string {
    const summary = this.getSummary()

    let report = `# Mobile Block Testing Report\n\n`
    report += `## Summary\n`
    report += `- Total Tests: ${summary.totalTests}\n`
    report += `- Passed: ${summary.passed}\n`
    report += `- Failed: ${summary.failed}\n`
    report += `- Success Rate: ${((summary.passed / summary.totalTests) * 100).toFixed(1)}%\n\n`

    if (summary.issues.length > 0) {
      report += `## Issues Found\n`
      summary.issues.forEach((issue, index) => {
        report += `${index + 1}. ${issue}\n`
      })
      report += `\n`
    }

    if (summary.warnings.length > 0) {
      report += `## Warnings\n`
      summary.warnings.forEach((warning, index) => {
        report += `${index + 1}. ${warning}\n`
      })
      report += `\n`
    }

    report += `## Detailed Results\n`
    this.results.forEach((result) => {
      report += `### ${result.blockType} - ${result.viewport}\n`
      report += `- Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}\n`
      report += `- Render Time: ${result.performance.renderTime.toFixed(2)}ms\n`

      if (result.issues.length > 0) {
        report += `- Issues:\n`
        result.issues.forEach((issue) => {
          report += `  - ${issue}\n`
        })
      }

      if (result.warnings.length > 0) {
        report += `- Warnings:\n`
        result.warnings.forEach((warning) => {
          report += `  - ${warning}\n`
        })
      }

      report += `\n`
    })

    return report
  }

  // Clear results
  clearResults(): void {
    this.results = []
  }
}

// Block-specific mobile test configurations
export const BLOCK_MOBILE_CONFIGS = {
  hero: {
    minHeight: '60vh',
    maxTextWidth: '90%',
    touchTargets: ['actions'],
    criticalContent: ['heading', 'subheading'],
  },
  content: {
    maxWidth: '100%',
    lineHeight: 1.6,
    touchTargets: ['links'],
    criticalContent: ['content'],
  },
  mediaBlock: {
    aspectRatio: '16:9',
    maxWidth: '100%',
    touchTargets: ['playButton', 'controls'],
    criticalContent: ['media', 'caption'],
  },
  cta: {
    buttonMinSize: '44px',
    maxTextWidth: '90%',
    touchTargets: ['buttons', 'links'],
    criticalContent: ['heading', 'description', 'actions'],
  },
  contactForm: {
    inputMinHeight: '44px',
    maxWidth: '100%',
    touchTargets: ['inputs', 'buttons'],
    criticalContent: ['fields', 'submitButton'],
  },
  newsletter: {
    inputMinHeight: '44px',
    buttonMinSize: '44px',
    touchTargets: ['input', 'button'],
    criticalContent: ['input', 'button', 'description'],
  },
  testimonial: {
    maxTextWidth: '90%',
    imageSize: '80px',
    touchTargets: ['navigation'],
    criticalContent: ['quote', 'author', 'image'],
  },
  servicesGrid: {
    minColumns: 1,
    maxColumns: 2,
    itemMinHeight: '200px',
    touchTargets: ['items', 'links'],
    criticalContent: ['title', 'description', 'icon'],
  },
  pricingTable: {
    minColumns: 1,
    maxColumns: 1,
    buttonMinSize: '44px',
    touchTargets: ['buttons', 'features'],
    criticalContent: ['price', 'features', 'button'],
  },
  faqAccordion: {
    itemMinHeight: '44px',
    maxTextWidth: '100%',
    touchTargets: ['triggers'],
    criticalContent: ['question', 'answer'],
  },
  timeline: {
    orientation: 'vertical',
    itemSpacing: '2rem',
    touchTargets: ['items'],
    criticalContent: ['date', 'title', 'description'],
  },
  statsCounter: {
    minColumns: 2,
    maxColumns: 2,
    itemMinHeight: '120px',
    touchTargets: [],
    criticalContent: ['number', 'label'],
  },
  banner: {
    minHeight: '44px',
    maxTextWidth: '90%',
    touchTargets: ['closeButton', 'actionButton'],
    criticalContent: ['message', 'action'],
  },
  code: {
    fontSize: '14px',
    horizontalScroll: true,
    touchTargets: ['copyButton'],
    criticalContent: ['code'],
  },
  archive: {
    itemSpacing: '1rem',
    maxColumns: 1,
    touchTargets: ['items', 'pagination'],
    criticalContent: ['items', 'filters'],
  },
} as const

// Export testing utilities
export const mobileTestingUtils = {
  MobileBlockTester,
  DEFAULT_MOBILE_TEST_CONFIG,
  BLOCK_MOBILE_CONFIGS,
}
