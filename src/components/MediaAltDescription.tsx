
import React from 'react'
import { useField } from '@payloadcms/ui'

const MediaAltDescription: React.FC = () => {
  const { value } = useField({ path: 'alt' })

  const standardDescription =
    'Describes the appearance and function of the image for screen readers and search engines.'

  const warningStyle = {
    color: 'var(--theme-error-500)', // Use Payload's design system variable for the error color
    fontWeight: 'bold',
    display: 'block',
    marginTop: '8px',
  }

  const isValueEmpty = !value

  return (
    <div>
      <p>{standardDescription}</p>
      {isValueEmpty && (
        <strong style={warningStyle}>
          Warning: Providing alt text for informative images is crucial for accessibility and SEO.
          For decorative images, leave this field blank.
        </strong>
      )}
    </div>
  )
}

export default MediaAltDescription
