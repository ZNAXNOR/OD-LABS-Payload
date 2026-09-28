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

  // Hero
  const hero = doc.hero as
    | {
        richText?: unknown
      }
    | undefined

  if (hero?.richText) {
    addChunk('Hero', lexicalToText(hero.richText), 'hero')
  }

  // Layout blocks
  const layout = Array.isArray(doc.layout) ? (doc.layout as PageBlock[]) : []

  layout.forEach((block, index) => {
    const blockType = block.blockType

    // Content
    if (blockType === 'content') {
      const columns = Array.isArray(block.columns) ? block.columns : []

      columns.forEach((column: Record<string, any>, columnIndex: number) => {
        const richText = column?.richText

        if (richText) {
          addChunk(
            `Content ${index + 1}, Column ${columnIndex + 1}`,
            lexicalToText(richText),
            'content',
          )
        }
      })
      return
    }

    // CTA
    if (blockType === 'cta') {
      if (block.richText) {
        addChunk(
          `Call to Action ${index + 1}`,
          lexicalToText(block.richText),
          'cta',
        )
      }
      return
    }

    // Archive
    if (blockType === 'archive') {
      if (block.introContent) {
        addChunk(
          `Archive ${index + 1}`,
          lexicalToText(block.introContent),
          'archive',
        )
      }
      return
    }

    // Form Block
    if (blockType === 'formBlock') {
      if (block.introContent) {
        addChunk(
          `Form ${index + 1}`,
          lexicalToText(block.introContent),
          'formBlock',
        )
      }
      return
    }

    // Banner
    //     if (blockType === 'banner') {
    //       if (block.content) {
    //         addChunk(`Banner ${index + 1}`, lexicalToText(block.content), 'banner')
    //       }
    //       return
    //     }
  })

  return chunks
}
