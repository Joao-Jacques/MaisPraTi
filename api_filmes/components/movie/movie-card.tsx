"use client"

import type React from "react"

import { useState } from "react"
import { Star, Heart, Calendar, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getImageUrl, type Movie } from "@/lib/tmdb-client"
import { useFavorites } from "@/hooks/use-favorites"
import { cn } from "@/lib/utils"

interface MovieCardProps {
  movie: Movie
  onSelect?: (movie: Movie) => void
  showFavoriteButton?: boolean
}

export function MovieCard({ movie, onSelect, showFavoriteButton = true }: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    })
  }

  const handleCardClick = () => {
    onSelect?.(movie)
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-border/50 hover:border-primary/20"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg bg-muted">
          {!imageError ? (
            <img
              src={getImageUrl(movie.poster_path) || "/placeholder.svg"}
              alt={movie.title}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0",
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <div className="text-center text-muted-foreground">
                <div className="text-4xl mb-2">🎬</div>
                <p className="text-sm">Poster não disponível</p>
              </div>
            </div>
          )}

          {/* Favorite Button */}
          {showFavoriteButton && (
            <Button
              size="sm"
              variant="secondary"
              className={cn(
                "absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                isFavorite(movie.id) && "opacity-100",
              )}
              onClick={handleFavoriteClick}
            >
              <Heart
                className={cn("h-4 w-4", isFavorite(movie.id) ? "fill-red-500 text-red-500" : "text-muted-foreground")}
              />
            </Button>
          )}

          {/* Rating Badge */}
          {movie.vote_average > 0 && (
            <Badge
              variant="secondary"
              className="absolute bottom-2 left-2 flex items-center gap-1 bg-background/90 text-foreground"
            >
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{rating}</span>
            </Badge>
          )}
        </div>

        {/* Movie Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{releaseYear}</span>
            </div>

            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                handleCardClick()
              }}
            >
              <Info className="h-3 w-3 mr-1" />
              Detalhes
            </Button>
          </div>

          {/* Overview Preview */}
          {movie.overview && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{movie.overview}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
