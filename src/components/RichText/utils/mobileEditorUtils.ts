import React from 'react'
import { cn } from '@/utilities/ui'

// Mobile editor configuration
export interface MobileEditorConfig {
  // Touch-friendly toolbar
  toolbarSize: 'compact' | 'normal' | 'large'
  toolbarPosition: 'top' | 'bottom' | 'floating'

  // Input behavior
  preventZoom: boolean
  enableHapticFeedback: boolean
  autoCorrect: boolean
  spellCheck: boolean

  // Viewport handling
  adjustViewportOnFocus: boolean
  scrollIntoView: boolean

  // Performance
  debounceDelay: number
  throttleScroll: boolean

  // Accessibility
  announceChanges: boolean
  enableVoiceOver: boolean
}

export const DEFAULT_MOBILE_EDITOR_CONFIG: MobileEditorConfig = {
  toolbarSize: 'normal',
  toolbarPosition: 'top',
  preventZoom: true,
  enableHapticFeedback: true,
  autoCorrect: true,
  spellCheck: true,
  adjustViewportOnFocus: true,
  scrollIntoView: true,
  debounceDelay: 300,
  throttleScroll: true,
  announceChanges: true,
  enableVoiceOver: true,
}

// Mobile editor testing utilities
export interface EditorTestResult {
  testName: string
  viewport: string
  passed: boolean
  issues: string[]
  warnings: string[]
  metrics: {
    inputDelay: number
    scrollPerformance: number
    toolbarAccessibility: number
    textReadability: number
  }
}

// Mobile editor usability tests
export class MobileEditorTester {
  private config: MobileEditorConfig
  private results: EditorTestResult[] = []

  constructor(config: MobileEditorConfig = DEFAULT_MOBILE_EDITOR_CONFIG) {
    this.config = config
  }

  // Test editor across different mobile viewports
  async testEditorUsability(): Promise<EditorTestResult[]> {
    const viewports = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPhone 12', width: 390, height: 844 },
      { name: 'iPhone 12 Pro Max', width: 428, height: 926 },
      { name: 'Samsung Galaxy S21', width: 360, height: 800 },
      { name: 'iPad Mini', width: 768, height: 1024 },
    ]

    for (const viewport of viewports) {
      const result = await this.testViewport(viewport)
      this.results.push(result)
    }

    return this.results
  }

  // Test editor at specific viewport
  private async testViewport(viewport: {
    name: string
    width: number
    height: number
  }): Promise<EditorTestResult> {
    const issues: string[] = []
    const warnings: string[] = []
    const metrics = {
      inputDelay: 0,
      scrollPerformance: 0,
      toolbarAccessibility: 0,
      textReadability: 0,
    }

    // Test toolbar usability
    const toolbarIssues = this.testToolbarUsability(viewport)
    issues.push(...toolbarIssues)

    // Test input responsiveness
    const inputIssues = this.testInputResponsiveness(viewport)
    issues.push(...inputIssues)

    // Test text selection
    const selectionIssues = this.testTextSelection(viewport)
    issues.push(...selectionIssues)

    // Test keyboard behavior
    const keyboardIssues = this.testKeyboardBehavior(viewport)
    issues.push(...keyboardIssues)

    // Test scrolling performance
    const scrollIssues = this.testScrollingPerformance(viewport)
    warnings.push(...scrollIssues)

    // Test accessibility
    const a11yIssues = this.testAccessibility(viewport)
    issues.push(...a11yIssues)

    return {
      testName: 'Mobile Editor Usability',
      viewport: viewport.name,
      passed: issues.length === 0,
      issues,
      warnings,
      metrics,
    }
  }

  // Test toolbar usability on mobile
  private testToolbarUsability(viewport: { width: number; height: number }): string[] {
    const issues: string[] = []

    // Check toolbar button sizes
    if (this.config.toolbarSize === 'compact' && viewport.width < 400) {
      issues.push('Toolbar buttons may be too small for comfortable touch interaction')
    }

    // Check toolbar positioning
    if (this.config.toolbarPosition === 'floating' && viewport.height < 700) {
      issues.push('Floating toolbar may obstruct content on small screens')
    }

    // Check toolbar overflow
    if (viewport.width < 375) {
      issues.push('Toolbar may overflow on very small screens')
    }

    return issues
  }

  // Test input responsiveness
  private testInputResponsiveness(viewport: { width: number; height: number }): string[] {
    const issues: string[] = []

    // Check input delay
    if (this.config.debounceDelay > 500) {
      issues.push('Input debounce delay may be too high for responsive editing')
    }

    // Check zoom prevention
    if (!this.config.preventZoom) {
      issues.push('Input fields may cause unwanted zoom on iOS devices')
    }

    // Check viewport adjustment
    if (!this.config.adjustViewportOnFocus && viewport.height < 700) {
      issues.push('Virtual keyboard may obstruct editor content')
    }

    return issues
  }

  // Test text selection behavior
  private testTextSelection(viewport: { width: number; height: number }): string[] {
    const issues: string[] = []

    // Check selection handles
    if (viewport.width < 375) {
      issues.push('Text selection handles may be difficult to use on small screens')
    }

    // Check selection menu
    issues.push('Text selection menu should be tested for proper positioning')

    return issues
  }

  // Test keyboard behavior
  private testKeyboardBehavior(viewport: { width: number; height: number }): string[] {
    const issues: string[] = []

    // Check virtual keyboard handling
    if (viewport.height < 700) {
      issues.push('Virtual keyboard may significantly reduce available editing space')
    }

    // Check scroll behavior with keyboard
    if (!this.config.scrollIntoView) {
      issues.push('Editor may not scroll to keep cursor visible when keyboard appears')
    }

    return issues
  }

  // Test scrolling performance
  private testScrollingPerformance(_viewport: { width: number; height: number }): string[] {
    const warnings: string[] = []

    // Check scroll throttling
    if (!this.config.throttleScroll) {
      warnings.push('Scroll events may impact performance on mobile devices')
    }

    // Check momentum scrolling
    warnings.push('Momentum scrolling should be tested on iOS devices')

    return warnings
  }

  // Test accessibility features
  private testAccessibility(_viewport: { width: number; height: number }): string[] {
    const issues: string[] = []

    // Check VoiceOver support
    if (!this.config.enableVoiceOver) {
      issues.push('VoiceOver support should be enabled for accessibility')
    }

    // Check change announcements
    if (!this.config.announceChanges) {
      issues.push('Content changes should be announced to screen readers')
    }

    // Check focus management
    issues.push('Focus management should be tested with screen readers')

    return issues
  }

  // Get test results
  getResults(): EditorTestResult[] {
    return this.results
  }

  // Generate test report
  generateReport(): string {
    let report = '# Mobile Editor Usability Test Report\n\n'

    const totalTests = this.results.length
    const passedTests = this.results.filter((r) => r.passed).length
    const failedTests = totalTests - passedTests

    report += `## Summary\n`
    report += `- Total Tests: ${totalTests}\n`
    report += `- Passed: ${passedTests}\n`
    report += `- Failed: ${failedTests}\n`
    report += `- Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n\n`

    // Detailed results
    this.results.forEach((result) => {
      report += `### ${result.viewport}\n`
      report += `- Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}\n`

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
}

// Mobile editor enhancement utilities
export const getMobileEditorClasses = (config: Partial<MobileEditorConfig> = {}): string => {
  const mergedConfig = { ...DEFAULT_MOBILE_EDITOR_CONFIG, ...config }

  return cn(
    // Base editor classes
    'w-full min-h-[200px]',
    'border border-input rounded-md',
    'bg-background text-foreground',

    // Touch optimization
    'touch-manipulation',
    'select-text', // Allow text selection

    // Prevent zoom on iOS
    mergedConfig.preventZoom && 'text-base', // 16px minimum to prevent zoom

    // Toolbar positioning
    mergedConfig.toolbarPosition === 'bottom' && 'flex flex-col-reverse',
    mergedConfig.toolbarPosition === 'floating' && 'relative',

    // Performance optimizations
    'will-change-contents',
    'transform-gpu',

    // Accessibility
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  )
}

// Mobile toolbar classes
export const getMobileToolbarClasses = (config: Partial<MobileEditorConfig> = {}): string => {
  const mergedConfig = { ...DEFAULT_MOBILE_EDITOR_CONFIG, ...config }

  return cn(
    // Base toolbar classes
    'flex flex-wrap items-center',
    'border-b border-border',
    'bg-muted/50',
    'p-2',

    // Size variants
    mergedConfig.toolbarSize === 'compact' && 'gap-1 p-1',
    mergedConfig.toolbarSize === 'normal' && 'gap-2 p-2',
    mergedConfig.toolbarSize === 'large' && 'gap-3 p-3',

    // Position variants
    mergedConfig.toolbarPosition === 'floating' &&
      cn('absolute top-0 left-0 right-0 z-10', 'shadow-md rounded-t-md'),
    mergedConfig.toolbarPosition === 'bottom' && 'order-last',

    // Touch optimization
    'touch-manipulation',

    // Scrollable on small screens
    'overflow-x-auto scrollbar-hide',
  )
}

// Mobile toolbar button classes
export const getMobileToolbarButtonClasses = (config: Partial<MobileEditorConfig> = {}): string => {
  const mergedConfig = { ...DEFAULT_MOBILE_EDITOR_CONFIG, ...config }

  return cn(
    // Base button classes
    'inline-flex items-center justify-center',
    'rounded-md font-medium',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',

    // Touch-friendly sizing
    'min-h-[44px] min-w-[44px]',

    // Size variants
    mergedConfig.toolbarSize === 'compact' && 'h-8 w-8 text-xs',
    mergedConfig.toolbarSize === 'normal' && 'h-10 w-10 text-sm',
    mergedConfig.toolbarSize === 'large' && 'h-12 w-12 text-base',

    // Touch optimization
    'touch-manipulation',
    'select-none',
    'active:scale-95 active:transition-transform active:duration-75',

    // Visual feedback
    'hover:bg-accent hover:text-accent-foreground',
    'data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  )
}

// Mobile input area classes
export const getMobileInputAreaClasses = (config: Partial<MobileEditorConfig> = {}): string => {
  const mergedConfig = { ...DEFAULT_MOBILE_EDITOR_CONFIG, ...config }

  return cn(
    // Base input classes
    'flex-1 p-4',
    'min-h-[200px]',
    'resize-none',
    'outline-none',

    // Text styling
    'text-base leading-relaxed', // Prevent zoom and improve readability

    // Prevent zoom on iOS
    mergedConfig.preventZoom && 'text-base',

    // Auto-correct and spell check
    mergedConfig.autoCorrect ? 'autocorrect-on' : 'autocorrect-off',
    mergedConfig.spellCheck ? 'spellcheck' : 'spellcheck-false',

    // Touch optimization
    'touch-manipulation',

    // Scrolling
    'overflow-y-auto',
    mergedConfig.throttleScroll && 'scroll-smooth',

    // Performance
    'will-change-contents',
  )
}

// Viewport meta tag for mobile optimization
export const getMobileViewportMeta = (config: Partial<MobileEditorConfig> = {}): string => {
  const mergedConfig = { ...DEFAULT_MOBILE_EDITOR_CONFIG, ...config }

  const parts = ['width=device-width', 'initial-scale=1']

  if (mergedConfig.preventZoom) {
    parts.push('maximum-scale=1', 'user-scalable=no')
  }

  return parts.join(', ')
}

// Mobile editor keyboard handling
export const handleMobileKeyboard = (
  element: HTMLElement,
  config: Partial<MobileEditorConfig> = {},
): (() => void) => {
  const mergedConfig = { ...DEFAULT_MOBILE_EDITOR_CONFIG, ...config }

  const handleFocus = () => {
    if (mergedConfig.adjustViewportOnFocus) {
      // Adjust viewport when virtual keyboard appears
      setTimeout(() => {
        if (mergedConfig.scrollIntoView) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 300) // Delay to allow keyboard animation
    }
  }

  const handleBlur = () => {
    // Reset viewport when keyboard disappears
    if (mergedConfig.adjustViewportOnFocus) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 300)
    }
  }

  element.addEventListener('focus', handleFocus)
  element.addEventListener('blur', handleBlur)

  // Return cleanup function
  return () => {
    element.removeEventListener('focus', handleFocus)
    element.removeEventListener('blur', handleBlur)
  }
}

// Mobile editor performance monitoring
export const monitorMobileEditorPerformance = (
  element: HTMLElement,
): { getMetrics: () => any; cleanup: () => void } => {
  let inputCount = 0
  let lastInputTime = 0
  let scrollCount = 0
  let lastScrollTime = 0

  const handleInput = () => {
    inputCount++
    lastInputTime = performance.now()
  }

  const handleScroll = () => {
    scrollCount++
    lastScrollTime = performance.now()
  }

  element.addEventListener('input', handleInput)
  element.addEventListener('scroll', handleScroll)

  const getMetrics = () => ({
    inputCount,
    lastInputTime,
    scrollCount,
    lastScrollTime,
    averageInputDelay: inputCount > 0 ? lastInputTime / inputCount : 0,
    averageScrollDelay: scrollCount > 0 ? lastScrollTime / scrollCount : 0,
  })

  const cleanup = () => {
    element.removeEventListener('input', handleInput)
    element.removeEventListener('scroll', handleScroll)
  }

  return { getMetrics, cleanup }
}

// React hook for mobile editor optimization
export const useMobileEditor = (
  ref: React.RefObject<HTMLElement>,
  config: Partial<MobileEditorConfig> = {},
) => {
  React.useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const cleanupKeyboard = handleMobileKeyboard(element, config)
    const { cleanup: cleanupPerformance } = monitorMobileEditorPerformance(element)

    return () => {
      cleanupKeyboard()
      cleanupPerformance()
    }
  }, [ref, config])
}

// Export all utilities
export const mobileEditorUtils = {
  DEFAULT_MOBILE_EDITOR_CONFIG,
  MobileEditorTester,
  getMobileEditorClasses,
  getMobileToolbarClasses,
  getMobileToolbarButtonClasses,
  getMobileInputAreaClasses,
  getMobileViewportMeta,
  handleMobileKeyboard,
  monitorMobileEditorPerformance,
  useMobileEditor,
}
