import { MediaBlock } from '@/blocks/Standard/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import { createDynamicValueJSXConverters } from '@od-labs/payloadcms-dynamic-value-richtext/jsx'

import { CodeBlock, CodeBlockProps } from '@/blocks/Standard/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Standard/Banner/Component'
import { CallToActionBlock } from '@/blocks/Standard/CallToAction/Component'
import { cn } from '@/utilities/ui'
import React from 'react'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const fields = linkNode.fields as any // Payload link fields are tricky
  const { value, relationTo } = fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = (value as any).slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const getJsxConverters: (payloadData?: any) => JSXConvertersFunction<NodeTypes> =
  (payloadData) =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    ...createDynamicValueJSXConverters({
      data: payloadData,
      fallback: (node) => {
        const value = node.field.split('.').reduce((current, key) => {
          if (current && typeof current === 'object' && key in current) {
            return (current as any)[key]
          }
          return undefined
        }, payloadData)

        if (value) {
          // If the value is a structured link object (from our link field)
          if (typeof value === 'object' && 'type' in value) {
            const linkData = value as any
            let href = ''

            if (linkData.type === 'custom') {
              href = linkData.url || ''
            } else if (linkData.type === 'reference' && linkData.reference) {
              const { relationTo, value: doc } = linkData.reference
              if (doc && typeof doc === 'object' && 'slug' in doc) {
                href = relationTo === 'posts' ? `/posts/${doc.slug}` : `/${doc.slug}`
              }
            }
          }
          return <span>{String(value)}</span>
        }

        return <span>{node.label}</span>
      },
    }),
    blocks: {
      banner: ({ node }) => (
        <BannerBlock
          className="col-start-2 mb-4"
          {...(node.fields as unknown as BannerBlockProps)}
        />
      ),
      mediaBlock: ({ node }) => (
        <MediaBlock
          className="col-start-1 col-span-3"
          imgClassName="m-0"
          {...(node.fields as unknown as MediaBlockProps)}
          captionClassName="mx-auto max-w-[48rem]"
          enableGutter={false}
          disableInnerContainer={true}
        />
      ),
      code: ({ node }) => (
        <CodeBlock className="col-start-2" {...(node.fields as unknown as CodeBlockProps)} />
      ),
      cta: ({ node }) => <CallToActionBlock {...(node.fields as unknown as CTABlockProps)} />,
    },
  })

type Props = {
  data: DefaultTypedEditorState
  payloadData?: any
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, payloadData, ...rest } = props
  return (
    <ConvertRichText
      converters={getJsxConverters(payloadData)}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
