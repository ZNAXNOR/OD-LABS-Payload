'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { PointerEvent, RefObject } from 'react'
import type { PagesData } from '@/getPagesData'

interface Point { x: number; y: number }
interface UseMenuAimOptions {
  panelRef: RefObject<HTMLElement | null>
  onActivate: (page: PagesData) => void
  enabled: boolean
}

const pointInTriangle = (point: Point, a: Point, b: Point, c: Point) => {
  const sign = (p1: Point, p2: Point, p3: Point) =>
    (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)
  const d1 = sign(point, a, b)
  const d2 = sign(point, b, c)
  const d3 = sign(point, c, a)
  const hasNegative = d1 < 0 || d2 < 0 || d3 < 0
  const hasPositive = d1 > 0 || d2 > 0 || d3 > 0
  return !(hasNegative && hasPositive)
}

/** Protects a selected preview while the pointer crosses adjacent links toward the context panel. */
export const useMenuAim = ({ panelRef, onActivate, enabled }: UseMenuAimOptions) => {
  const activePageRef = useRef<PagesData | null>(null)
  const pendingPageRef = useRef<PagesData | null>(null)
  const anchorRef = useRef<Point | null>(null)
  const pointerRef = useRef<Point | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearPending = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    pendingPageRef.current = null
  }, [])

  const activate = useCallback((page: PagesData, point?: Point) => {
    clearPending()
    activePageRef.current = page
    if (point) anchorRef.current = point
    onActivate(page)
  }, [clearPending, onActivate])

  const onPagePointerEnter = useCallback((page: PagesData, event: PointerEvent<HTMLElement>) => {
    const point = { x: event.clientX, y: event.clientY }
    pointerRef.current = point
    if (event.pointerType !== 'mouse' || !enabled || !activePageRef.current || activePageRef.current.slug === page.slug) {
      activate(page, point)
      return
    }

    const panel = panelRef.current
    const anchor = anchorRef.current
    if (!panel || !anchor) {
      activate(page, point)
      return
    }

    const rect = panel.getBoundingClientRect()
    const safeTop = { x: rect.left - 12, y: rect.top - 24 }
    const safeBottom = { x: rect.left - 12, y: rect.bottom + 24 }
    if (point.x >= anchor.x && pointInTriangle(point, anchor, safeTop, safeBottom)) {
      pendingPageRef.current = page
      if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          const pending = pendingPageRef.current
          if (pending) activate(pending, pointerRef.current || point)
        }, 320)
      }
      return
    }
    activate(page, point)
  }, [activate, enabled, panelRef])

  const onPageFocus = useCallback((page: PagesData) => {
    activate(page, pointerRef.current || undefined)
  }, [activate])

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const point = { x: event.clientX, y: event.clientY }
    pointerRef.current = point
    const pending = pendingPageRef.current
    const anchor = anchorRef.current
    const panel = panelRef.current
    if (!pending || !anchor || !panel) return
    const rect = panel.getBoundingClientRect()
    const insideSafeRegion = point.x >= anchor.x && pointInTriangle(
      point, anchor,
      { x: rect.left - 12, y: rect.top - 24 },
      { x: rect.left - 12, y: rect.bottom + 24 },
    )
    if (!insideSafeRegion) activate(pending, point)
  }, [activate, panelRef])

  const onPanelPointerEnter = useCallback(clearPending, [clearPending])
  const reset = useCallback(() => {
    clearPending()
    activePageRef.current = null
    anchorRef.current = null
  }, [clearPending])

  useEffect(() => { if (!enabled) reset() }, [enabled, reset])
  useEffect(() => () => clearPending(), [clearPending])

  return { onPagePointerEnter, onPageFocus, onPointerMove, onPanelPointerEnter, reset }
}
