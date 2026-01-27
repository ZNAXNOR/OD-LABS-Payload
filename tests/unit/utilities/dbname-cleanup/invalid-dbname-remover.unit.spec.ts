/**
 * Tests for InvalidDbNameRemover implementation
 */

import { describe, expect, it } from 'vitest'
import { createInvalidDbNameRemover } from '../../../../src/utilities/dbname-cleanup/invalid-dbname-remover'
import type { DbNameUsage } from '../../../../src/utilities/dbname-cleanup/types'

describe('InvalidDbNameRemover', () => {
  const remover = createInvalidDbNameRemover()

  describe('analyzeInvalidUsages', () => {
    it('should identify UI field with invalid dbName', () => {
      const usages: DbNameUsage[] = [
        {
          location: 'fields.0.dbName',
          fieldName: 'separator',
          dbNameValue: 'sep_field',
          fieldType: 'ui',
          nestingLevel: 1,
          context: {
            parentFields: [],
            collectionSlug: 'test',
            isNested: false,
            fullPath: '/test/config.ts',
          },
        },
      ]

      const result = remover.analyzeInvalidUsages(usages)

      expect(result.summary.totalInvalidUsages).toBe(1)
      expect(result.summary.uiFieldRemovals).toBe(1)
      expect(result.changes).toHaveLength(1)
      expect(result.changes[0].action).toBe('remove')
      expect(result.logEntries[0].category).toBe('ui_field')
      expect(result.logEntries[0].reason).toContain('UI field type')
    })

    it('should identify unsupported field type with invalid dbName', () => {
      const usages: DbNameUsage[] = [
        {
          location: 'fields.0.dbName',
          fieldName: 'layout',
          dbNameValue: 'layout_field',
          fieldType: 'tabs',
          nestingLevel: 1,
          context: {
            parentFields: [],
            collectionSlug: 'test',
            isNested: false,
            fullPath: '/test/config.ts',
          },
        },
      ]

      const result = remover.analyzeInvalidUsages(usages)

      expect(result.summary.totalInvalidUsages).toBe(1)
      expect(result.summary.uiFieldRemovals).toBe(1) // tabs is a UI field
      expect(result.changes).toHaveLength(1)
      expect(result.logEntries[0].category).toBe('ui_field')
    })

    it('should not flag valid field types', () => {
      const usages: DbNameUsage[] = [
        {
          location: 'fields.0.dbName',
          fieldName: 'title',
          dbNameValue: 'title_field',
          fieldType: 'text',
          nestingLevel: 1,
          context: {
            parentFields: [],
            collectionSlug: 'test',
            isNested: false,
            fullPath: '/test/config.ts',
          },
        },
      ]

      const result = remover.analyzeInvalidUsages(usages)

      expect(result.summary.totalInvalidUsages).toBe(0)
      expect(result.changes).toHaveLength(0)
    })

    it('should handle multiple invalid usages', () => {
      const usages: DbNameUsage[] = [
        {
          location: 'fields.0.dbName',
          fieldName: 'separator',
          dbNameValue: 'sep',
          fieldType: 'ui',
          nestingLevel: 1,
          context: {
            parentFields: [],
            collectionSlug: 'test',
            isNested: false,
            fullPath: '/test/config.ts',
          },
        },
        {
          location: 'fields.1.dbName',
          fieldName: 'layout',
          dbNameValue: 'layout',
          fieldType: 'row',
          nestingLevel: 1,
          context: {
            parentFields: [],
            collectionSlug: 'test',
            isNested: false,
            fullPath: '/test/config.ts',
          },
        },
      ]

      const result = remover.analyzeInvalidUsages(usages)

      expect(result.summary.totalInvalidUsages).toBe(2)
      expect(result.summary.uiFieldRemovals).toBe(2)
      expect(result.changes).toHaveLength(2)
    })
  })

  describe('generateRemovalReport', () => {
    it('should generate a comprehensive removal report', () => {
      const usages: DbNameUsage[] = [
        {
          location: 'fields.0.dbName',
          fieldName: 'separator',
          dbNameValue: 'sep',
          fieldType: 'ui',
          nestingLevel: 1,
          context: {
            parentFields: [],
            collectionSlug: 'test',
            isNested: false,
            fullPath: '/test/config.ts',
          },
        },
      ]

      const result = remover.analyzeInvalidUsages(usages)
      const report = remover.generateRemovalReport(result)

      expect(report).toContain('Invalid DbName Removal Report')
      expect(report).toContain('Total invalid usages: 1')
      expect(report).toContain('UI Fields')
      expect(report).toContain('separator')
      expect(report).toContain('ui')
    })
  })
})
