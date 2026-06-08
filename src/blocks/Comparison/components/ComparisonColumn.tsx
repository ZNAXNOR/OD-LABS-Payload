import React from 'react'

import RichText from '@/components/RichText'

import {
  Building2,
  MessagesSquare,
  Gauge,
  FlaskConical,
  Layers3,
  Workflow,
} from 'lucide-react'

import type { ComparisonColumn as ComparisonColumnType } from '../types'

const iconMap = {
  architecture: Layers3,
  foundation: Building2,
  communication: MessagesSquare,
  speed: Gauge,
  groups: Workflow,
  experiment: FlaskConical,
}

type Props = {
  column: ComparisonColumnType

  itemIconClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  showDescription?: boolean

  compact?: boolean
  useBulletPoints?: boolean
}

export const ComparisonColumn: React.FC<Props> = ({
  column,

  itemIconClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  showDescription = true,

  compact = false,
  useBulletPoints = false,
}) => {
  return (
    <ul className={compact ? 'space-y-8' : 'space-y-10'}>
      {column.items?.map((item, i) => {
        const IconComponent = iconMap[item.icon as keyof typeof iconMap]

        return (
          <li key={item.id || i} className="flex gap-4">
            {useBulletPoints ? (
              <span className={`h-1.5 w-1.5 rounded-full inline-block shrink-0 mt-2.5 bg-current ${itemIconClassName}`} />
            ) : (
              <span className={itemIconClassName}>
                {IconComponent && <IconComponent className="h-5 w-5 mt-1 shrink-0" />}
              </span>
            )}

            <div>
              <p className={titleClassName}>
                {item.title}
              </p>

              {showDescription && item.description && (
                <RichText
                  data={item.description}
                  enableGutter={false}
                  className={descriptionClassName}
                />
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
