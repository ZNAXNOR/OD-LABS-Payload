import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer, SocialMedia } from '@/payload-types'

import { FooterClient } from './Component.client'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const socialMediaData: SocialMedia = await getCachedGlobal('social-media', 1)()

  return <FooterClient footer={footerData} socialMedia={socialMediaData} />
}
