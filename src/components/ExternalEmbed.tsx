'use client'

import React, { useEffect, useRef } from 'react'

export type CustomScript = {
  src: string
  id?: string | null
  attributes?: Array<{
    name?: string | null
    value?: string | null
  }> | null
}

export type EmbedConfig = {
  preset?: 'cookiebot' | 'usercentrics' | 'custom' | null
  cookiebotDomainGroupID?: string | null
  cookiebotBlockingMode?: 'auto' | 'manual' | null
  usercentricsPrivacyPolicyID?: string | null
  usercentricsLanguage?: string | null
  scripts?: CustomScript[] | null
  containerID?: string | null
  containerClass?: string | null
}

type Props = {
  embed?: EmbedConfig | null
}

export function ExternalEmbed({ embed }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !embed) return

    const scriptsToInject: HTMLScriptElement[] = []
    const preset = embed.preset || 'custom'

    if (preset === 'cookiebot') {
      const cbid = embed.cookiebotDomainGroupID?.trim()
      if (cbid) {
        // Script 1: Cookiebot Banner / Consent
        const s1 = document.createElement('script')
        s1.id = 'Cookiebot'
        s1.src = 'https://consent.cookiebot.com/uc.js'
        s1.setAttribute('data-cbid', cbid)
        s1.setAttribute('data-blockingmode', embed.cookiebotBlockingMode || 'auto')
        s1.type = 'text/javascript'
        scriptsToInject.push(s1)

        // Script 2: Cookiebot Declaration
        const s2 = document.createElement('script')
        s2.id = 'CookieDeclaration'
        s2.src = `https://consent.cookiebot.com/${cbid}/cd.js`
        s2.type = 'text/javascript'
        s2.async = true
        scriptsToInject.push(s2)
      }
    } else if (preset === 'usercentrics') {
      const ppgId = embed.usercentricsPrivacyPolicyID?.trim()
      if (ppgId) {
        const s = document.createElement('script')
        s.id = 'usercentrics-ppg'
        s.setAttribute('privacy-policy-id', ppgId)
        s.setAttribute('data-language', embed.usercentricsLanguage?.trim() || 'en')
        s.src = 'https://policygenerator.usercentrics.eu/api/privacy-policy'
        scriptsToInject.push(s)
      }
    } else {
      // Custom scripts
      const customScripts = Array.isArray(embed.scripts) ? embed.scripts : []
      for (const item of customScripts) {
        if (!item || !item.src) continue
        try {
          const url = new URL(item.src)
          if (url.protocol !== 'https:') continue

          const s = document.createElement('script')
          s.src = url.toString()
          if (item.id) s.id = item.id

          for (const attr of item.attributes ?? []) {
            const name = attr.name?.trim()
            if (!name || /^on[a-z]+/i.test(name)) continue

            if (name.toLowerCase() === 'async') {
              s.async = attr.value !== 'false'
            } else if (name.toLowerCase() === 'defer') {
              s.defer = attr.value !== 'false'
            } else if (attr.value != null && attr.value !== '') {
              s.setAttribute(name, attr.value)
            } else {
              s.setAttribute(name, '')
            }
          }

          scriptsToInject.push(s)
        } catch {
          // Ignore invalid URLs
        }
      }
    }

    // Append all prepared scripts
    for (const script of scriptsToInject) {
      script.dataset.legalEmbed = 'true'
      container.appendChild(script)
    }

    return () => {
      for (const script of scriptsToInject) {
        script.remove()
      }
    }
  }, [embed])

  const preset = embed?.preset || 'custom'
  let containerId = embed?.containerID || undefined
  let containerClassName = embed?.containerClass || undefined

  if (preset === 'usercentrics') {
    containerClassName = containerClassName
      ? `${containerClassName} uc-privacy-policy`
      : 'uc-privacy-policy'
  }

  return <div ref={containerRef} id={containerId} className={containerClassName} />
}
