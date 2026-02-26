import React from 'react'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical'
import { JSXConvertersFunction, LinkJSXConverter } from '@payloadcms/richtext-lexical/react'
import { createDynamicValueJSXConverters } from '@od-labs/payloadcms-dynamic-value-richtext/jsx'

import { BannerBlock } from '@/blocks/Standard/Banner/Component'
import { CallToActionBlock } from '@/blocks/Standard/CallToAction/Component'
import { CodeBlock } from '@/blocks/Standard/Code/Component'
import { MediaBlock } from '@/blocks/Standard/MediaBlock/Component'
import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
  CodeBlock as CodeBlockProps,
} from '@/payload-types'

export type NodeTypes =
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

export const getJsxConverters: (payloadData?: any) => JSXConvertersFunction<NodeTypes> =
  (payloadData) =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    ...createDynamicValueJSXConverters({ data: payloadData }),
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
