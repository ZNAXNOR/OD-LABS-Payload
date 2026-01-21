/**
 * Analyzers Index
 * Exports all analyzer classes and path configuration
 */

export { BlockAnalyzer } from './BlockAnalyzer'
export { BlockConfigParser } from './BlockConfigParser'
export { FieldValidator } from './FieldValidator'
export { TypingAnalyzer } from './TypingAnalyzer'
export { AccessControlAnalyzer } from './AccessControlAnalyzer'
export { AdminConfigAnalyzer } from './AdminConfigAnalyzer'

export { ComponentAnalyzer } from './ComponentAnalyzer'
export { ComponentParser } from './ComponentParser'
export { PropTypeAnalyzer } from './PropTypeAnalyzer'
export { AccessibilityAnalyzer } from './AccessibilityAnalyzer'
export { PerformanceAnalyzer } from './PerformanceAnalyzer'
export { ErrorHandlingAnalyzer } from './ErrorHandlingAnalyzer'

export { IntegrationValidator } from './IntegrationValidator'

export { SecurityAnalyzer } from './SecurityAnalyzer'

export { PatternComparator } from './PatternComparator'
export { GitHubPatternFetcher } from './GitHubPatternFetcher'
export { StructuralComparator } from './StructuralComparator'
export { FeatureDetector } from './FeatureDetector'

export { AnalysisOrchestrator } from './AnalysisOrchestrator'

// Export path configuration
export { PathResolver, DEFAULT_PATHS, LEGACY_PATHS, getPaths } from '../config/paths'

export type { ParsedBlockConfig, ParseError } from './BlockConfigParser'
export type { ExtractedField } from './FieldValidator'
export type { AccessControlReport } from './AccessControlAnalyzer'
export type { AdminConfigReport } from './AdminConfigAnalyzer'
export type { ParsedComponent } from './ComponentParser'
export type { ErrorHandlingIssue } from './ErrorHandlingAnalyzer'
export type { GitHubConfig, GitHubRateLimit, GitHubFileContent } from './GitHubPatternFetcher'
export type { StructureAnalysis } from './StructuralComparator'
export type { FeatureType, DetectedFeature } from './FeatureDetector'
export type { PatternComparatorConfig } from './PatternComparator'
export type { SecurityAnalysisReport } from './SecurityAnalyzer'
export type { OrchestratorConfig, ProgressCallback } from './AnalysisOrchestrator'
export type { PathConfig } from '../config/paths'
