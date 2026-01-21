/**
 * Core TypeScript interfaces and types for the Blocks and Components Analysis System
 * Based on design document specifications
 */

// ============================================================================
// Analysis Orchestrator Types
// ============================================================================

export interface AnalysisOptions {
  blockDir: string
  componentDir: string
  includeTests?: boolean
  compareOfficial?: boolean
  severity?: 'all' | 'critical' | 'high'
}

export interface AnalysisResult {
  blocks: BlockAnalysisResult[]
  components: ComponentAnalysisResult[]
  integration: IntegrationResult
  patterns: PatternComparisonResult
  tests: TestGenerationResult
  report: Report
}

// ============================================================================
// Block Analyzer Types
// ============================================================================

export interface BlockAnalysisResult {
  blockPath: string
  blockSlug: string
  issues: Issue[]
  suggestions: Suggestion[]
  metrics: BlockMetrics
}

export interface FieldValidationResult {
  fieldPath: string
  hasValidation: boolean
  missingValidations: string[]
  severity: 'critical' | 'high' | 'medium' | 'low'
}

export interface TypingIssue {
  type: 'missing-interface-name' | 'weak-typing' | 'any-type'
  location: string
  suggestion: string
}

export interface SecurityIssue {
  type: 'missing-access-control' | 'insecure-default' | 'override-access-misuse'
  severity: 'critical' | 'high' | 'medium'
  description: string
  remediation: string
}

export interface AdminConfigIssue {
  type: 'missing-description' | 'missing-condition' | 'missing-group' | 'missing-placeholder'
  fieldPath: string
  suggestion: string
}

export interface BlockMetrics {
  fieldCount: number
  nestedDepth: number
  hasAccessControl: boolean
  hasValidation: boolean
  hasInterfaceName: boolean
  complexityScore: number
}

// ============================================================================
// Component Analyzer Types
// ============================================================================

export interface ComponentAnalysisResult {
  componentPath: string
  componentName: string
  componentType: 'server' | 'client'
  issues: Issue[]
  suggestions: Suggestion[]
  metrics: ComponentMetrics
}

export interface AccessibilityIssue {
  type:
    | 'missing-alt'
    | 'missing-aria-label'
    | 'no-semantic-html'
    | 'missing-keyboard-nav'
    | 'insufficient-contrast'
    | 'missing-live-region'
  element: string
  line: number
  wcagLevel: 'A' | 'AA' | 'AAA'
  remediation: string
}

export interface PerformanceIssue {
  type:
    | 'unnecessary-rerender'
    | 'missing-memo'
    | 'large-list'
    | 'missing-lazy-load'
    | 'heavy-dependency'
  description: string
  impact: 'high' | 'medium' | 'low'
  suggestion: string
}

export interface ComponentMetrics {
  lineCount: number
  complexity: number
  hasErrorBoundary: boolean
  hasLoadingState: boolean
  accessibilityScore: number
  performanceScore: number
}

// ============================================================================
// Integration Validator Types
// ============================================================================

export interface IntegrationResult {
  blockSlug: string
  componentName: string
  isValid: boolean
  issues: IntegrationIssue[]
  suggestions: string[]
}

export interface MappingIssue {
  type: 'missing-prop' | 'extra-prop' | 'type-mismatch'
  fieldName: string
  expected: string
  actual: string
  severity: 'critical' | 'high' | 'medium'
}

export interface NamingIssue {
  type: 'slug-mismatch' | 'interface-mismatch' | 'file-name-mismatch'
  expected: string
  actual: string
}

export interface PreviewIssue {
  type: 'missing-preview-file' | 'invalid-preview-props' | 'preview-error'
  description: string
  remediation: string
}

export type IntegrationIssue = MappingIssue | NamingIssue | PreviewIssue

// ============================================================================
// Pattern Comparator Types
// ============================================================================

export interface OfficialPattern {
  source: 'payloadcms/website' | 'payloadcms/public-demo'
  blockSlug: string
  config: Block
  component?: string
  features: string[]
}

export interface PatternComparisonResult {
  blockSlug: string
  structuralDifferences: StructuralDiff[]
  featureDifferences: FeatureDiff[]
  organizationDifferences: OrganizationDiff[]
}

export interface StructuralDiff {
  type: 'field-order' | 'field-grouping' | 'nesting-depth'
  description: string
  officialApproach: string
  currentApproach: string
}

export interface FeatureDiff {
  featureName: string
  presentInOfficial: boolean
  presentInCurrent: boolean
  description: string
}

export interface OrganizationDiff {
  type: 'field-organization' | 'naming-convention' | 'structure-pattern'
  description: string
  recommendation: string
}

export interface MissingFeature {
  featureName: string
  description: string
  usedInOfficial: string[]
  benefit: string
  implementationComplexity: 'low' | 'medium' | 'high'
}

// ============================================================================
// Test Generator Types
// ============================================================================

export interface TestGenerationResult {
  blockTests: TestSuite[]
  componentTests: TestSuite[]
  integrationTests: TestSuite[]
  propertyTests: PropertyTest[]
  accessibilityTests: AccessibilityTest[]
}

export interface TestSuite {
  testFilePath: string
  imports: string[]
  tests: Test[]
  setup?: string
  teardown?: string
}

export interface Test {
  type: 'unit' | 'integration' | 'property' | 'accessibility' | 'performance'
  name: string
  code: string
  dependencies: string[]
}

export interface PropertyTest extends Test {
  iterations: number
  generators: Generator[]
  property: string
}

export interface AccessibilityTest extends Test {
  wcagLevel: 'A' | 'AA' | 'AAA'
  testType: 'keyboard-nav' | 'screen-reader' | 'aria-attributes' | 'contrast'
}

export interface Generator {
  name: string
  type: string
  constraints?: any
}

// ============================================================================
// Report Generator Types
// ============================================================================

export interface Report {
  summary: Summary
  blockAnalysis: BlockReport[]
  componentAnalysis: ComponentReport[]
  integrationAnalysis: IntegrationReport
  patternComparison: PatternReport
  implementationGuide: ImplementationGuide
  generatedAt: Date
}

export interface Summary {
  totalBlocks: number
  totalComponents: number
  totalIssues: number
  issuesBySeverity: Record<string, number>
  overallScore: number
  topIssues: Issue[]
}

export interface BlockReport {
  blockSlug: string
  blockPath: string
  issues: Issue[]
  metrics: BlockMetrics
  recommendations: Recommendation[]
}

export interface ComponentReport {
  componentName: string
  componentPath: string
  componentType: 'server' | 'client'
  issues: Issue[]
  metrics: ComponentMetrics
  recommendations: Recommendation[]
}

export interface IntegrationReport {
  validPairs: number
  invalidPairs: number
  issues: IntegrationIssue[]
  recommendations: Recommendation[]
}

export interface PatternReport {
  comparisonResults: PatternComparisonResult[]
  missingFeatures: MissingFeature[]
  recommendations: Recommendation[]
}

export interface ImplementationGuide {
  improvements: PrioritizedImprovement[]
  migrationPlan?: MigrationPlan
  estimatedEffort: string
}

export interface PrioritizedImprovement {
  priority: number
  title: string
  description: string
  affectedFiles: string[]
  steps: ImplementationStep[]
  codeExamples: CodeExample[]
  estimatedTime: string
}

export interface ImplementationStep {
  stepNumber: number
  description: string
  code?: string
  affectedFiles: string[]
}

export interface CodeExample {
  title: string
  before?: string
  after: string
  language: string
}

export interface MigrationPlan {
  phases: MigrationPhase[]
  breakingChanges: BreakingChange[]
  rollbackStrategy: string
}

export interface MigrationPhase {
  phaseNumber: number
  title: string
  description: string
  steps: ImplementationStep[]
  estimatedTime: string
}

export interface BreakingChange {
  type: 'api-change' | 'schema-change' | 'behavior-change'
  description: string
  impact: string
  mitigation: string
}

// ============================================================================
// Common Types
// ============================================================================

export interface Issue {
  id: string
  type: IssueType
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: 'security' | 'accessibility' | 'performance' | 'typing' | 'best-practice'
  title: string
  description: string
  location: Location
  remediation: string
  codeExample?: string
  relatedIssues?: string[]
}

export interface Location {
  file: string
  line?: number
  column?: number
  snippet?: string
}

export type IssueType =
  | 'missing-validation'
  | 'missing-access-control'
  | 'missing-interface-name'
  | 'missing-alt-text'
  | 'missing-aria-label'
  | 'no-semantic-html'
  | 'missing-keyboard-nav'
  | 'insufficient-contrast'
  | 'xss-vulnerability'
  | 'unnecessary-rerender'
  | 'missing-memo'
  | 'weak-typing'
  | 'field-prop-mismatch'
  | 'naming-inconsistency'

export interface Suggestion {
  type: 'improvement' | 'optimization' | 'refactor'
  title: string
  description: string
  benefit: string
  effort: 'low' | 'medium' | 'high'
}

export interface Recommendation {
  priority: number
  title: string
  description: string
  codeExample?: CodeExample
  estimatedTime: string
}

// ============================================================================
// Block Configuration Model (Payload CMS)
// ============================================================================

export interface Block {
  slug: string
  interfaceName?: string
  labels?: {
    singular: string
    plural: string
  }
  fields: Field[]
  access?: AccessControl
  admin?: AdminConfig
  hooks?: BlockHooks
}

export interface Field {
  name: string
  type: FieldType
  required?: boolean
  unique?: boolean
  index?: boolean
  validate?: ValidationFunction
  access?: FieldAccessControl
  admin?: FieldAdminConfig
  // Type-specific properties
  [key: string]: any
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'select'
  | 'radio'
  | 'relationship'
  | 'upload'
  | 'richText'
  | 'array'
  | 'group'
  | 'blocks'
  | 'row'
  | 'collapsible'
  | 'tabs'
  | 'point'
  | 'json'
  | 'code'
  | 'ui'

export type ValidationFunction = (value: any, args: any) => boolean | string

export interface AccessControl {
  create?: AccessFunction
  read?: AccessFunction
  update?: AccessFunction
  delete?: AccessFunction
}

export interface FieldAccessControl {
  create?: AccessFunction
  read?: AccessFunction
  update?: AccessFunction
}

export type AccessFunction = (args: any) => boolean | Promise<boolean>

export interface AdminConfig {
  useAsTitle?: string
  defaultColumns?: string[]
  group?: string
  hidden?: boolean
  description?: string
  condition?: (data: any) => boolean
  preview?: string
}

export interface FieldAdminConfig {
  position?: 'sidebar' | 'main'
  width?: string
  description?: string
  placeholder?: string
  condition?: (data: any, siblingData: any) => boolean
  readOnly?: boolean
  hidden?: boolean
}

export interface BlockHooks {
  beforeValidate?: HookFunction[]
  beforeChange?: HookFunction[]
  afterChange?: HookFunction[]
  afterRead?: HookFunction[]
  beforeDelete?: HookFunction[]
  afterDelete?: HookFunction[]
}

export type HookFunction = (args: any) => any | Promise<any>

// ============================================================================
// Component Model (React)
// ============================================================================

export interface Component {
  path: string
  name: string
  type: 'server' | 'client'
  props: PropDefinition[]
  imports: Import[]
  exports: Export[]
  jsx: JSXElement[]
  hooks: ReactHook[]
  ast: any // TypeScript AST node
}

export interface PropDefinition {
  name: string
  type: string
  required: boolean
  defaultValue?: any
}

export interface Import {
  source: string
  specifiers: string[]
  isDefault?: boolean
}

export interface Export {
  name: string
  isDefault: boolean
}

export interface JSXElement {
  type: string
  props: Record<string, any>
  children: JSXElement[]
  line: number
}

export interface ReactHook {
  name: string
  line: number
}

// ============================================================================
// Analyzer Interfaces
// ============================================================================

export interface BlockAnalyzer {
  analyzeBlock(blockPath: string): Promise<BlockAnalysisResult>
  validateFields(block: Block): FieldValidationResult[]
  checkTyping(block: Block): TypingIssue[]
  checkAccessControl(block: Block): SecurityIssue[]
  checkAdminConfig(block: Block): AdminConfigIssue[]
}

export interface ComponentAnalyzer {
  analyzeComponent(componentPath: string): Promise<ComponentAnalysisResult>
  detectComponentType(source: string): 'server' | 'client'
  checkAccessibility(ast: any): AccessibilityIssue[]
  checkPerformance(ast: any): PerformanceIssue[]
  checkTyping(ast: any): TypingIssue[]
  checkSecurity(ast: any): SecurityIssue[]
}

export interface IntegrationValidator {
  validateIntegration(block: Block, component: Component): IntegrationResult
  validateFieldMapping(blockFields: Field[], componentProps: PropDefinition[]): MappingIssue[]
  validateNaming(block: Block, component: Component): NamingIssue[]
  validatePreview(block: Block): PreviewIssue[]
}

export interface PatternComparator {
  fetchOfficialPatterns(): Promise<OfficialPattern[]>
  compareBlock(localBlock: Block, officialBlock: Block): PatternComparisonResult
  identifyMissingFeatures(local: Block[], official: Block[]): MissingFeature[]
  suggestImprovements(comparison: PatternComparisonResult): Recommendation[]
}

export interface TestGenerator {
  generateBlockTests(block: Block): TestSuite
  generateComponentTests(component: Component): TestSuite
  generateIntegrationTests(block: Block, component: Component): TestSuite
  generatePropertyTests(validation: any): PropertyTest
  generateAccessibilityTests(component: Component): AccessibilityTest[]
}

export interface ReportGenerator {
  generateReport(analysisResult: AnalysisResult): Report
  generateSummary(issues: Issue[]): Summary
  generateImplementationGuide(improvements: PrioritizedImprovement[]): ImplementationGuide
  prioritizeIssues(issues: Issue[]): Issue[]
}

export interface AnalysisOrchestrator {
  analyze(options: AnalysisOptions): Promise<AnalysisResult>
  analyzeBlocks(blockPaths: string[]): Promise<BlockAnalysisResult[]>
  analyzeComponents(componentPaths: string[]): Promise<ComponentAnalysisResult[]>
  validateIntegration(): Promise<IntegrationResult>
  comparePatterns(): Promise<PatternComparisonResult>
  generateTests(): Promise<TestGenerationResult>
  generateReport(): Promise<Report>
}

// ============================================================================
// CLI Types
// ============================================================================

export type OutputFormat = 'console' | 'json' | 'html'

export interface CLIOptions {
  blocksDir: string
  componentsDir: string
  scope: 'blocks' | 'components' | 'full'
  format: OutputFormat
  output?: string
  tests: boolean
  patterns: boolean
  severity: 'all' | 'critical' | 'high'
  verbose: boolean
}

export interface OutputFormatter {
  format(result: any): Promise<string>
  writeToFile?(content: string, filePath: string): Promise<void>
}
