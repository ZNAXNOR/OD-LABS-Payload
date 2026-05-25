import React from 'react'

import { ArrowRight, GitCommitHorizontal, FlaskConical, Rocket } from 'lucide-react'

const iconMap = {
  GitCommitHorizontal,
  FlaskConical,
  Rocket,
}

import type { ArtifactPresentation, ProcessFlowArtifactData } from '../../types'

type Props = {
  data: ProcessFlowArtifactData

  presentation?: ArtifactPresentation
}

export const ProcessFlowArtifact: React.FC<Props> = ({ data, presentation }) => {
  const { showContainer = true, theme = 'dark' } = presentation || {}

  const content = (
    <div className="flex items-center justify-center gap-4 flex-wrap font-mono text-sm">
      {data?.steps?.map((step, index) => {
        const StepIcon =
          step.icon && step.icon !== 'none' ? iconMap[step.icon as keyof typeof iconMap] : null

        return (
          <React.Fragment key={step.id || index}>
            <div
              className={[
                'text-center p-4 border rounded flex items-center justify-center gap-2',
                step.highlight
                  ? theme === 'dark'
                    ? 'border-primary-fixed bg-primary-fixed/10 text-primary-fixed font-bold'
                    : 'border-primary bg-primary/5 text-primary font-bold'
                  : theme === 'dark'
                    ? 'border-[#2f3131] bg-[#1a1c1c]'
                    : 'border-border bg-background',
              ].join(' ')}
            >
              {StepIcon && <StepIcon className="w-4 h-4" />}
              <span>{step.label}</span>
            </div>

            {index < (data.steps?.length || 0) - 1 && <ArrowRight className="w-4 h-4 opacity-50" />}
          </React.Fragment>
        )
      })}
    </div>
  )

  if (!showContainer) {
    return content
  }

  return (
    <div
      className={[
        'p-6 rounded border',
        theme === 'dark'
          ? 'bg-[#1a1c1c] border-[#2f3131] text-surface-dim'
          : 'bg-muted border-border text-muted-foreground',
      ].join(' ')}
    >
      {content}
    </div>
  )
}
