import { LegalPageLinks } from '@/components/LegalPageLinks'
import type { LegalPagesData } from '@/getLegalPagesData'

interface MegaMenuFooterProps {
  legalPages: LegalPagesData[]
}

export const MegaMenuFooter = ({ legalPages }: MegaMenuFooterProps) => {
  return (
    <footer>
      <div className="w-full border-t border-[#4B525F] px-6 py-4 font-mono lg:px-12">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div className="text-[11px] text-zinc-500">
            <span>© {new Date().getFullYear()} OD LABS</span>
            <span className="hidden md:inline"> · All rights reserved.</span>
          </div>

          <div className="hidden text-[11px] text-zinc-600 sm:block">ESC to close</div>
        </div>

        {legalPages.length > 0 && (
          <LegalPageLinks
            pages={legalPages}
            className="mt-2 text-[10px] leading-relaxed text-zinc-600 [&_a:hover]:text-zinc-300"
          />
        )}
      </div>
    </footer>
  )
}
