"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { SearchResults } from "@/components/search/search-results"
import { MovieDetails } from "@/components/movie/movie-details"
import { FavoritesList } from "@/components/favorites/favorites-list"
import { HomePage } from "@/components/home/home-page"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { OfflineIndicator } from "@/components/ui/offline-indicator"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import type { Movie } from "@/lib/tmdb-client"

type AppPage = "home" | "search" | "favorites" | "details"

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const { favoritesCount } = useFavorites()
  const { ToastContainer } = useToast()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage("search")
  }

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie)
    setCurrentPage("details")
  }

  const handleNavigate = (page: "home" | "search" | "favorites") => {
    setCurrentPage(page)
    if (page === "home") {
      setSearchQuery("")
      setSelectedMovie(null)
    }
  }

  const handleBackToSearch = () => {
    setCurrentPage("search")
    setSelectedMovie(null)
  }

  const handleBackToHome = () => {
    setCurrentPage("home")
    setSelectedMovie(null)
    setSearchQuery("")
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <OfflineIndicator />

        <Header
          onSearch={handleSearch}
          searchQuery={searchQuery}
          favoritesCount={favoritesCount}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />

        <main className="container mx-auto px-4 py-6">
          <ErrorBoundary>{currentPage === "home" && <HomePage onMovieSelect={handleMovieSelect} />}</ErrorBoundary>

          <ErrorBoundary>
            {currentPage === "search" && <SearchResults query={searchQuery} onMovieSelect={handleMovieSelect} />}
          </ErrorBoundary>

          <ErrorBoundary>
            {currentPage === "favorites" && <FavoritesList onMovieSelect={handleMovieSelect} />}
          </ErrorBoundary>

          <ErrorBoundary>
            {currentPage === "details" && selectedMovie && (
              <MovieDetails movie={selectedMovie} onBack={searchQuery ? handleBackToSearch : handleBackToHome} />
            )}
          </ErrorBoundary>
        </main>

        <ToastContainer />
      </div>
    </ErrorBoundary>
  )
}
