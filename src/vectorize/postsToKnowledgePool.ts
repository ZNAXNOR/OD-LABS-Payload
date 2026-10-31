import type { ToKnowledgePoolFn } from 'payloadcms-vectorize'

import { lexicalToText } from './lexicalToText'

export const postsToKnowledgePool: ToKnowledgePoolFn = async (doc) => {
  const title = typeof doc.title === 'string' ? doc.title : ''
  const slug = typeof doc.slug === 'string' ? doc.slug : ''
  const content = lexicalToText(doc.content)

  if (!content) return []

  return [
    {
      chunk: `Post: ${title}\nSection: Article Content\n\n${content}`,
      pageTitle: title,
      pageSlug: slug ? `posts/${slug}` : '',
      section: 'Article Content',
      blockType: 'post',
    },
  ]
}
