import React from 'react'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import { cn } from '@/utilities/ui'
import { getJsxConverters } from './converters'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
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
