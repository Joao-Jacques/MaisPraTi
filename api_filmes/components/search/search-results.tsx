"use client"

import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { MovieCard } from "@/components/movie/movie-card"
import { MovieCardSkeleton } from "@/components/ui/skeleton"
import { tmdbService, type Movie, type SearchResponse } from "@/lib/tmdb-client"

interface SearchResultsProps {
  query: string
  onMovieSelect?: (movie: Movie) => void
}

export function SearchResults({ query, onMovieSelect }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const searchMovies = async (searchQuery: string, page = 1) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await tmdbService.searchMovies(searchQuery, page)
      setResults(response)
      setCurrentPage(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar filmes")
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      setCurrentPage(1)
      searchMovies(query, 1)
    }
  }, [query])

  const handlePageChange = (page: number) => {
    if (query && page !== currentPage) {
      searchMovies(query, page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleRetry = () => {
    if (query) {
      searchMovies(query, currentPage)
    }
  }

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Busque por filmes</h2>
        <p className="text-muted-foreground max-w-md">
          Digite o nome de um filme na barra de pesquisa para encontrar informações detalhadas, trailers e muito mais.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Buscando "{query}"...</h2>
            <div className="flex items-center gap-2 mt-2">
              <LoadingSpinner size="sm" />
              <p className="text-muted-foreground">Carregando resultados...</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ErrorMessage message={error} onRetry={handleRetry} />
      </div>
    )
  }

  if (results && results.results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Nenhum filme encontrado</h2>
        <p className="text-muted-foreground max-w-md">
          Não encontramos filmes para "{query}". Tente buscar com termos diferentes.
        </p>
      </div>
    )
  }

  if (!results) return null

  const totalPages = Math.min(results.total_pages, 500) // TMDB API limit
  const startPage = Math.max(1, currentPage - 2)
  const endPage = Math.min(totalPages, startPage + 4)

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Resultados para "{query}"</h2>
          <p className="text-muted-foreground">{results.total_results.toLocaleString()} filmes encontrados</p>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {results.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onSelect={onMovieSelect} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {startPage > 1 && (
              <>
                <Button variant="outline" size="sm" onClick={() => handlePageChange(1)}>
                  1
                </Button>
                {startPage > 2 && <span className="px-2 text-muted-foreground">...</span>}
              </>
            )}

            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <span className="px-2 text-muted-foreground">...</span>}
                <Button variant="outline" size="sm" onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
