'use client'

import { useEffect } from 'react'
import { useMegaMenu } from '@/providers/MegaMenu'

export const NotFoundContextBridge = () => {
  const { setRuntimeError, clearRuntimeError } = useMegaMenu()

  useEffect(() => {
    setRuntimeError({ code: '404' })
    return clearRuntimeError
  }, [setRuntimeError, clearRuntimeError])

  return null
}
