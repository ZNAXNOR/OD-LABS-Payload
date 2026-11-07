import type { PagesData } from '@/getPagesData'

export type RouteSource =
  | 'payload-pages'
  | 'payload-legal'
  | 'system-raw'
  | 'error-404'
  | 'error-500'
  | 'error-something'
  | 'unindexed'

export type ErrorStateCode = '404' | '500' | '503' | 'ERR'

export interface ErrorRecoveryAction {
  number: string
  label: string
  href: string
}

export interface CurrentPageInfo {
  title: string
  slug: string
  href: string
  description: string
  isPayloadDoc: boolean
  source: RouteSource
  errorCode?: ErrorStateCode
  errorEyebrow?: string[]
  recoveryActions?: ErrorRecoveryAction[]
  sections?: PagesData['sections']
}
