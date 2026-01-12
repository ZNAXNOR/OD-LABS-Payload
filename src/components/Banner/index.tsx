import type { BannerBlock } from '@/payload-types'

import { CheckIcon } from '@/icons/CheckIcon/index'
import { CMSLink } from '@/components/CMSLink'
import * as React from 'react'

import { RichText } from '../RichText/index'
import classes from './index.module.scss'

export type Props = {
  checkmark?: boolean
  children?: React.ReactNode
  content?: BannerBlock['content'] | BannerBlock['content']
  icon?: 'checkmark'
  margin?: boolean
  marginAdjustment?: any
  style?: BannerBlock['style']
}

const Icons = {
  checkmark: CheckIcon,
}

export const Banner: React.FC<Props> = ({
  style = 'info',
  checkmark,
  children,
  content,
  icon,
  margin = true,
  marginAdjustment = {},
}) => {
  let Icon = icon && Icons[icon]
  if (!Icon && checkmark) {
    Icon = Icons.checkmark
  }

  return (
    <div
      className={[classes.banner, 'banner', style && classes[style], !margin && classes.noMargin]
        .filter(Boolean)
        .join(' ')}
      style={marginAdjustment}
    >
      {Icon && <Icon className={classes.icon} />}

      {content && <RichText content={content} />}
      {children && <div className={classes.children}>{children}</div>}
    </div>
  )
}
