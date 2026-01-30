/**
 * Basic test to verify the consolidated Pages collection structure
 */

import { describe, expect, it } from 'vitest'
import { Pages } from '../../../src/collections/Pages/index'

describe('Pages Collection', () => {
  it('should have the correct slug', () => {
    expect(Pages.slug).toBe('pages')
  })

  it('should have the correct TypeScript interface', () => {
    expect(Pages.typescript?.interface).toBe('Page')
  })

  it('should have pageType field as discriminator', () => {
    const pageTypeField = Pages.fields?.find(
      (field) => 'name' in field && field.name === 'pageType',
    )

    expect(pageTypeField).toBeDefined()
    expect(pageTypeField?.type).toBe('select')

    if (pageTypeField?.type === 'select') {
      const options = pageTypeField.options
      expect(options).toEqual([
        { label: 'Page', value: 'page' },
        { label: 'Blog Post', value: 'blog' },
        { label: 'Service', value: 'service' },
        { label: 'Legal Document', value: 'legal' },
        { label: 'Contact Page', value: 'contact' },
      ])
    }
  })

  it('should have title field', () => {
    const titleField = Pages.fields?.find((field) => 'name' in field && field.name === 'title')

    expect(titleField).toBeDefined()
    expect(titleField?.type).toBe('text')
    if (titleField && 'required' in titleField) {
      expect(titleField.required).toBe(true)
    }
  })

  it('should have layout blocks field', () => {
    // Find the tabs field
    const tabsField = Pages.fields?.find((field) => field.type === 'tabs')
    expect(tabsField).toBeDefined()

    if (tabsField?.type === 'tabs') {
      // Find the Content tab
      const contentTab = tabsField.tabs?.find((tab) => tab.label === 'Content')
      expect(contentTab).toBeDefined()

      // Find the layout field within the Content tab
      const layoutField = contentTab?.fields?.find(
        (field) => 'name' in field && field.name === 'layout',
      )

      expect(layoutField).toBeDefined()
      expect(layoutField?.type).toBe('blocks')
    }
  })

  it('should have conditional field groups for each page type', () => {
    // Find the tabs field
    const tabsField = Pages.fields?.find((field) => field.type === 'tabs')
    expect(tabsField).toBeDefined()

    if (tabsField?.type === 'tabs') {
      // Find the Configuration tab
      const configTab = tabsField.tabs?.find((tab) => tab.label === 'Configuration')
      expect(configTab).toBeDefined()

      if (configTab) {
        // Check for blog config group
        const blogConfigField = configTab.fields?.find(
          (field) => 'name' in field && field.name === 'blogConfig',
        )
        expect(blogConfigField).toBeDefined()
        expect(blogConfigField?.type).toBe('group')

        // Check for service config group
        const serviceConfigField = configTab.fields?.find(
          (field) => 'name' in field && field.name === 'serviceConfig',
        )
        expect(serviceConfigField).toBeDefined()
        expect(serviceConfigField?.type).toBe('group')

        // Check for legal config group
        const legalConfigField = configTab.fields?.find(
          (field) => 'name' in field && field.name === 'legalConfig',
        )
        expect(legalConfigField).toBeDefined()
        expect(legalConfigField?.type).toBe('group')

        // Check for contact config group
        const contactConfigField = configTab.fields?.find(
          (field) => 'name' in field && field.name === 'contactConfig',
        )
        expect(contactConfigField).toBeDefined()
        expect(contactConfigField?.type).toBe('group')
      }
    }
  })

  it('should have hierarchical fields', () => {
    const parentField = Pages.fields?.find((field) => 'name' in field && field.name === 'parent')

    expect(parentField).toBeDefined()
    expect(parentField?.type).toBe('relationship')

    if (parentField?.type === 'relationship') {
      expect(parentField.relationTo).toBe('pages')
    }

    const breadcrumbsField = Pages.fields?.find(
      (field) => 'name' in field && field.name === 'breadcrumbs',
    )

    expect(breadcrumbsField).toBeDefined()
    expect(breadcrumbsField?.type).toBe('array')
  })

  it('should have audit fields', () => {
    const createdByField = Pages.fields?.find(
      (field) => 'name' in field && field.name === 'createdBy',
    )

    expect(createdByField).toBeDefined()
    expect(createdByField?.type).toBe('relationship')

    if (createdByField?.type === 'relationship') {
      expect(createdByField.relationTo).toBe('users')
    }

    const updatedByField = Pages.fields?.find(
      (field) => 'name' in field && field.name === 'updatedBy',
    )

    expect(updatedByField).toBeDefined()
    expect(updatedByField?.type).toBe('relationship')

    if (updatedByField?.type === 'relationship') {
      expect(updatedByField.relationTo).toBe('users')
    }
  })

  it('should have proper access control', () => {
    expect(Pages.access).toBeDefined()
    expect(typeof Pages.access?.create).toBe('function')
    expect(typeof Pages.access?.read).toBe('function')
    expect(typeof Pages.access?.update).toBe('function')
    expect(typeof Pages.access?.delete).toBe('function')
  })

  it('should have hooks configured', () => {
    expect(Pages.hooks).toBeDefined()
    expect(Array.isArray(Pages.hooks?.beforeValidate)).toBe(true)
    expect(Array.isArray(Pages.hooks?.beforeChange)).toBe(true)
    expect(Array.isArray(Pages.hooks?.afterChange)).toBe(true)
  })

  it('should have versions and drafts enabled', () => {
    expect(Pages.versions).toBeDefined()
    if (Pages.versions && typeof Pages.versions === 'object' && 'drafts' in Pages.versions) {
      expect(Pages.versions.drafts).toBeDefined()
    }
    expect(Pages.timestamps).toBe(true)
  })
})
