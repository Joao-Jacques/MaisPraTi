"use client"

import { useState, useCallback } from "react"
import { Toast } from "@/components/ui/toast"

interface ToastOptions {
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
  duration?: number
}

interface ToastState extends ToastOptions {
  id: string
  open: boolean
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastState = {
      id,
      open: true,
      ...options,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, options.duration || 3000)

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const ToastContainer = useCallback(() => {
    return (
      <>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            duration={0} // Controlled by useToast
            onClose={() => dismiss(toast.id)}
          />
        ))}
      </>
    )
  }, [toasts, dismiss])

  return {
    toast,
    dismiss,
    ToastContainer,
  }
}
