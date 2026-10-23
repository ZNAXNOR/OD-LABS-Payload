import React from 'react'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

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

function getCapabilityText(data: unknown): { title: string; description: string } {
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

export const Capabilities_ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { richText, linkGroup, columns } = props

  return (
    <section className="border-r border-[#262D3D] px-6 py-20 lg:px-12 lg:py-28">
      <div className="mb-14 flex items-center justify-between border-b border-[#232a3b] pb-4">
        <span className="font-mono text-xs uppercase tracking-wider text-[#687182]">
          03 — Capabilities
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-6 lg:col-span-5">
          {richText && (
            <RichText
              data={richText}
              enableGutter={false}
              className="[&_h2]:text-3xl [&_h2]:font-normal [&_h2]:leading-[1.15] [&_h2]:tracking-tight [&_h2]:text-[#F4F4F0] sm:[&_h2]:text-4xl lg:[&_h2]:text-5xl [&_h3]:text-3xl [&_h3]:font-normal [&_h3]:leading-[1.15] [&_h3]:tracking-tight [&_h3]:text-[#F4F4F0] sm:[&_h3]:text-4xl lg:[&_h3]:text-5xl [&_h4]:text-3xl [&_h4]:font-normal [&_h4]:leading-[1.15] [&_h4]:tracking-tight [&_h4]:text-[#F4F4F0] [&_p]:font-sans [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-[#A6ABB8]"
            />
          )}

          {linkGroup?.length ? (
            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
              {linkGroup.map((entry, index) => (
                <CMSLink
                  key={entry.id ?? index}
                  {...entry.link}
                  label={entry.label}
                  appearance="inline"
                  className="group inline-flex items-center gap-2 font-mono text-xs text-[#F4F4F0] transition-colors hover:text-[#FF3B30]"
                >
                  <span
                    aria-hidden="true"
                    className="text-[#FF3B30] transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </CMSLink>
              ))}
            </div>
          ) : null}
        </div>

        <div className="divide-y divide-[#232a3b] lg:col-span-7">
          {columns?.map((column, index) => {
            const { title, description } = getCapabilityText(column.richText)
            if (!title) return null

            const number = String(index + 1).padStart(2, '0')
            const content = (
              <>
                <span className="shrink-0 font-mono text-2xl font-bold text-[#FF3B30] sm:text-3xl">
                  {number}
                </span>
                <span className="min-w-0 flex-1 space-y-2.5">
                  <span className="block font-mono text-xl font-semibold uppercase tracking-tight text-[#F4F4F0] transition-colors sm:text-2xl">
                    {title}
                  </span>
                  {description ? (
                    <span className="block font-sans text-base leading-relaxed text-[#A6ABB8]">
                      {description}
                    </span>
                  ) : null}
                </span>
              </>
            )

            return (
              <div key={column.id ?? index} className="py-7 first:pt-0 last:pb-0">
                {column.enableLink && column.link ? (
                  <CMSLink
                    {...column.link}
                    label={undefined}
                    appearance="inline"
                    className="group flex items-baseline gap-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF3B30] [&:hover_span:nth-child(2)>span:first-child]:text-[#FF3B30]"
                  >
                    {content}
                  </CMSLink>
                ) : (
                  <div className="flex items-baseline gap-6">{content}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
