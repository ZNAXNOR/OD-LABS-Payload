
import { useField } from '@payloadcms/ui'
import React from 'react'

const MediaAltDescription: React.FC = () => {
  const { value: altValue } = useField({ path: 'alt' })
  const { value: isDecorative } = useField({ path: 'isDecorative' })

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

  const showWarning = !altValue && !isDecorative

  return (
    <div>
      <p>{standardDescription}</p>
      {showWarning && (
        <div style={warningBoxStyle}>
          <h3 style={headingStyle}>Heads up! Alt text is missing.</h3>
          <p style={paragraphStyle}>
            Alt text is required for informative images. If this image is purely decorative, please
            check the &quot;Is this image decorative?&quot; box below.
          </p>
        </div>
      )}
    </div>
  )
}

export default MediaAltDescription
