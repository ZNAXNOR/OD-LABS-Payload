import React from 'react'
import RichText from '@/components/RichText'

export type TypographyBlockProps = {
  blockType: 'typography'
  content?: any
}

export const TypographyBlockComponent: React.FC<TypographyBlockProps> = ({ content }) => {
  if (!content) return null

  return (
    <section className="max-w-5xl mx-auto px-8 py-24">
      <div className="border-l-2 border-gray-300 pl-8">
        <RichText data={content} enableGutter={false} />
      </div>
    </section>
  )
}
