import type { ArchitectureDiagramVariant } from '../../../types'

export function getVariantStyles(
  variant: ArchitectureDiagramVariant,
  isDark: boolean,
) {
  switch (variant) {
    case 'primary':
      return isDark
        ? 'bg-surface-container-high border-outline font-bold'
        : 'bg-muted border-border font-bold'

    case 'highlight':
      return isDark
        ? 'bg-primary/10 border-primary/20 font-bold'
        : 'bg-primary/5 border-primary/20 font-bold'

    case 'secondary':
    default:
      return isDark
        ? 'bg-white border-[#2f3131]'
        : 'bg-muted border-border'
  }
}
