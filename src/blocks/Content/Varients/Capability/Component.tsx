import React from 'react'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Header, Eyebrow } from '@/blocks/Content/Varients/Header'

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  children?: LexicalNode[]
}

type LexicalState = {
  root?: {
    children?: LexicalNode[]
  }
}

function isHeadingNode(node: LexicalNode): boolean {
  return node.type === 'heading' || /^h[1-6]$/.test(node.type ?? '')
}

function getNodeText(node: LexicalNode): string {
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(getNodeText).join('')
}

function getCapabilityText(data: unknown): {
  title: string
  description: string
} {
  const state = data as LexicalState | null | undefined
  const nodes = state?.root?.children ?? []
  const headingIndex = nodes.findIndex(isHeadingNode)

  if (headingIndex >= 0) {
    return {
      title: getNodeText(nodes[headingIndex]).trim(),
      description: nodes
        .slice(headingIndex + 1)
        .filter((node) => node.type === 'paragraph')
        .map(getNodeText)
        .map((text) => text.trim())
        .filter(Boolean)
        .join(' '),
    }
  }

  const textBlocks = nodes
    .filter((node) => node.type === 'paragraph' || isHeadingNode(node))
    .map(getNodeText)
    .map((text) => text.trim())
    .filter(Boolean)

  return {
    title: textBlocks[0] ?? '',
    description: textBlocks.slice(1).join(' '),
  }
}

type Props = ContentBlockProps & {
  blockIndex?: number
}

export const Capabilities_ContentBlock: React.FC<Props> = (props) => {
  const { eyebrow, richText, linkGroup, columns, blockIndex = 0 } = props
  return (
    <section className="border-b border-zinc-800 px-6 py-10 lg:px-12 lg:py-14">
      <Eyebrow eyebrow={eyebrow} blockIndex={blockIndex} />

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <Header
          richText={richText}
          linkGroup={linkGroup}
          className="lg:col-span-5"
        />

        <div className="divide-y divide-zinc-800 lg:col-span-7">
          {columns?.map((column, index) => {
            const { title, description } = getCapabilityText(column.richText)
            if (!title) return null

            const number = String(index + 1).padStart(2, '0')
            const content = (
              <>
                <span className="text-odl shrink-0 font-mono text-2xl font-bold sm:text-3xl">
                  {number}
                </span>
                <span className="group min-w-0 flex-1 space-y-2.5">
                  <span className="group-hover:text-odl block font-mono text-xl font-semibold tracking-tight text-zinc-200 uppercase transition-colors sm:text-2xl">
                    {title}
                  </span>
                  {description ? (
                    <span className="block font-sans text-base leading-relaxed text-zinc-400 transition-colors group-hover:text-white">
                      {description}
                    </span>
                  ) : null}
                </span>
              </>
            )

            return (
              <div className="divide-y divide-zinc-800 lg:col-span-7">
                <div key={column.id ?? index}>
                  {column.enableLink && column.link ? (
                    <CMSLink
                      {...column.link}
                      label={undefined}
                      appearance="inline"
                      className="group focus-visible:outline-odl flex items-baseline gap-6 py-7 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                      {content}
                    </CMSLink>
                  ) : (
                    <div className="group flex items-baseline gap-6 py-7">
                      {content}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
