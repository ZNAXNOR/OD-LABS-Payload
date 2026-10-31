import type { ToKnowledgePoolFn } from 'payloadcms-vectorize'

import { lexicalToText } from './lexicalToText'

type PageBlock = {
  blockType?: string
  [key: string]: unknown
}

export const pagesToKnowledgePool: ToKnowledgePoolFn = async (doc) => {
  const chunks: Array<{
    chunk: string
    pageTitle: string
    pageSlug: string
    section: string
    blockType: string
  }> = []

  const pageTitle = typeof doc.title === 'string' ? doc.title : ''
  const pageSlug = typeof doc.slug === 'string' ? doc.slug : ''

  const addChunk = (section: string, text: string, blockType?: string) => {
    const cleaned = text.trim()

    if (!cleaned) return

    chunks.push({
      chunk: `Page: ${pageTitle}\nSection: ${section}\n\n${cleaned}`,
      pageTitle,
      pageSlug,
      section,
      blockType: blockType ?? '',
    })
  }

  // Hero content
  const hero = doc.hero as { richText?: unknown } | undefined

  if (hero?.richText) {
    addChunk('Hero', lexicalToText(hero.richText), 'hero')
  }

  // Payload ContentBlock stores rich text directly. Retain a fallback for
  // legacy blocks that used a columns array.
  const layout = Array.isArray(doc.layout) ? (doc.layout as PageBlock[]) : []

  layout.forEach((block, index) => {
    const blockType = block.blockType
    const sectionNumber = index + 1

    if (blockType === 'content') {
      if (block.richText) {
        addChunk(
          `Content ${sectionNumber}`,
          lexicalToText(block.richText),
          'content',
        )
      }

      const columns = Array.isArray(block.columns) ? block.columns : []

      columns.forEach((column: Record<string, unknown>, columnIndex) => {
        if (column.richText) {
          addChunk(
            `Content ${sectionNumber}, Column ${columnIndex + 1}`,
            lexicalToText(column.richText),
            'content',
          )
        }
      })
      return
    }

    if (blockType === 'cta' && block.richText) {
      addChunk(
        `Call to Action ${sectionNumber}`,
        lexicalToText(block.richText),
        'cta',
      )
      return
    }

    if (blockType === 'archive' && block.introContent) {
      addChunk(
        `Archive ${sectionNumber}`,
        lexicalToText(block.introContent),
        'archive',
      )
      return
    }

    if (
      blockType === 'formBlock' &&
      block.enableIntro !== false &&
      block.introContent
    ) {
      addChunk(
        `Form Introduction ${sectionNumber}`,
        lexicalToText(block.introContent),
        'formBlock',
      )
      return
    }

    if (blockType === 'banner' && block.content) {
      addChunk(
        `Banner ${sectionNumber}`,
        lexicalToText(block.content),
        'banner',
      )
      return
    }

    if (blockType === 'code' && typeof block.code === 'string') {
      addChunk(`Code Example ${sectionNumber}`, block.code, 'code')
    }
  })

  return chunks
}
