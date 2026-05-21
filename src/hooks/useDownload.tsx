import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type Handler = () => void | Promise<void>

interface DownloadContextValue {
  handler: Handler | null
  setHandler: (h: Handler | null) => void
}

const DownloadContext = createContext<DownloadContextValue | null>(null)

export function DownloadProvider({ children }: { children: ReactNode }) {
  const [handler, setHandlerState] = useState<Handler | null>(null)
  const setHandler = useCallback((h: Handler | null) => setHandlerState(() => h), [])
  return (
    <DownloadContext.Provider value={{ handler, setHandler }}>{children}</DownloadContext.Provider>
  )
}

export function useDownload() {
  const ctx = useContext(DownloadContext)
  if (!ctx) throw new Error('useDownload must be used within DownloadProvider')
  return ctx
}
