
import { useField } from '@payloadcms/ui'
import React from 'react'

const MediaAltDescription: React.FC = () => {
  const { value } = useField({ path: 'alt' })

  const standardDescription =
    'Essential for accessibility and SEO. Describes the image for screen readers.'

  const warningBoxStyle: React.CSSProperties = {
    backgroundColor: 'var(--theme-error-100)',
    border: '1px solid var(--theme-error-500)',
    color: 'var(--theme-error-700)',
    padding: '12px',
    borderRadius: '4px',
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  }

  const headingStyle: React.CSSProperties = {
    fontWeight: 'bold',
    margin: '0',
  }

  const paragraphStyle: React.CSSProperties = {
    margin: '0',
    fontSize: '14px',
  }

  const isValueEmpty = !value

  return (
    <div>
      <p>{standardDescription}</p>
      {isValueEmpty && (
        <div style={warningBoxStyle}>
          <h3 style={headingStyle}>Heads up! Alt text is empty.</h3>
          <p style={paragraphStyle}>
            For <strong>informative images</strong>, providing descriptive alt text is crucial.
          </p>
          <p style={paragraphStyle}>
            If this image is purely <strong>decorative</strong>, you can leave this field blank.
          </p>
        </div>
      )}
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders, improving admin UI performance.
const MemoizedMediaAltDescription = React.memo(MediaAltDescription)
MemoizedMediaAltDescription.displayName = 'MediaAltDescription'

export default MemoizedMediaAltDescription
