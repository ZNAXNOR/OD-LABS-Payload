import React from 'react'
import { useField } from '@payloadcms/ui'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

import './styles.scss'

const CharacterCount: React.FC<{ path: string }> = ({ path }) => {
  const { value } = useField({ path })
  const [length, setLength] = React.useState(0)
  const max = 280

  React.useEffect(() => {
    if (value) {
      const plainText = convertLexicalToPlaintext(value)
      setLength(plainText.length)
    } else {
      setLength(0)
    }
  }, [value])

  const color = length > max ? 'var(--theme-error-500)' : 'var(--theme-text)'

  return (
    <div style={{ color, marginTop: '10px' }}>
      {length} / {max} characters
    </div>
  )
}

export default CharacterCount
