import RichText from '@/components/RichText'
import React from 'react'

import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export const Message: React.FC<{ message: DefaultTypedEditorState }> = ({ message }) => {
  return <div className="my-12 col-span-12">{message && <RichText data={message} />}</div>
}
