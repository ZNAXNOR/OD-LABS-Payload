import type { Page } from '@/payload-types'

type CodeFeatureBlock = Extract<Page['layout'][0], { blockType: 'codeFeature' }>

type CodeBlips = CodeFeatureBlock extends never
  ? any
  : NonNullable<CodeFeatureBlock['codeFeatureFields']['codeTabs']>[number]['codeBlips']

export type CodeBlip = CodeBlips extends any[] ? CodeBlips[number] : any

export interface Props {
  children: string
  className?: string
  codeBlips?: CodeBlips
  disableMinHeight?: boolean
  parentClassName?: string
  showLineNumbers?: boolean
  title?: string
}
