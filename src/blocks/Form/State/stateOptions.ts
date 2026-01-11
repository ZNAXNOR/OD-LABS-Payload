import { US_stateOptions } from './options/US-options'
import { IN_stateOptions } from './options/IN-options'

export const statesByCountry: Record<string, { label: string; value: string }[]> = {
  IN: IN_stateOptions,
  US: US_stateOptions,
}
