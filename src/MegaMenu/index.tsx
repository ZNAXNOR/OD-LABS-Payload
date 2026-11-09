'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { MegaMenuHeader } from './Nav/header'
import { MegaMenuFooter } from './Nav/footer'
import { MegaMenuMain } from './main'
import { useCurrentPost } from './hooks/useCurrentPost'
import { resolveCurrentPage } from './utils/resolveCurrentPage'
import type { PagesData } from '../getPagesData'
import type { LegalPagesData } from '../getLegalPagesData'
import type { PostsData } from '../getPostsData'
import type { MegaMenuRuntimeError } from '@/providers/MegaMenu'
interface Props { open: boolean; onClose: () => void; pages: PagesData[]; legalPages: LegalPagesData[]; posts?: PostsData[]; runtimeError?: MegaMenuRuntimeError | null }
export const MegaMenu = ({open,onClose,pages,legalPages,posts=[],runtimeError}: Props) => {
  const pathname = usePathname(), previousPathname = useRef(pathname)
  const activePost = useCurrentPost(pathname, posts, open)
  useEffect(() => { if (previousPathname.current !== pathname) { previousPathname.current = pathname; if (open) onClose() } }, [pathname,open,onClose])
  const currentPage = resolveCurrentPage({pathname,pages,legalPages,posts,activePost,runtimeError})
  return <Dialog open={open} onOpenChange={(nextOpen) => {if (!nextOpen) onClose()}}>
    <DialogContent showCloseButton={false} overlayClassName="!animate-none transition-opacity duration-300 data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
      onClick={(event) => {
        if (event.defaultPrevented || !(event.target instanceof Element)) return
        const link = event.target.closest<HTMLAnchorElement>('a[href]')
        if (!link || link.target === '_blank') return
        const destination = new URL(link.href, window.location.href)
        if (destination.origin === window.location.origin) onClose()
      }}
      className="fixed inset-0 left-0 top-0 block h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none border-0 bg-[#0A0A0A] p-0 text-white shadow-none !animate-none transition-opacity duration-300 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 sm:rounded-none">
      <DialogTitle className="sr-only">OD LABS navigation</DialogTitle>
      <DialogDescription className="sr-only">Primary site navigation and contextual information for the current route.</DialogDescription>
      <div className="flex h-full min-h-0 flex-col">
        <MegaMenuHeader onClose={onClose} />
        <MegaMenuMain pages={pages} posts={posts} currentPage={currentPage} open={open} />
        <MegaMenuFooter legalPages={legalPages} showReportIssue={currentPage.type !== 'error'} />
      </div>
    </DialogContent>
  </Dialog>
}