"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
  onClose?: () => void
  duration?: number
}

export function Toast({ title, description, variant = "default", onClose, duration = 3000 }: ToastProps) {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const variantStyles = {
    default: "bg-background border-border text-foreground",
    success:
      "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
    error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
    warning:
      "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg animate-in slide-in-from-bottom-2",
        variantStyles[variant],
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && <div className="font-semibold text-sm">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-70 hover:opacity-100" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
