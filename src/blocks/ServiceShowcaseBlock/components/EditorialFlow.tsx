import React from 'react'
import { Plus } from 'lucide-react'

import RichText from '@/components/RichText'
import { ArtifactRenderer } from '@/artifacts'

import type { ServiceShowcaseItem } from '../types'

type Props = {
  item: ServiceShowcaseItem
}

export const EditorialFlow: React.FC<Props> = ({ item }) => {
  return (
    <div className="space-y-20">
      {/* The Challenge */}
      {item.challenge && (
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-red-700 mb-6 font-mono">
            The Challenge
          </h4>
          <RichText
            data={item.challenge}
            enableGutter={false}
            className="prose prose-lg max-w-none"
          />
        </div>
      )}

      {/* The Approach */}
      {item.approach && (
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-teal-700 mb-6 font-mono">
            The Approach
          </h4>
          <RichText
            data={item.approach}
            enableGutter={false}
            className="prose prose-lg max-w-none"
          />

          {/* Artifact — embedded inside Approach as proof */}
          {item.artifact && (
            <div className="mt-10">
              <ArtifactRenderer
                artifact={item.artifact}
                presentation={{
                  showContainer: true,
                  theme: 'light',
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Capabilities */}
      {!!item.capabilities?.length && (
        <div className="border-t border-surface-container pt-10">
          <h5 className="font-bold mb-8 text-sm font-mono flex items-center gap-3 uppercase tracking-widest text-on-surface-variant">
            <Plus className="w-5 h-5 text-red-700" />
            Capabilities
          </h5>
          <div className="grid sm:grid-cols-2 gap-6">
            {item.capabilities.map((cap, i) => (
              <div
                key={i}
                className="p-6 bg-surface border border-outline-variant rounded text-base font-medium hover:border-primary/50 transition-colors"
              >
                {cap.capability}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
