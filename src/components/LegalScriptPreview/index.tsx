'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'

export const LegalScriptPreview: React.FC = () => {
  const [
    contentMode,
    preset,
    cookiebotDomainGroupID,
    cookiebotBlockingMode,
    usercentricsPrivacyPolicyID,
    usercentricsLanguage,
    scripts,
    containerID,
    containerClass,
  ] = useFormFields(([fields]) => [
    fields.contentMode?.value,
    fields['embed.preset']?.value,
    fields['embed.cookiebotDomainGroupID']?.value,
    fields['embed.cookiebotBlockingMode']?.value,
    fields['embed.usercentricsPrivacyPolicyID']?.value,
    fields['embed.usercentricsLanguage']?.value,
    fields['embed.scripts']?.value,
    fields['embed.containerID']?.value,
    fields['embed.containerClass']?.value,
  ])

  if (contentMode !== 'externalEmbed') {
    return (
      <div style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'var(--theme-elevation-500)' }}>
        <strong>Embed Preview</strong>
        <p style={{ marginTop: '0.25rem' }}>Select &quot;External Embed&quot; to preview scripts.</p>
      </div>
    )
  }

  let codeMarkup = ''

  if (preset === 'cookiebot') {
    const cbid = cookiebotDomainGroupID ? String(cookiebotDomainGroupID).trim() : '<DATA-CBID>'
    const blockingMode = cookiebotBlockingMode ? String(cookiebotBlockingMode) : 'auto'

    codeMarkup = `<!-- Cookiebot Banner / Consent -->
<script
  id="Cookiebot"
  src="https://consent.cookiebot.com/uc.js"
  data-cbid="${cbid}"
  data-blockingmode="${blockingMode}"
  type="text/javascript"
></script>

<!-- Cookiebot Declaration -->
<script
  id="CookieDeclaration"
  src="https://consent.cookiebot.com/${cbid}/cd.js"
  type="text/javascript"
  async
></script>`
  } else if (preset === 'usercentrics') {
    const ppgId = usercentricsPrivacyPolicyID
      ? String(usercentricsPrivacyPolicyID).trim()
      : '<PRIVACY-POLICY-ID>'
    const lang = usercentricsLanguage ? String(usercentricsLanguage).trim() : 'en'

    codeMarkup = `<!-- Usercentrics Privacy Policy Script -->
<script
  id="usercentrics-ppg"
  privacy-policy-id="${ppgId}"
  data-language="${lang}"
  src="https://policygenerator.usercentrics.eu/api/privacy-policy"
></script>

<!-- Container element for generated policy -->
<div class="uc-privacy-policy"></div>`
  } else {
    // Custom preset
    const scriptList = Array.isArray(scripts) ? scripts : []
    const renderedScripts = scriptList
      .filter((s) => s && s.src)
      .map((s) => {
        const idAttr = s.id ? `  id="${s.id}"\n` : ''
        const attrs = Array.isArray(s.attributes)
          ? s.attributes
              .filter((a: any) => a && a.name && !/^on[a-z]+/i.test(a.name.trim()))
              .map((a: any) => {
                const name = a.name.trim()
                if (a.value === 'true' || a.value === '' || a.value == null) {
                  return `  ${name}`
                }
                return `  ${name}="${a.value}"`
              })
              .join('\n')
          : ''

        return `<script\n${idAttr}  src="${s.src}"${attrs ? '\n' + attrs : ''}\n></script>`
      })

    const containerAttrs = [
      containerID ? `id="${String(containerID).trim()}"` : '',
      containerClass ? `class="${String(containerClass).trim()}"` : '',
    ]
      .filter(Boolean)
      .join(' ')

    const containerTag =
      containerAttrs || containerID || containerClass
        ? `<div ${containerAttrs}></div>`
        : '<!-- (Optional container) -->'

    codeMarkup = [...renderedScripts, containerTag].join('\n\n')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '0.5rem 0',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Code Output Preview
          </strong>
          <span
            style={{
              fontSize: '0.75rem',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px',
              backgroundColor: 'var(--theme-elevation-150)',
              color: 'var(--theme-elevation-800)',
            }}
          >
            {preset === 'cookiebot'
              ? 'Cookiebot'
              : preset === 'usercentrics'
              ? 'Usercentrics'
              : 'Custom'}
          </span>
        </div>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>
          Generated HTML markup injected into the legal page:
        </p>
      </div>

      <pre
        style={{
          margin: 0,
          padding: '0.75rem',
          backgroundColor: 'var(--theme-elevation-100)',
          border: '1px solid var(--theme-elevation-200)',
          borderRadius: '6px',
          fontSize: '0.75rem',
          lineHeight: '1.4',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          maxHeight: '380px',
          overflowY: 'auto',
          color: 'var(--theme-elevation-900)',
        }}
      >
        <code>{codeMarkup || '<!-- No script configured yet -->'}</code>
      </pre>
    </div>
  )
}

export default LegalScriptPreview
