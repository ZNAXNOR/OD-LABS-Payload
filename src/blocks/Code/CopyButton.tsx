'use client'
import { Button } from '@/components/ui/button'
import { CopyIcon } from '@payloadcms/ui/icons/Copy'
import { CheckIcon } from '@/icons/CheckIcon'
import { useState } from 'react'

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="absolute top-2 right-2 z-10">
      <Button
        size="sm"
        variant="secondary"
        className="h-8 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700"
        onClick={handleCopy}
      >
        {copied ? (
          <>
            <CheckIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">Copied!</span>
          </>
        ) : (
          <>
            <CopyIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">Copy</span>
          </>
        )}
      </Button>
    </div>
  )
}
