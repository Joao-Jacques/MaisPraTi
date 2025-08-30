"use client"

import { useState, useEffect } from "react"
import { WifiOff, Wifi } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    // Check initial state
    setIsOnline(navigator.onLine)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showOfflineMessage) return null

  return (
    <Alert className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto bg-destructive/10 border-destructive/20">
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Você está offline. Algumas funcionalidades podem não funcionar.</span>
        {isOnline && (
          <div className="flex items-center gap-1 text-green-600">
            <Wifi className="h-3 w-3" />
            <span className="text-xs">Reconectado</span>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
