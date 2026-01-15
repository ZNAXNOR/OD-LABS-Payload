import type { ThemeType, HeightType } from './types'

export const getThemeClasses = (
  theme: ThemeType | null | undefined,
  hasBackground: boolean,
): string => {
  if (theme === 'light') return 'text-zinc-900 dark:text-zinc-100'
  if (theme === 'dark') return 'text-white'

  // Auto theme - adapt based on background
  if (hasBackground) return 'text-white'
  return 'text-zinc-900 dark:text-zinc-100'
}

export const getHeightClasses = (height: HeightType | null | undefined): string => {
  switch (height) {
    case 'small':
      return 'min-h-[50vh]'
    case 'medium':
      return 'min-h-[75vh]'
    case 'large':
      return 'min-h-screen'
    case 'auto':
      return 'py-20 md:py-32'
    default:
      return 'min-h-screen'
  }
}

export const getOverlayStyles = (
  enabled: boolean | null | undefined,
  opacity: number | null | undefined,
  color: string | null | undefined,
  hasBackground: boolean,
): React.CSSProperties => {
  if (!enabled || !hasBackground) return {}

  const finalOpacity = (opacity || 40) / 100
  const finalColor = color || 'black'

  const colorMap: Record<string, string> = {
    black: `rgba(0, 0, 0, ${finalOpacity})`,
    white: `rgba(255, 255, 255, ${finalOpacity})`,
    primary: `rgba(var(--brand-primary), ${finalOpacity})`,
  }

  return {
    backgroundColor: colorMap[finalColor] || colorMap.black,
  }
}
