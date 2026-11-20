import { LegalPageLinks } from '@/components/LegalPageLinks'
import type { LegalPagesData } from '@/getLegalPagesData'

interface MegaMenuFooterProps {
  legalPages: LegalPagesData[]
}

export const MegaMenuFooter = ({ legalPages }: MegaMenuFooterProps) => (
  <footer>
    <div className="w-full border-t border-border-default px-6 py-4 font-mono lg:px-12">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-row gap-2 text-xs text-text-muted">
          <span>© {new Date().getFullYear()} OD LABS</span>
          <span className="hidden md:inline"> · All rights reserved · </span>
          {legalPages.length > 0 && (
            <LegalPageLinks pages={legalPages} className="text-xs leading-relaxed text-text-secondary [&_a:hover]:text-text-primary" />
          )}
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="hidden text-text-muted sm:block">ESC to close</span>
        </div>
      </div>
    </div>
  </footer>
)
