
import { useField } from '@payloadcms/ui'
import React from 'react'

// Using React.memo to prevent unnecessary re-renders.
// This component was re-rendering whenever any field in the parent form changed.
// Now it only re-renders when its specific field ('alt') changes.
const MediaAltDescription: React.FC = React.memo(() => {
  const { value } = useField({ path: 'alt' })

  const standardDescription =
    'Essential for accessibility and SEO. Describes the image for screen readers.'

  const warningBoxStyle: React.CSSProperties = {
    backgroundColor: 'var(--theme-warning-100)',
    border: '1px solid var(--theme-warning-500)',
    color: 'var(--theme-warning-700)',
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
          <h3 style={headingStyle}>Is this image decorative?</h3>
          <p style={paragraphStyle}>
            If so, check the "Is this image decorative?" box above.
          </p>
          <p style={paragraphStyle}>
            Otherwise, please provide descriptive alt text for accessibility.
          </p>
        </div>
      )}
    </div>
  )
})

// Adding displayName for better debugging and to satisfy linting rules.
MediaAltDescription.displayName = 'MediaAltDescription'

export default MediaAltDescription
