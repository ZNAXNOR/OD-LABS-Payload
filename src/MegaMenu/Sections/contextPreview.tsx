import type { PagesData } from '../../getPagesData'
import type { PageContextData } from '../types'
import type { ContactSocial } from '@/payload-types'
import { MegaMenu_ContextDefault } from './contextDefault'
import { PageContext } from '../context/renderers/PageContext'

interface MegaMenuContextPreviewProps {
  page: PagesData | null
  contactSocials?: ContactSocial | null
  open: boolean
}

export const MegaMenu_ContextPreview = ({ page, contactSocials, open }: MegaMenuContextPreviewProps) => {
  if (page) {
    const previewContext: PageContextData = {
      type: 'page',
      title: page.title,
      slug: page.slug,
      href: page.href,
      description: page.description,
      seoImage: page.seoImage,
      showSeoImageInMegaMenu: page.showSeoImageInMegaMenu,
      showCssPreviewInMegaMenu: page.showCssPreviewInMegaMenu,
      sections: page.sections,
    }
    return <PageContext context={previewContext} mode="preview" />
  }

  return <MegaMenu_ContextDefault contactSocials={contactSocials} active={open} />
}
