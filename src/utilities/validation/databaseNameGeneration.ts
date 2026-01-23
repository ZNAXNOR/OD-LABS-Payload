/**
 * Database Name Generation Utilities
 *
 * This module provides intelligent database name generation with abbreviation rules
 * to ensure PostgreSQL identifier length compliance while maintaining semantic meaning.
 *
 * Requirements addressed: 2.1, 2.2, 2.3, 6.1, 6.2, 6.3
 */

import { POSTGRES_IDENTIFIER_LIMIT } from './identifierAnalysis'

// Re-export for convenience
export { POSTGRES_IDENTIFIER_LIMIT }

/**
 * Configuration for database name generation
 */
export interface DatabaseNameConfig {
  /** Maximum allowed length (default: 63 for PostgreSQL) */
  maxLength?: number
  /** Whether to preserve semantic meaning over brevity */
  preserveSemantics?: boolean
  /** Custom abbreviation rules */
  customAbbreviations?: Record<string, string>
  /** Whether to use context-aware abbreviations */
  useContextAware?: boolean
}

/**
 * Default database name generation configuration
 */
export const DEFAULT_DB_NAME_CONFIG: Required<DatabaseNameConfig> = {
  maxLength: POSTGRES_IDENTIFIER_LIMIT,
  preserveSemantics: true,
  customAbbreviations: {},
  useContextAware: true,
}

/**
 * Standard abbreviation rules for common terms
 */
export const STANDARD_ABBREVIATIONS: Record<string, string> = {
  // Navigation and UI
  navigation: 'nav',
  description: 'desc',
  information: 'info',
  configuration: 'config',
  featured: 'feat',
  reference: 'ref',
  relationship: 'rel',
  background: 'bg',
  foreground: 'fg',

  // Content and Media
  content: 'content', // Keep as-is, already short
  media: 'media', // Keep as-is, already short
  image: 'img',
  video: 'vid',
  audio: 'aud',
  document: 'doc',
  attachment: 'attach',
  thumbnail: 'thumb',

  // Actions and States
  button: 'btn',
  action: 'action', // Keep as-is
  status: 'status', // Keep as-is
  enabled: 'enabled', // Keep as-is
  disabled: 'disabled', // Keep as-is
  visible: 'visible', // Keep as-is
  hidden: 'hidden', // Keep as-is

  // Layout and Structure
  container: 'container', // Keep as-is
  wrapper: 'wrap',
  section: 'sect',
  header: 'header', // Keep as-is
  footer: 'footer', // Keep as-is
  sidebar: 'sidebar', // Keep as-is

  // Business Logic
  category: 'cat',
  categories: 'cats',
  product: 'prod',
  service: 'svc',
  customer: 'cust',
  order: 'order', // Keep as-is
  payment: 'pay',
  shipping: 'ship',
  billing: 'bill',

  // Technical Terms
  database: 'db',
  identifier: 'id',
  parameter: 'param',
  attribute: 'attr',
  property: 'prop',
  method: 'method', // Keep as-is
  function: 'func',
  variable: 'var',
  constant: 'const',

  // Time and Dates
  created: 'created', // Keep as-is
  updated: 'updated', // Keep as-is
  modified: 'mod',
  timestamp: 'ts',
  datetime: 'dt',
  published: 'pub',
  scheduled: 'sched',

  // User and Auth
  user: 'user', // Keep as-is
  admin: 'admin', // Keep as-is
  authentication: 'auth',
  authorization: 'authz',
  permission: 'perm',
  role: 'role', // Keep as-is
  profile: 'profile', // Keep as-is

  // Forms and Input
  form: 'form', // Keep as-is
  field: 'field', // Keep as-is
  input: 'input', // Keep as-is
  select: 'select', // Keep as-is
  option: 'opt',
  checkbox: 'check',
  radio: 'radio', // Keep as-is
  textarea: 'textarea', // Keep as-is

  // SEO and Meta
  search: 'search', // Keep as-is
  optimization: 'opt',
  metadata: 'meta',
  keywords: 'keys',
  title: 'title', // Keep as-is
  slug: 'slug', // Keep as-is
}
/**
 * Context-aware abbreviation rules
 * These rules apply different abbreviations based on the context
 */
export const CONTEXT_AWARE_ABBREVIATIONS: Record<string, Record<string, string>> = {
  // Navigation context
  navigation: {
    items: 'items', // Keep as-is in nav context
    links: 'links', // Keep as-is in nav context
    menu: 'menu', // Keep as-is in nav context
    dropdown: 'dd',
    submenu: 'sub',
  },

  // Form context
  form: {
    validation: 'val',
    required: 'req',
    optional: 'opt',
    placeholder: 'ph',
    label: 'lbl',
  },

  // Media context
  media: {
    resolution: 'res',
    quality: 'qual',
    format: 'fmt',
    size: 'size', // Keep as-is
    width: 'w',
    height: 'h',
  },

  // E-commerce context
  ecommerce: {
    price: 'price', // Keep as-is
    discount: 'disc',
    coupon: 'coup',
    inventory: 'inv',
    stock: 'stock', // Keep as-is
    quantity: 'qty',
  },
}

/**
 * Reserved words that should not be abbreviated
 */
export const RESERVED_WORDS = new Set([
  'id',
  'name',
  'type',
  'slug',
  'url',
  'api',
  'cms',
  'seo',
  'ui',
  'ux',
])

/**
 * Generate a database-safe name from a field name
 */
export function generateDatabaseName(
  fieldName: string,
  context?: string,
  config: DatabaseNameConfig = {},
): string {
  const finalConfig = { ...DEFAULT_DB_NAME_CONFIG, ...config }

  if (!fieldName || typeof fieldName !== 'string') {
    throw new Error('Field name is required and must be a string')
  }

  const trimmed = fieldName.trim()
  if (trimmed === '') {
    throw new Error('Field name cannot be empty or whitespace only')
  }

  // Start with the original field name
  let dbName = trimmed

  // Convert to snake_case
  dbName = convertToSnakeCase(dbName)

  // Handle empty result from conversion
  if (!dbName) {
    throw new Error('Field name must contain at least one alphanumeric character')
  }

  // Apply abbreviations if needed
  if (dbName.length > finalConfig.maxLength) {
    dbName = applyAbbreviations(dbName, context, finalConfig)
  }

  // Final length check and truncation if necessary
  if (dbName.length > finalConfig.maxLength) {
    dbName = intelligentTruncation(dbName, finalConfig.maxLength)
  }

  // Validate the result
  validateDatabaseName(dbName)

  return dbName
}

/**
 * Convert camelCase/PascalCase to snake_case
 */
export function convertToSnakeCase(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  const result = input
    // Handle acronyms (e.g., HTMLParser -> HTML_Parser)
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    // Handle normal camelCase (e.g., camelCase -> camel_Case)
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    // Convert to lowercase
    .toLowerCase()
    // Replace any non-alphanumeric characters with underscores
    .replace(/[^a-z0-9]+/g, '_')
    // Remove leading/trailing underscores
    .replace(/^_+|_+$/g, '')
    // Replace multiple consecutive underscores with single underscore
    .replace(/_+/g, '_')

  return result
}

/**
 * Apply abbreviation rules to reduce length
 */
export function applyAbbreviations(
  input: string,
  context?: string,
  config: Required<DatabaseNameConfig> = DEFAULT_DB_NAME_CONFIG,
): string {
  if (!input) {
    return input
  }

  const words = input.split('_').filter((word) => word.length > 0)
  const abbreviatedWords: string[] = []

  for (const word of words) {
    // Skip reserved words
    if (RESERVED_WORDS.has(word)) {
      abbreviatedWords.push(word)
      continue
    }

    let abbreviatedWord = word

    // Apply custom abbreviations first
    if (config.customAbbreviations[word]) {
      abbreviatedWord = config.customAbbreviations[word]
    }
    // Apply context-aware abbreviations
    else if (config.useContextAware && context && CONTEXT_AWARE_ABBREVIATIONS[context]?.[word]) {
      abbreviatedWord = CONTEXT_AWARE_ABBREVIATIONS[context][word]
    }
    // Apply standard abbreviations
    else if (STANDARD_ABBREVIATIONS[word]) {
      abbreviatedWord = STANDARD_ABBREVIATIONS[word]
    }
    // If no abbreviation found and word is long, try intelligent shortening
    else if (word.length > 6) {
      abbreviatedWord = intelligentWordShortening(word)
    }

    if (abbreviatedWord && abbreviatedWord.length > 0) {
      abbreviatedWords.push(abbreviatedWord)
    }
  }

  return abbreviatedWords.join('_')
}

/**
 * Intelligent word shortening for words without standard abbreviations
 */
export function intelligentWordShortening(word: string): string {
  if (word.length <= 4) {
    return word
  }

  // Remove vowels from the middle, keeping first and last characters
  if (word.length > 6) {
    const first = word[0]
    const last = word[word.length - 1]
    const middle = word.slice(1, -1)

    // Remove vowels from middle, but keep at least one consonant
    const consonants = middle.replace(/[aeiou]/g, '')
    if (consonants.length > 0) {
      const shortened = first + consonants + last
      if (shortened.length >= 3) {
        return shortened
      }
    }
  }

  // Fallback: truncate to 6 characters
  return word.substring(0, 6)
}

/**
 * Intelligent truncation that preserves meaning
 */
export function intelligentTruncation(input: string, maxLength: number): string {
  if (!input || maxLength <= 0) {
    return ''
  }

  if (input.length <= maxLength) {
    return input
  }

  const words = input.split('_').filter((word) => word.length > 0)

  // If single word, truncate it
  if (words.length === 1) {
    return input.substring(0, Math.max(1, maxLength))
  }

  // Try removing words from the end until we fit
  let result = input
  while (result.length > maxLength && words.length > 1) {
    words.pop()
    result = words.join('_')
  }

  // If still too long, truncate the last word
  if (result.length > maxLength) {
    const lastWordIndex = result.lastIndexOf('_')
    if (lastWordIndex > 0) {
      const prefix = result.substring(0, lastWordIndex + 1)
      const remainingLength = maxLength - prefix.length
      if (remainingLength > 0) {
        const lastWord = result.substring(lastWordIndex + 1)
        result = prefix + lastWord.substring(0, remainingLength)
      } else {
        result = result.substring(0, Math.max(1, maxLength))
      }
    } else {
      result = result.substring(0, Math.max(1, maxLength))
    }
  }

  return result
}

/**
 * Validate that a database name is valid
 */
export function validateDatabaseName(dbName: string): void {
  if (!dbName) {
    throw new Error('Database name cannot be empty')
  }

  if (!/^[a-z][a-z0-9_]*$/.test(dbName)) {
    throw new Error(
      'Database name must start with a letter and contain only lowercase letters, numbers, and underscores',
    )
  }

  if (dbName.endsWith('_')) {
    throw new Error('Database name cannot end with an underscore')
  }

  if (dbName.includes('__')) {
    throw new Error('Database name cannot contain consecutive underscores')
  }
}

/**
 * Generate database name suggestions for a field
 */
export function generateDbNameSuggestions(
  fieldName: string,
  context?: string,
  count = 3,
): string[] {
  const suggestions: string[] = []

  // Base suggestion
  try {
    const baseSuggestion = generateDatabaseName(fieldName, context)
    suggestions.push(baseSuggestion)
  } catch {
    // If base generation fails, continue with alternatives
  }

  // More aggressive abbreviation
  try {
    const aggressiveConfig: DatabaseNameConfig = {
      maxLength: Math.floor(POSTGRES_IDENTIFIER_LIMIT * 0.8), // 80% of limit
      preserveSemantics: false,
    }
    const aggressiveSuggestion = generateDatabaseName(fieldName, context, aggressiveConfig)
    if (!suggestions.includes(aggressiveSuggestion)) {
      suggestions.push(aggressiveSuggestion)
    }
  } catch {
    // Continue if this fails
  }

  // Ultra-short version
  try {
    const words = convertToSnakeCase(fieldName).split('_')
    const ultraShort = words
      .map((word) => {
        if (RESERVED_WORDS.has(word)) return word
        if (word.length <= 2) return word
        return word.substring(0, 2)
      })
      .join('_')

    if (ultraShort.length <= POSTGRES_IDENTIFIER_LIMIT && !suggestions.includes(ultraShort)) {
      suggestions.push(ultraShort)
    }
  } catch {
    // Continue if this fails
  }

  return suggestions.slice(0, count)
}

/**
 * Analyze the effectiveness of a database name
 */
export interface DbNameAnalysis {
  /** The analyzed database name */
  dbName: string
  /** Length of the name */
  length: number
  /** Whether it's within PostgreSQL limits */
  isValid: boolean
  /** Semantic preservation score (0-1) */
  semanticScore: number
  /** Readability score (0-1) */
  readabilityScore: number
  /** Overall quality score (0-1) */
  qualityScore: number
  /** Suggestions for improvement */
  improvements: string[]
}

/**
 * Analyze the quality of a database name
 */
export function analyzeDatabaseName(dbName: string, originalFieldName: string): DbNameAnalysis {
  const improvements: string[] = []

  // Basic validation
  let isValid = true
  try {
    validateDatabaseName(dbName)
  } catch {
    isValid = false
    improvements.push(
      'Fix validation errors (must start with letter, use only lowercase, numbers, underscores)',
    )
  }

  // Length analysis
  const length = dbName.length
  if (length > POSTGRES_IDENTIFIER_LIMIT) {
    isValid = false
    improvements.push(`Reduce length by ${length - POSTGRES_IDENTIFIER_LIMIT} characters`)
  } else if (length > POSTGRES_IDENTIFIER_LIMIT * 0.9) {
    improvements.push('Consider shortening to avoid future issues')
  }

  // Semantic preservation score
  const originalWords = convertToSnakeCase(originalFieldName).split('_')
  const dbNameWords = dbName.split('_')

  let semanticMatches = 0
  for (const originalWord of originalWords) {
    if (
      dbNameWords.includes(originalWord) ||
      dbNameWords.some((dbWord) => STANDARD_ABBREVIATIONS[originalWord] === dbWord)
    ) {
      semanticMatches++
    }
  }
  const semanticScore = originalWords.length > 0 ? semanticMatches / originalWords.length : 0

  if (semanticScore < 0.5) {
    improvements.push('Consider preserving more semantic meaning from original field name')
  }

  // Readability score
  const avgWordLength = dbNameWords.reduce((sum, word) => sum + word.length, 0) / dbNameWords.length
  const readabilityScore = Math.max(0, Math.min(1, (6 - avgWordLength) / 3 + 0.5))

  if (readabilityScore < 0.6) {
    improvements.push('Consider using more readable abbreviations')
  }

  // Overall quality score
  const lengthScore = Math.max(0, (POSTGRES_IDENTIFIER_LIMIT - length) / POSTGRES_IDENTIFIER_LIMIT)
  const qualityScore = semanticScore * 0.4 + readabilityScore * 0.3 + lengthScore * 0.3

  return {
    dbName,
    length,
    isValid,
    semanticScore,
    readabilityScore,
    qualityScore,
    improvements,
  }
}
