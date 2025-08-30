"use client"

import { Heart, Trash2, SortAsc, SortDesc, Calendar, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MovieCard } from "@/components/movie/movie-card"
import { useFavorites } from "@/hooks/use-favorites"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Movie } from "@/lib/tmdb-client"
import { useState } from "react"

interface FavoritesListProps {
  onMovieSelect?: (movie: Movie) => void
}

type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc" | "rating-desc" | "rating-asc"

export function FavoritesList({ onMovieSelect }: FavoritesListProps) {
  const { favorites, isLoading, removeFromFavorites } = useFavorites()
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")

  const handleMovieSelect = (favoriteMovie: any) => {
    // Convert FavoriteMovie to Movie format
    const movie: Movie = {
      id: favoriteMovie.id,
      title: favoriteMovie.title,
      poster_path: favoriteMovie.poster_path,
      release_date: favoriteMovie.release_date,
      vote_average: favoriteMovie.vote_average,
      overview: "", // Will be loaded in details
      backdrop_path: null,
      genre_ids: [],
      adult: false,
      original_language: "",
      original_title: favoriteMovie.title,
      popularity: 0,
      video: false,
      vote_count: 0,
    }
    onMovieSelect?.(movie)
  }

  const clearAllFavorites = () => {
    if (confirm("Tem certeza que deseja remover todos os favoritos?")) {
      favorites.forEach((movie) => removeFromFavorites(movie.id))
    }
  }

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      case "date-asc":
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
      case "title-asc":
        return a.title.localeCompare(b.title)
      case "title-desc":
        return b.title.localeCompare(a.title)
      case "rating-desc":
        return b.vote_average - a.vote_average
      case "rating-asc":
        return a.vote_average - b.vote_average
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-muted-foreground">Carregando favoritos...</p>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Heart className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Nenhum favorito ainda</h2>
        <p className="text-muted-foreground max-w-md leading-relaxed">
          Comece a explorar filmes e adicione seus favoritos clicando no ícone de coração nos cards dos filmes.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            Meus Favoritos
          </h2>
          <p className="text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? "filme" : "filmes"} na sua lista
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Adicionado recentemente
                </div>
              </SelectItem>
              <SelectItem value="date-asc">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Adicionado primeiro
                </div>
              </SelectItem>
              <SelectItem value="title-asc">
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4" />
                  Título A-Z
                </div>
              </SelectItem>
              <SelectItem value="title-desc">
                <div className="flex items-center gap-2">
                  <SortDesc className="h-4 w-4" />
                  Título Z-A
                </div>
              </SelectItem>
              <SelectItem value="rating-desc">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Maior avaliação
                </div>
              </SelectItem>
              <SelectItem value="rating-asc">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Menor avaliação
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {favorites.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFavorites}
              className="flex items-center gap-2 text-destructive hover:text-destructive bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Limpar Lista</span>
            </Button>
          )}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {sortedFavorites.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={{
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              vote_average: movie.vote_average,
              overview: "",
              backdrop_path: null,
              genre_ids: [],
              adult: false,
              original_language: "",
              original_title: movie.title,
              popularity: 0,
              video: false,
              vote_count: 0,
            }}
            onSelect={handleMovieSelect}
            showFavoriteButton={true}
          />
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold text-sm text-muted-foreground mb-2">Estatísticas dos Favoritos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total de filmes</p>
            <p className="font-semibold text-foreground">{favorites.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Avaliação média</p>
            <p className="font-semibold text-foreground">
              {favorites.length > 0
                ? (favorites.reduce((sum, movie) => sum + movie.vote_average, 0) / favorites.length).toFixed(1)
                : "0.0"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Melhor avaliado</p>
            <p className="font-semibold text-foreground">
              {favorites.length > 0 ? Math.max(...favorites.map((movie) => movie.vote_average)).toFixed(1) : "0.0"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Primeiro favorito</p>
            <p className="font-semibold text-foreground">
              {favorites.length > 0
                ? new Date(Math.min(...favorites.map((movie) => new Date(movie.addedAt).getTime()))).toLocaleDateString(
                    "pt-BR",
                  )
                : "Nenhum"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
