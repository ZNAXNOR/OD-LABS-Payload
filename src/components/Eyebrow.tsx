import React from 'react'
import { cn } from '@/utilities/ui'

export type EyebrowProps = {
  eyebrow?: string[] | string | null
  blockIndex?: number
  className?: string
}

export const Eyebrow: React.FC<EyebrowProps> = ({
  eyebrow,
  blockIndex = 0,
  className,
}) => {
  const eyebrowPhrases = (
    Array.isArray(eyebrow)
      ? eyebrow
      : typeof eyebrow === 'string'
        ? [eyebrow]
        : []
  ).filter((phrase): phrase is string => Boolean(phrase && phrase.trim()))

  if (eyebrowPhrases.length === 0) {
    return null
  }

  const blockNumber = String(blockIndex + 2).padStart(2, '0')

  return (
    <div className={cn('mb-8', className)}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs font-medium tracking-[0.18em] text-white/45 uppercase">
        <span className="bg-odl size-2 shrink-0" aria-hidden="true" />

        {eyebrowPhrases.map((phrase, index) => {
          const displayPhrase =
            index === 0
              ? /^\d{2}\s*—\s*/.test(phrase)
                ? phrase
                : `${blockNumber} — ${phrase}`
              : phrase

          return (
            <React.Fragment key={`${phrase}-${index}`}>
              {index > 1 && (
                <span className="text-odl" aria-hidden="true">
                  •
                </span>
              )}

              <span className={index === 0 ? 'text-odl' : 'text-white/60'}>
                {index === 0
                  ? eyebrowPhrases.length > 1
                    ? `${displayPhrase} //`
                    : displayPhrase
                  : displayPhrase}
              </span>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default Eyebrow
