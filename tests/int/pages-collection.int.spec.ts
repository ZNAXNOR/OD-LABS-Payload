/**
 * Integration test to verify the consolidated Pages collection works with Payload
 */

import { getPayload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import config from '../../src/payload.config'

describe('Pages Collection Integration', () => {
  let payload: any

  beforeAll(async () => {
    payload = await getPayload({ config })
  })

  afterAll(async () => {
    if (payload) {
      // Clean up any test data if needed
    }
  })

  it('should be able to access the pages collection', async () => {
    expect(payload.config.collections).toBeDefined()

    const pagesCollection = payload.config.collections.find(
      (collection: any) => collection.slug === 'pages',
    )

    expect(pagesCollection).toBeDefined()
    expect(pagesCollection.slug).toBe('pages')
  })

  it('should be able to query the pages collection', async () => {
    const result = await payload.find({
      collection: 'pages',
      limit: 1,
    })

    expect(result).toBeDefined()
    expect(result.docs).toBeDefined()
    expect(Array.isArray(result.docs)).toBe(true)
    expect(typeof result.totalDocs).toBe('number')
    expect(typeof result.limit).toBe('number')
    expect(typeof result.page).toBe('number')
    expect(typeof result.totalPages).toBe('number')
    expect(typeof result.hasNextPage).toBe('boolean')
    expect(typeof result.hasPrevPage).toBe('boolean')
  })

  it('should be able to count pages', async () => {
    const result = await payload.count({
      collection: 'pages',
    })

    expect(result).toBeDefined()
    expect(typeof result.totalDocs).toBe('number')
  })

  it('should support pageType filtering', async () => {
    const result = await payload.find({
      collection: 'pages',
      where: {
        pageType: {
          equals: 'blog',
        },
      },
      limit: 1,
    })

    expect(result).toBeDefined()
    expect(result.docs).toBeDefined()
    expect(Array.isArray(result.docs)).toBe(true)
  })

  it('should support complex queries with pageType and status', async () => {
    const result = await payload.find({
      collection: 'pages',
      where: {
        and: [
          {
            pageType: {
              in: ['blog', 'service'],
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
      limit: 1,
    })

    expect(result).toBeDefined()
    expect(result.docs).toBeDefined()
    expect(Array.isArray(result.docs)).toBe(true)
  })

  it('should support hierarchical queries', async () => {
    const result = await payload.find({
      collection: 'pages',
      where: {
        parent: {
          exists: true,
        },
      },
      limit: 1,
    })

    expect(result).toBeDefined()
    expect(result.docs).toBeDefined()
    expect(Array.isArray(result.docs)).toBe(true)
  })
})
