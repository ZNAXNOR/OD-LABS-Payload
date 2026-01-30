import { describe, expect, it } from 'vitest'
import type { PageData } from '../../../src/utilities/pageHierarchy'
import { generatePageUrl, getPageTypePrefix } from '../../../src/utilities/pageHierarchy'

describe('pageHierarchy utilities', () => {
  describe('generatePageUrl', () => {
    it('should generate correct URL for home page', () => {
      const page: PageData = {
        id: '1',
        slug: 'home',
        pageType: 'page',
        title: 'Home',
      }

      const url = generatePageUrl(page)
      expect(url).toBe('/')
    })

    it('should generate correct URL for regular page', () => {
      const page: PageData = {
        id: '1',
        slug: 'about',
        pageType: 'page',
        title: 'About',
      }

      const url = generatePageUrl(page)
      expect(url).toBe('/about')
    })

    it('should generate correct URL for blog page', () => {
      const page: PageData = {
        id: '1',
        slug: 'my-post',
        pageType: 'blog',
        title: 'My Post',
      }

      const url = generatePageUrl(page)
      expect(url).toBe('/blog/my-post')
    })

    it('should generate correct URL for service page', () => {
      const page: PageData = {
        id: '1',
        slug: 'web-development',
        pageType: 'service',
        title: 'Web Development',
      }

      const url = generatePageUrl(page)
      expect(url).toBe('/services/web-development')
    })

    it('should generate correct URL for legal page', () => {
      const page: PageData = {
        id: '1',
        slug: 'privacy-policy',
        pageType: 'legal',
        title: 'Privacy Policy',
      }

      const url = generatePageUrl(page)
      expect(url).toBe('/legal/privacy-policy')
    })

    it('should generate correct URL for contact page', () => {
      const page: PageData = {
        id: '1',
        slug: 'support',
        pageType: 'contact',
        title: 'Support',
      }

      const url = generatePageUrl(page)
      expect(url).toBe('/contact/support')
    })

    it('should generate correct hierarchical URL with parent path', () => {
      const page: PageData = {
        id: '2',
        slug: 'child-page',
        pageType: 'page',
        title: 'Child Page',
      }

      const url = generatePageUrl(page, 'parent-page')
      expect(url).toBe('/parent-page/child-page')
    })

    it('should generate correct hierarchical URL for blog with parent path', () => {
      const page: PageData = {
        id: '2',
        slug: 'child-post',
        pageType: 'blog',
        title: 'Child Post',
      }

      const url = generatePageUrl(page, 'category')
      expect(url).toBe('/blog/category/child-post')
    })

    it('should handle empty parent path', () => {
      const page: PageData = {
        id: '1',
        slug: 'test',
        pageType: 'page',
        title: 'Test',
      }

      const url = generatePageUrl(page, '')
      expect(url).toBe('/test')
    })

    it('should clean up double slashes', () => {
      const page: PageData = {
        id: '1',
        slug: 'test',
        pageType: 'page',
        title: 'Test',
      }

      const url = generatePageUrl(page, '/parent/')
      expect(url).toBe('/parent/test')
    })
  })

  describe('getPageTypePrefix', () => {
    it('should return correct prefix for blog', () => {
      expect(getPageTypePrefix('blog')).toBe('/blog')
    })

    it('should return correct prefix for service', () => {
      expect(getPageTypePrefix('service')).toBe('/services')
    })

    it('should return correct prefix for legal', () => {
      expect(getPageTypePrefix('legal')).toBe('/legal')
    })

    it('should return correct prefix for contact', () => {
      expect(getPageTypePrefix('contact')).toBe('/contact')
    })

    it('should return empty prefix for page', () => {
      expect(getPageTypePrefix('page')).toBe('')
    })

    it('should return empty prefix for unknown type', () => {
      expect(getPageTypePrefix('unknown')).toBe('')
    })
  })
})
