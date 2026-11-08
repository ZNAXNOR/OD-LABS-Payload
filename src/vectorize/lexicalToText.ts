import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

export function lexicalToText(data: unknown): string {
  if (!data) return ''

  return convertLexicalToPlaintext({
    data: data as Parameters<typeof convertLexicalToPlaintext>[0]['data'],
  }).trim()
}

