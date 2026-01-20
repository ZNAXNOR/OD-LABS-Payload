/**
 * Test utilities and helpers
 */

import type { DefaultTypedEditorState } from '../../src/components/RichText/types'

/**
 * Creates a mock RichText data structure that satisfies TypeScript requirements
 */
export function createMockRichTextData(overrides: any = {}): DefaultTypedEditorState {
  const mockData: DefaultTypedEditorState = {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      textFormat: 0,
      textStyle: '',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: null,
          textFormat: 0,
          textStyle: '',
          children: [
            {
              type: 'text',
              format: 0,
              style: '',
              mode: 'normal',
              detail: 0,
              text: 'Sample text content',
              version: 1,
            },
          ],
        },
      ],
    },
  }

  return {
    ...mockData,
    ...overrides,
  }
}

/**
 * Creates mock block data for testing
 */
export function createMockBlockData(blockType: string, _fields: any = {}) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: null,
    textFormat: 0,
    textStyle: '',
    children: [
      {
        type: 'text',
        format: 0,
        style: '',
        mode: 'normal',
        detail: 0,
        text: `Mock ${blockType} block`,
        version: 1,
      },
    ],
  }
}

/**
 * Creates empty RichText data
 */
export function createEmptyRichTextData(): DefaultTypedEditorState {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      textFormat: 0,
      textStyle: '',
      children: [],
    },
  }
}

/**
 * Mock data for accessibility tests
 */
export const mockRichTextDataWithBlocks: DefaultTypedEditorState = {
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    textFormat: 0,
    textStyle: '',
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
            text: 'Welcome to Our Site - Discover amazing content',
            version: 1,
          },
        ],
      },
    ],
  },
}
