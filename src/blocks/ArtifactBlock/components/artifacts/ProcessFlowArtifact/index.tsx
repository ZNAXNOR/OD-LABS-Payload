import React from 'react'

import { ArrowRight, GitCommitHorizontal, FlaskConical, Rocket } from 'lucide-react'

const iconMap = {
  GitCommitHorizontal,
  FlaskConical,
  Rocket,
}

import type { ProcessFlowArtifact as ProcessFlowArtifactType } from '../../../types'

type Props = {
  data?: ProcessFlowArtifactType
  dark?: boolean
}

export const ProcessFlowArtifact: React.FC<Props> = ({
  data,
  dark = false,
}) => {
  return (
    <div
      className={[
        'p-6 rounded border flex items-center justify-center gap-4 flex-wrap font-mono text-sm',
        dark
          ? 'bg-[#1a1c1c] border-[#2f3131] text-primary-fixed'
          : 'bg-muted border-border text-primary',
      ].join(' ')}
    >
      {data?.steps?.map((step, index) => {
        const StepIcon = step.icon ? iconMap[step.icon as keyof typeof iconMap] : null

        return (
        <React.Fragment
          key={step.id || index}
        >
          <div
            className={[
              'text-center p-4 border rounded flex items-center justify-center gap-2',
              step.highlight
                ? dark
                  ? 'border-primary-fixed bg-primary-fixed/10 text-primary-fixed font-bold'
                  : 'border-primary bg-primary/5 text-primary font-bold'
                : dark
                  ? 'border-[#2f3131] bg-[#1a1c1c]'
                  : 'border-border bg-background',
            ].join(' ')}
          >
            {StepIcon && <StepIcon className="w-4 h-4" />}
            <span>{step.label}</span>
          </div>

          {index <
            (data.steps?.length || 0) - 1 && (
            <ArrowRight className="w-4 h-4 opacity-50" />
          )}
        </React.Fragment>
        )
      })}
    </div>
  )
}
