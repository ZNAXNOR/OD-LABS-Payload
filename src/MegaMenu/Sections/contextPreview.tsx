import type { PagesData } from '../../getPagesData'
import type { CurrentPageInfo, PageContextData } from '../types'
import type { ContactSocial } from '@/payload-types'
import { MegaMenu_ContextDefault } from './contextDefault'
import { PageContext } from '../context/renderers/PageContext'
import { PostContext } from '../context/renderers/PostContext'
import { LegalContext } from '../context/renderers/LegalContext'
import { PostsIndexContext } from '../context/renderers/PostsIndexContext'
import { ErrorContext } from '../context/renderers/ErrorContext'

interface MegaMenuContextPreviewProps {
  page: PagesData | null
  currentPage: CurrentPageInfo
  contactSocials?: ContactSocial | null
}

export const MegaMenu_ContextPreview = ({
  page,
  currentPage,
  contactSocials,
}: MegaMenuContextPreviewProps) => {
  if (page) {
    const previewContext: PageContextData = {
      type: 'page',
      title: page.title,
      slug: page.slug,
      href: page.href,
      description: page.description,
      seoImage: page.seoImage,
      sections: page.sections,
    }
    return <PageContext context={previewContext} mode="preview" />
  }

  switch (currentPage.type) {
    case 'error':
      return <ErrorContext context={currentPage} />
    case 'post':
      return <PostContext context={currentPage} />
    case 'legal':
      return <LegalContext context={currentPage} />
    case 'posts-index':
      return <PostsIndexContext context={currentPage} />
    default:
      return <MegaMenu_ContextDefault contactSocials={contactSocials} />
  }
}
