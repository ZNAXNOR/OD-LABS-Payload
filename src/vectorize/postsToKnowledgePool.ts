import type { ToKnowledgePoolFn } from 'payloadcms-vectorize'

import { lexicalToText } from './lexicalToText'
import { splitTextIntoChunks } from './splitTextIntoChunks'

export const postsToKnowledgePool: ToKnowledgePoolFn = async (doc) => {
  const title = typeof doc.title === 'string' ? doc.title : ''
  const slug = typeof doc.slug === 'string' ? doc.slug : ''
  const content = lexicalToText(doc.content)

  if (!content) return []

  const parts = splitTextIntoChunks(content)

  return parts.map((part, index) => ({
    chunk: `Post: ${title}\nSection: Article Content${parts.length > 1 ? `\nPart: ${index + 1} of ${parts.length}` : ''}\n\n${part}`,
    pageTitle: title,
    pageSlug: slug ? `posts/${slug}` : '',
    section: 'Article Content',
    blockType: 'post',
  }))
}
