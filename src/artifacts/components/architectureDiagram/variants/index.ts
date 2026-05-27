import type {
  ArchitectureDiagramLayout,
  ArchitectureDiagramVariant,
} from '../../../types'

/* ------------------------------------------------------------------ */
/*  Grid column mapping                                                */
/* ------------------------------------------------------------------ */

const colsMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
}

export function getGridCols(count: number): string {
  return colsMap[count] ?? colsMap[3]
}

/* ------------------------------------------------------------------ */
/*  Variant style mapping                                              */
/*                                                                     */
/*  Hierarchy:                                                         */
/*    Primary   – accent bg + text, bold (most prominent)              */
/*    Secondary – neutral bg + muted text (default/receded)            */
/*    Highlight – same accent as primary, but darker bg (extra punch)  */
/* ------------------------------------------------------------------ */

export const variantStyles: Record<
  ArchitectureDiagramVariant,
  (isDark: boolean) => string
> = {
  primary: (dark) =>
    dark
      ? 'bg-primary/10 text-primary border-primary/10 font-bold'
      : 'bg-muted text-primary border-primary/10 font-bold',

  secondary: (dark) =>
    dark
      ? 'bg-[#1a1c1c] border-primary/10 text-primary'
      : 'bg-muted border-primary/10 text-foreground',

  highlight: (dark) =>
    dark
      ? 'bg-primary/10 text-primary border-primary/30 font-bold'
      : 'border-primary bg-primary/10 text-primary font-bold',
}

/* ------------------------------------------------------------------ */
/*  Section-level style resolution                                     */
/* ------------------------------------------------------------------ */

export function getSectionStyles(
  layout: ArchitectureDiagramLayout,
  variant: ArchitectureDiagramVariant,
  isDark: boolean,
): { container: string; item: string } {
  /* ---- container grid ---- */
  const container =
    layout === 'row'
      ? 'grid grid-cols-1'
      : layout === 'columns'
        ? 'grid gap-4'
        : layout === 'split'
          ? 'grid grid-cols-3 gap-4'
          : ''

  /* ---- item cards ---- */
  const base = 'rounded border p-4 text-center text-sm'
  const variantStyle = variantStyles[variant](isDark)

  return {
    container,
    item: [base, variantStyle].join(' '),
  }
}
