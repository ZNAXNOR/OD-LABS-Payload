import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header, MegaMenu, SocialMedia } from '@/payload-types'

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)()
  const megaMenuData: MegaMenu = await getCachedGlobal('mega-menu', 1)()
  const socialMediaData: SocialMedia = await getCachedGlobal('social-media', 1)()

  return <HeaderClient data={headerData} megaMenu={megaMenuData} socialMedia={socialMediaData} />
}
