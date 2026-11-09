import type { CurrentPageInfo } from '../types'
import { PageContext } from '../context/renderers/PageContext'
import { PostContext } from '../context/renderers/PostContext'
import { LegalContext } from '../context/renderers/LegalContext'
import { StandaloneContext } from '../context/renderers/StandaloneContext'
import { PostsIndexContext } from '../context/renderers/PostsIndexContext'
import { ErrorContext } from '../context/renderers/ErrorContext'

interface MegaMenuCurrentPageProps {
  page: CurrentPageInfo
}

export const MegaMenu_CurrentPage = ({ page }: MegaMenuCurrentPageProps) => {
  switch (page.type) {
    case 'page':
      return <PageContext context={page} mode="current" />
    case 'post':
      return <PostContext context={page} mode="current" />
    case 'legal':
      return <LegalContext context={page} mode="current" />
    case 'posts-index':
      return <PostsIndexContext context={page} mode="current" />
    case 'standalone':
      return <StandaloneContext context={page} />
    case 'error':
      return <ErrorContext context={page} compact />
  }
}
