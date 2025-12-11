import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header, Contact } from '@/payload-types'

export async function Header() {
  const headerData: Header = (await getCachedGlobal('header', 1)()) as Header
  const contactData: any = (await getCachedGlobal('contact', 1)()) as any

  return <HeaderClient data={headerData} contactData={contactData} />
}
