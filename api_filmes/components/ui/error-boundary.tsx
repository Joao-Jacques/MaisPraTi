"use client"

import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent
          error={this.state.error}
          retry={() => this.setState({ hasError: false, error: undefined })}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, retry }: { error?: Error; retry?: () => void }) {
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardContent className="p-6 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">Algo deu errado</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {error?.message || "Ocorreu um erro inesperado. Tente recarregar a página."}
          </p>
        </div>
        {retry && (
          <Button onClick={retry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
