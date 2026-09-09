export type ContentColumnSize = 'zero' | 'oneThird' | 'half' | 'twoThirds' | 'full'

export interface ContentColumnSizeConfig {
  snapPoints?: ContentColumnSize[]
  min?: ContentColumnSize
  max?: ContentColumnSize
}

export const CANONICAL_POINTS: Record<ContentColumnSize, { cols: number; percent: number }> = {
  zero: { cols: 0, percent: 0 },
  oneThird: { cols: 3, percent: (3 / 12) * 100 },
  half: { cols: 6, percent: 50 },
  twoThirds: { cols: 9, percent: (9 / 12) * 100 },
  full: { cols: 12, percent: 100 },
}

export const ALL_CANONICAL_KEYS: ContentColumnSize[] = [
  'zero',
  'oneThird',
  'half',
  'twoThirds',
  'full',
]

export function getVisiblePoints(config?: ContentColumnSizeConfig): ContentColumnSize[] {
  const snapPointsConfig = config?.snapPoints ?? ALL_CANONICAL_KEYS
  const minConfig = config?.min ?? 'oneThird'
  const maxConfig = config?.max ?? 'full'

  const minCols = CANONICAL_POINTS[minConfig]?.cols ?? 0
  const maxCols = CANONICAL_POINTS[maxConfig]?.cols ?? 12

  return ALL_CANONICAL_KEYS.filter((key) => {
    const point = CANONICAL_POINTS[key]
    return snapPointsConfig.includes(key) && point.cols >= minCols && point.cols <= maxCols
  })
}

export function findNearestVisiblePoint(
  targetCols: number,
  visiblePoints: ContentColumnSize[],
): ContentColumnSize | null {
  if (visiblePoints.length === 0) return null

  let nearest = visiblePoints[0]
  let minDiff = Math.abs(CANONICAL_POINTS[nearest].cols - targetCols)

  for (let i = 1; i < visiblePoints.length; i++) {
    const pt = visiblePoints[i]
    const diff = Math.abs(CANONICAL_POINTS[pt].cols - targetCols)
    if (diff < minDiff) {
      minDiff = diff
      nearest = pt
    }
  }

  return nearest
}

export function normalizeValue(
  value: ContentColumnSize | null | undefined,
  visiblePoints: ContentColumnSize[],
): ContentColumnSize | null {
  if (visiblePoints.length === 0) return null

  if (value && visiblePoints.includes(value)) {
    return value
  }

  const currentNumeric =
    value && CANONICAL_POINTS[value] ? CANONICAL_POINTS[value].cols : CANONICAL_POINTS.oneThird.cols

  return findNearestVisiblePoint(currentNumeric, visiblePoints)
}
