import type { Field } from 'payload'
import { ContactInfoTab } from './tabs/ContactInfo'
import { BusinessHoursTab } from './tabs/BusinessHours'

export const fields: Field[] = [
  {
    type: 'tabs',
    tabs: [ContactInfoTab, BusinessHoursTab],
  },
]
