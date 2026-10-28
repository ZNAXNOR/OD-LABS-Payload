'use client'

import React, { useEffect, useRef } from 'react'

type ScriptAttribute = {
  name?: string | null
  value?: string | null
}

type Props = {
  scriptURL: string
  scriptID?: string | null
  scriptAttributes?: ScriptAttribute[] | null
  containerID?: string | null
  containerClass?: string | null
}

const isAllowedAttribute = (name: string) =>
  /^(data-[a-z0-9_-]+|async|defer|type|crossorigin)$/i.test(name)

export function ExternalEmbed({
  scriptURL,
  scriptID,
  scriptAttributes,
  containerID,
  containerClass,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let url: URL
    try {
      url = new URL(scriptURL)
    } catch {
      return
    }

    if (url.protocol !== 'https:') return

    const script = document.createElement('script')
    script.src = url.toString()
    script.async = true
    script.dataset.legalEmbed = 'true'

    if (scriptID) script.id = scriptID

    for (const attribute of scriptAttributes ?? []) {
      const name = attribute.name?.trim()
      if (!name || !isAllowedAttribute(name)) continue

      if (name.toLowerCase() === 'async') {
        script.async = attribute.value !== 'false'
      } else if (name.toLowerCase() === 'defer') {
        script.defer = attribute.value !== 'false'
      } else if (attribute.value != null) {
        script.setAttribute(name, attribute.value)
      }
    }

    container.appendChild(script)

    return () => {
      script.remove()
    }
  }, [scriptURL, scriptID, scriptAttributes])

  return <div ref={containerRef} id={containerID || undefined} className={containerClass || undefined} />
}
