"use client"

import type React from "react"

import { Search, Heart, Home, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface HeaderProps {
  onSearch?: (query: string) => void
  searchQuery?: string
  favoritesCount?: number
  currentPage?: "home" | "search" | "favorites" | "details"
  onNavigate?: (page: "home" | "search" | "favorites") => void
}

export function Header({
  onSearch,
  searchQuery = "",
  favoritesCount = 0,
  currentPage = "home",
  onNavigate,
}: HeaderProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (localQuery.trim() && onSearch) {
      onSearch(localQuery.trim())
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Film className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">CineAPI</h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar filmes..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Button
              variant={currentPage === "home" ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigate?.("home")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Início</span>
            </Button>

            <Button
              variant={currentPage === "favorites" ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigate?.("favorites")}
              className="flex items-center gap-2 relative"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Favoritos</span>
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoritesCount > 99 ? "99+" : favoritesCount}
                </span>
              )}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
