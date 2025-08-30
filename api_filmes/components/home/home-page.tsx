"use client"

import { useState, useEffect } from "react"
import { Flame, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { MovieCard } from "@/components/movie/movie-card"
import { tmdbService, type Movie, type SearchResponse } from "@/lib/tmdb-client"

interface HomePageProps {
  onMovieSelect?: (movie: Movie) => void
}

type MovieSection = "popular" | "trending"

export function HomePage({ onMovieSelect }: HomePageProps) {
  const [activeSection, setActiveSection] = useState<MovieSection>("popular")
  const [popularMovies, setPopularMovies] = useState<SearchResponse | null>(null)
  const [trendingMovies, setTrendingMovies] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMovies = async (section: MovieSection) => {
    setLoading(true)
    setError(null)

    try {
      let response: SearchResponse

      if (section === "popular") {
        if (popularMovies) {
          setLoading(false)
          return
        }
        response = await tmdbService.getPopularMovies()
        setPopularMovies(response)
      } else {
        if (trendingMovies) {
          setLoading(false)
          return
        }
        response = await tmdbService.getTrendingMovies()
        setTrendingMovies(response)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar filmes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMovies("popular")
  }, [])

  const handleSectionChange = (section: MovieSection) => {
    setActiveSection(section)
    loadMovies(section)
  }

  const handleRetry = () => {
    loadMovies(activeSection)
  }

  const currentMovies = activeSection === "popular" ? popularMovies : trendingMovies

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Descubra Filmes Incríveis</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Explore milhares de filmes, veja detalhes completos, trailers e monte sua lista de favoritos. Sua próxima
          sessão de cinema começa aqui.
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant={activeSection === "popular" ? "default" : "outline"}
          onClick={() => handleSectionChange("popular")}
          className="flex items-center gap-2"
        >
          <Flame className="h-4 w-4" />
          Populares
        </Button>
        <Button
          variant={activeSection === "trending" ? "default" : "outline"}
          onClick={() => handleSectionChange("trending")}
          className="flex items-center gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Em Alta
        </Button>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-muted-foreground">Carregando filmes...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-12">
          <ErrorMessage message={error} onRetry={handleRetry} />
        </div>
      )}

      {currentMovies && currentMovies.results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {activeSection === "popular" ? "Filmes Populares" : "Filmes em Alta"}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {currentMovies.results.slice(0, 18).map((movie) => (
              <MovieCard key={movie.id} movie={movie} onSelect={onMovieSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
