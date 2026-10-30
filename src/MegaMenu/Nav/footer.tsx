import { LegalPageLinks } from '@/components/LegalPageLinks'
import type { LegalPagesData } from '@/getLegalPagesData'

interface MegaMenuFooterProps {
  legalPages: LegalPagesData[]
}

export const MegaMenuFooter = ({ legalPages }: MegaMenuFooterProps) => {
  return (
    <footer>
      <div className="w-full border-t border-zinc-600 px-6 py-4 font-mono lg:px-12">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex flex-row text-xs gap-2 text-zinc-500">
            <span>© {new Date().getFullYear()} OD LABS</span>
            <span className="hidden md:inline"> · All rights reserved · </span>
            {legalPages.length > 0 && (
              <LegalPageLinks
                pages={legalPages}
                className="text-xs leading-relaxed text-zinc-400 [&_a:hover]:text-zinc-200"
              />
            )}
          </div>

          <div className="hidden text-xs text-zinc-600 sm:block">
            ESC to close
          </div>
        </div>
      </div>
    </footer>
  )
}
