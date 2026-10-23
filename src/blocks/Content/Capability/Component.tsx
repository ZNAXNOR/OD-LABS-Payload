import React from 'react'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { ArrowRight } from 'lucide-react'

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
  const blockNumber = String(blockIndex + 2).padStart(2, '0')

  const eyebrowPhrases = (
    Array.isArray(eyebrow)
      ? eyebrow
      : typeof eyebrow === 'string'
        ? [eyebrow]
        : []
  ).filter((phrase): phrase is string => Boolean(phrase && phrase.trim()))

  return (
    <section className="border-b border-zinc-800 px-6 py-10 lg:px-12 lg:py-14">
      {eyebrowPhrases.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs font-medium tracking-[0.18em] text-white/45 uppercase">
            <span className="bg-odl size-2 shrink-0" aria-hidden="true" />

            {eyebrowPhrases.map((phrase, index) => {
              const displayPhrase =
                index === 0
                  ? /^\d{2}\s*—\s*/.test(phrase)
                    ? phrase
                    : `${blockNumber} — ${phrase}`
                  : phrase

              return (
                <React.Fragment key={`${phrase}-${index}`}>
                  {index > 1 && (
                    <span className="text-odl" aria-hidden="true">
                      •
                    </span>
                  )}

                  <span className={index === 0 ? 'text-odl' : 'text-white/60'}>
                    {index === 0
                      ? eyebrowPhrases.length > 1
                        ? `${displayPhrase} //`
                        : displayPhrase
                      : displayPhrase}
                  </span>
                </React.Fragment>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-6 lg:col-span-5">
          {richText && (
            <RichText
              data={richText}
              enableGutter={false}
              className={[
                '[&_h2]:mb-3 [&_h2]:text-3xl [&_h2]:leading-[1.15] [&_h2]:font-normal [&_h2]:tracking-tight [&_h2]:text-zinc-200 sm:[&_h2]:text-4xl lg:[&_h2]:text-5xl',
                '_h3]:text-2xl [&_h3]:mb-3 [&_h3]:leading-snug [&_h3]:font-normal [&_h3]:tracking-tight [&_h3]:text-zinc-200 sm:[&_h3]:text-3xl',
                '[&_h4]:mb-3 [&_h4]:text-xl [&_h4]:leading-snug [&_h4]:font-normal [&_h4]:tracking-tight [&_h4]:text-zinc-200',
                '[&_p]:font-sans [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-zinc-400',
                '[&_a]:text-odl [&_a:hover]:text-odl/60',
              ].join(' ')}
            />
          )}

          {linkGroup?.length ? (
            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
              {linkGroup.map((entry, index) => (
                <CMSLink
                  key={entry.id ?? index}
                  {...entry.link}
                  label={entry.link.label}
                />
              ))}
            </div>
          ) : null}
        </div>

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
