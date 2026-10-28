'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'

const LegalScriptPreview: React.FC = () => {
  const [scriptURL, scriptID, scriptAttributes, containerID, containerClass, contentMode] =
    useFormFields(([fields]) => [
      fields['embed.scriptURL']?.value,
      fields['embed.scriptID']?.value,
      fields['embed.scriptAttributes']?.value,
      fields['embed.containerID']?.value,
      fields['embed.containerClass']?.value,
      fields.contentMode?.value,
    ])

  if (contentMode !== 'externalEmbed') {
    return <div><strong>Script preview</strong><p>Select External Embed to preview the configuration.</p></div>
  }

  const validURL = typeof scriptURL === 'string' && (() => {
    try {
      return new URL(scriptURL).protocol === 'https:'
    } catch {
      return false
    }
  })()

  const attributes = Array.isArray(scriptAttributes)
    ? scriptAttributes
        .filter((item) => item && typeof item.name === 'string')
        .map((item) => {
          const name = String(item.name).trim()
          if (!/^(data-[a-z0-9_-]+|async|defer|type|crossorigin)$/i.test(name)) return null
          if (name.toLowerCase() === 'async' || name.toLowerCase() === 'defer') {
            return item.value === 'false' ? null : name
          }
          return item.value ? name + '="' + String(item.value) + '"' : null
        })
        .filter(Boolean)
    : []

  const scriptPreview = validURL
    ? '<script' +
      (scriptID ? '\n  id="' + String(scriptID) + '"' : '') +
      '\n  src="' + String(scriptURL) + '"' +
      attributes.map((attribute) => '\n  ' + attribute).join('') +
      '\n></script>'
    : 'Enter a valid HTTPS script URL to preview the configuration.'

  const containerAttributes = [
    containerID ? 'id="' + String(containerID) + '"' : '',
    containerClass ? 'class="' + String(containerClass) + '"' : '',
  ].filter(Boolean)

  const containerPreview = '<div' +
    (containerAttributes.length ? ' ' + containerAttributes.join(' ') : '') +
    '></div>'

  return (
    <div>
      <strong>Script preview</strong>
      <p>The preview shows the generated markup. It does not execute the script in the admin panel.</p>
      <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}><code>{scriptPreview}</code></pre>
      <strong>Container</strong>
      <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}><code>{containerPreview}</code></pre>
    </div>
  )
}

export default LegalScriptPreview
