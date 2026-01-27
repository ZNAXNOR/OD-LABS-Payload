/**
 * Tests for FileModifier implementation
 */

import { createFileModifier } from '@/utilities/dbname-cleanup/file-modifier'
import type { CleanupChange } from '@/utilities/dbname-cleanup/types'
import * as fs from 'fs/promises'
import * as path from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('FileModifier', () => {
  const testDir = path.join(__dirname, 'temp-test-files')
  const fileModifier = createFileModifier()

  beforeEach(async () => {
    // Create test directory
    await fs.mkdir(testDir, { recursive: true })
  })

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  describe('removeDbNameProperty', () => {
    it('should remove top-level dbName property', async () => {
      const testFile = path.join(testDir, 'test-config.ts')
      const content = `export const TestCollection = {
                        slug: 'test',
                        dbName: 'test_collection',
                        fields: [
                          { name: 'title', type: 'text' }
                        ]
                      }`

      await fs.writeFile(testFile, content, 'utf-8')
      await fileModifier.removeDbNameProperty(testFile, 'dbName')

      const modifiedContent = await fs.readFile(testFile, 'utf-8')
      expect(modifiedContent).not.toContain("dbName: 'test_collection'")
      expect(modifiedContent).toContain("slug: 'test'")
      expect(modifiedContent).toContain('fields: [')
    })
  })

  describe('modifyDbNameValue', () => {
    it('should modify top-level dbName value', async () => {
      const testFile = path.join(testDir, 'test-config.ts')
      const content = `export const TestCollection = {
                        slug: 'test',
                        dbName: 'old_name',
                        fields: []
                      }`

      await fs.writeFile(testFile, content, 'utf-8')
      await fileModifier.modifyDbNameValue(testFile, 'dbName', 'new_name')

      const modifiedContent = await fs.readFile(testFile, 'utf-8')
      expect(modifiedContent).toContain("dbName: 'new_name'")
      expect(modifiedContent).not.toContain('old_name')
    })
  })

  describe('applyChanges', () => {
    it('should apply multiple changes to a single file', async () => {
      const testFile = path.join(testDir, 'test-config.ts')
      const content = `export const TestCollection = {
                        slug: 'test',
                        dbName: 'test_collection',
                        fields: [
                          { name: 'title', type: 'text', dbName: 'title_field' },
                          { name: 'content', type: 'richText', dbName: 'content_field' }
                        ]
                      }`

      await fs.writeFile(testFile, content, 'utf-8')

      const changes: CleanupChange[] = [
        {
          filePath: testFile,
          location: 'dbName',
          action: 'remove',
          oldValue: 'test_collection',
          impact: 'low',
        },
        {
          filePath: testFile,
          location: 'fields.0.dbName',
          action: 'modify',
          oldValue: 'title_field',
          newValue: 'title',
          impact: 'low',
        },
      ]

      const result = await fileModifier.applyChanges(changes)

      expect(result.filesModified).toBe(1)
      expect(result.propertiesRemoved).toBe(1)
      expect(result.propertiesModified).toBe(1)
      expect(result.errors).toHaveLength(0)
    })
  })
})
