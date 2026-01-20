import { describe, it, expect } from 'vitest'
import {
  basicTextFeatures,
  alignmentFeatures,
  headingFeatures,
  listFeatures,
  structuralFeatures,
  codeFeatures,
  tableFeatures,
  enhancedLinkFeature,
  comprehensiveRichText,
  standardRichText,
  basicRichText,
  advancedRichText,
  keyboardShortcuts,
} from '../../../src/fields/richTextFeatures'

describe('Rich Text Features', () => {
  it('should export basic text features', () => {
    expect(basicTextFeatures).toBeDefined()
    expect(Array.isArray(basicTextFeatures)).toBe(true)
    expect(basicTextFeatures.length).toBeGreaterThan(0)
  })

  it('should export alignment features', () => {
    expect(alignmentFeatures).toBeDefined()
    expect(Array.isArray(alignmentFeatures)).toBe(true)
    expect(alignmentFeatures.length).toBeGreaterThan(0)
  })

  it('should export heading features', () => {
    expect(headingFeatures).toBeDefined()
    expect(Array.isArray(headingFeatures)).toBe(true)
    expect(headingFeatures.length).toBeGreaterThan(0)
  })

  it('should export list features', () => {
    expect(listFeatures).toBeDefined()
    expect(Array.isArray(listFeatures)).toBe(true)
    expect(listFeatures.length).toBeGreaterThan(0)
  })

  it('should export structural features', () => {
    expect(structuralFeatures).toBeDefined()
    expect(Array.isArray(structuralFeatures)).toBe(true)
    expect(structuralFeatures.length).toBeGreaterThan(0)
  })

  it('should export code features', () => {
    expect(codeFeatures).toBeDefined()
    expect(Array.isArray(codeFeatures)).toBe(true)
    // Note: Code features are empty in current version as they're not available
    expect(codeFeatures.length).toBe(0)
  })

  it('should export table features', () => {
    expect(tableFeatures).toBeDefined()
    expect(Array.isArray(tableFeatures)).toBe(true)
    // Note: Table features are empty in current version as they're not available
    expect(tableFeatures.length).toBe(0)
  })

  it('should export enhanced link feature', () => {
    expect(enhancedLinkFeature).toBeDefined()
    expect(Array.isArray(enhancedLinkFeature)).toBe(true)
    expect(enhancedLinkFeature.length).toBeGreaterThan(0)
  })

  it('should export preset configurations', () => {
    expect(comprehensiveRichText).toBeDefined()
    expect(standardRichText).toBeDefined()
    expect(basicRichText).toBeDefined()
    expect(advancedRichText).toBeDefined()
  })

  it('should export keyboard shortcuts documentation', () => {
    expect(keyboardShortcuts).toBeDefined()
    expect(keyboardShortcuts.formatting).toBeDefined()
    expect(keyboardShortcuts.structure).toBeDefined()
    expect(keyboardShortcuts.lists).toBeDefined()
    expect(keyboardShortcuts.alignment).toBeDefined()
    expect(keyboardShortcuts.links).toBeDefined()
    expect(keyboardShortcuts.tables).toBeDefined()
    expect(keyboardShortcuts.general).toBeDefined()
  })

  it('should have proper keyboard shortcut mappings', () => {
    expect(keyboardShortcuts.formatting.bold).toBe('Ctrl/Cmd + B')
    expect(keyboardShortcuts.formatting.italic).toBe('Ctrl/Cmd + I')
    expect(keyboardShortcuts.structure.heading1).toBe('Ctrl/Cmd + Alt + 1')
    expect(keyboardShortcuts.lists.unorderedList).toBe('Ctrl/Cmd + Shift + 8')
    expect(keyboardShortcuts.alignment.center).toBe('Ctrl/Cmd + Shift + E')
    expect(keyboardShortcuts.links.insertLink).toBe('Ctrl/Cmd + K')
  })
})
