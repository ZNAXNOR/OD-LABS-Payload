import { describe, it, expect, vi } from 'vitest'

// Mock the complex dependencies before importing
vi.mock('@/blocks/MediaBlock/Component', () => ({
  MediaBlock: vi.fn(() => ({ type: 'div', props: { 'data-testid': 'media-block' } })),
}))

vi.mock('@/components/Media', () => ({
  Media: vi.fn(() => ({ type: 'img', props: { 'data-testid': 'media' } })),
}))

vi.mock('@/utilities/ui', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' ')),
}))

describe('RichText Media Converters', () => {
  describe('Media Converter Functions', () => {
    it('should import media converter functions without errors', async () => {
      // Use dynamic import to avoid issues with complex dependencies
      const mediaConverters =
        await import('../../src/components/RichText/converters/mediaConverters')

      expect(mediaConverters.defaultMediaConverter).toBeDefined()
      expect(typeof mediaConverters.defaultMediaConverter).toBe('function')

      expect(mediaConverters.createEnhancedMediaConverter).toBeDefined()
      expect(typeof mediaConverters.createEnhancedMediaConverter).toBe('function')

      expect(mediaConverters.createImageWithCaptionConverter).toBeDefined()
      expect(typeof mediaConverters.createImageWithCaptionConverter).toBe('function')

      expect(mediaConverters.createVideoEmbedConverter).toBeDefined()
      expect(typeof mediaConverters.createVideoEmbedConverter).toBe('function')

      expect(mediaConverters.createFileAttachmentConverter).toBeDefined()
      expect(typeof mediaConverters.createFileAttachmentConverter).toBe('function')

      expect(mediaConverters.mediaConverters).toBeDefined()
      expect(typeof mediaConverters.mediaConverters).toBe('object')
    })

    it('should create converter functions with factory methods', async () => {
      const mediaConverters =
        await import('../../src/components/RichText/converters/mediaConverters')

      const enhancedConverter = mediaConverters.createEnhancedMediaConverter()
      expect(typeof enhancedConverter).toBe('function')

      const imageConverter = mediaConverters.createImageWithCaptionConverter()
      expect(typeof imageConverter).toBe('function')

      const videoConverter = mediaConverters.createVideoEmbedConverter()
      expect(typeof videoConverter).toBe('function')

      const fileConverter = mediaConverters.createFileAttachmentConverter()
      expect(typeof fileConverter).toBe('function')
    })

    it('should have all expected converters in registry', async () => {
      const { mediaConverters } =
        await import('../../src/components/RichText/converters/mediaConverters')

      expect(mediaConverters.upload).toBeDefined()
      expect(mediaConverters.media).toBeDefined()
      expect(mediaConverters.image).toBeDefined()
      expect(mediaConverters.video).toBeDefined()
      expect(mediaConverters.file).toBeDefined()
      expect(mediaConverters.gallery).toBeDefined()

      // All should be functions
      Object.values(mediaConverters).forEach((converter) => {
        expect(typeof converter).toBe('function')
      })
    })

    it('should handle converter configuration options', async () => {
      const mediaConverters =
        await import('../../src/components/RichText/converters/mediaConverters')

      // Test enhanced converter with config
      const enhancedConverter = mediaConverters.createEnhancedMediaConverter({
        enableCaption: true,
        enableZoom: true,
        className: 'custom-class',
      })
      expect(typeof enhancedConverter).toBe('function')

      // Test image converter with config
      const imageConverter = mediaConverters.createImageWithCaptionConverter({
        captionPosition: 'bottom',
        captionStyle: 'default',
        enableAltText: true,
      })
      expect(typeof imageConverter).toBe('function')

      // Test video converter with config
      const videoConverter = mediaConverters.createVideoEmbedConverter({
        autoplay: false,
        controls: true,
        muted: false,
      })
      expect(typeof videoConverter).toBe('function')

      // Test file converter with config
      const fileConverter = mediaConverters.createFileAttachmentConverter({
        showIcon: true,
        showSize: true,
        downloadText: 'Download File',
      })
      expect(typeof fileConverter).toBe('function')
    })

    it('should handle missing or invalid media data gracefully', async () => {
      const mediaConverters =
        await import('../../src/components/RichText/converters/mediaConverters')

      const mockNodeWithoutMedia = { fields: {} }
      const mockNodeWithInvalidMedia = { fields: { media: null } }

      // These should not throw errors
      expect(() => {
        const converter = mediaConverters.createImageWithCaptionConverter()
        converter({ node: mockNodeWithoutMedia })
      }).not.toThrow()

      expect(() => {
        const converter = mediaConverters.createVideoEmbedConverter()
        converter({ node: mockNodeWithInvalidMedia })
      }).not.toThrow()

      expect(() => {
        const converter = mediaConverters.createFileAttachmentConverter()
        converter({ node: mockNodeWithoutMedia })
      }).not.toThrow()
    })
  })

  describe('Media Converter Types and Interfaces', () => {
    it('should export type definitions', async () => {
      // This test ensures the module exports without TypeScript errors
      const mediaConverters =
        await import('../../src/components/RichText/converters/mediaConverters')

      // Check that the module exports the expected functions
      const expectedExports = [
        'defaultMediaConverter',
        'createEnhancedMediaConverter',
        'createImageWithCaptionConverter',
        'createVideoEmbedConverter',
        'createFileAttachmentConverter',
        'createResponsiveMediaConverter',
        'createMediaGalleryConverter',
        'createDragDropMediaConverter',
        'mediaConverters',
      ]

      expectedExports.forEach((exportName) => {
        expect((mediaConverters as any)[exportName]).toBeDefined()
      })
    })
  })
})
