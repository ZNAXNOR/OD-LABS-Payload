
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

// By wrapping the component in React.memo, we prevent it from re-rendering
// if its props have not changed. This is a performance optimization for the admin UI,
// particularly useful in forms where typing into one field doesn't cause unrelated
// description components to re-render.
const MemoizedMediaAltDescription = React.memo(MediaAltDescription)
MemoizedMediaAltDescription.displayName = 'MediaAltDescription' // Added for better debugging and to satisfy lint rules.

export default MemoizedMediaAltDescription
