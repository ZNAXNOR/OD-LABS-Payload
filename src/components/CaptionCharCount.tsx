import { useField } from '@payloadcms/ui'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import React from 'react'

// This component provides a real-time character count for the 'caption' rich text field.
// It enhances the user experience by giving immediate feedback on content length,
// helping editors stay within the recommended 280-character limit.
const CaptionCharCount: React.FC = React.memo(() => {
  const { value } = useField({ path: 'caption' })

  // The richText field value is a JSON object (Lexical editor state).
  // We convert it to plain text for an accurate character count.
  const plainText = value ? convertLexicalToPlaintext(value) : ''
  const charCount = plainText.length
  const charLimit = 280

  const isOverLimit = charCount > charLimit

  // Use existing CSS variables for consistent styling.
  // The color changes to the theme's error color when the limit is exceeded.
  const countStyle: React.CSSProperties = {
    color: isOverLimit ? 'var(--theme-error-500)' : undefined,
    marginTop: '10px',
    fontSize: '14px',
  }

  return (
    <div>
      <p>
        A brief caption for the image. 280 characters max. This will be displayed below the image.
      </p>
      <div style={countStyle}>
        <strong>
          {charCount} / {charLimit}
        </strong>
      </div>
    </div>
  )
})

CaptionCharCount.displayName = 'CaptionCharCount'

export default CaptionCharCount
