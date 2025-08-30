"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Star, Heart, Calendar, Clock, Globe, Users, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import {
  tmdbService,
  getImageUrl,
  getBackdropUrl,
  type Movie,
  type MovieDetails as MovieDetailsType,
  type Credits,
} from "@/lib/tmdb-client"
import { useFavorites } from "@/hooks/use-favorites"
import { cn } from "@/lib/utils"

interface MovieDetailsProps {
  movie: Movie
  onBack?: () => void
}

export function MovieDetails({ movie, onBack }: MovieDetailsProps) {
  const [details, setDetails] = useState<MovieDetailsType | null>(null)
  const [credits, setCredits] = useState<Credits | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [backdropLoaded, setBackdropLoaded] = useState(false)
  const [posterLoaded, setPosterLoaded] = useState(false)

  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    loadMovieDetails()
  }, [movie.id])

  const loadMovieDetails = async () => {
    setLoading(true)
    setError(null)

    try {
      const [movieDetails, movieCredits] = await Promise.all([
        tmdbService.getMovieDetails(movie.id),
        tmdbService.getMovieCredits(movie.id),
      ])

      setDetails(movieDetails)
      setCredits(movieCredits)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar detalhes do filme")
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = () => {
    toggleFavorite({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    })
  }

  const handleRetry = () => {
    loadMovieDetails()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-muted-foreground">Carregando detalhes do filme...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        )}
        <div className="flex flex-col items-center justify-center py-12">
          <ErrorMessage message={error} onRetry={handleRetry} />
        </div>
      </div>
    )
  }

  if (!details) return null

  const releaseYear = details.release_date ? new Date(details.release_date).getFullYear() : "N/A"
  const rating = details.vote_average ? details.vote_average.toFixed(1) : "N/A"
  const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}min` : "N/A"

  // Get director from crew
  const director = credits?.crew.find((person) => person.job === "Director")

  // Get main cast (first 10)
  const mainCast = credits?.cast.slice(0, 10) || []

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      )}

      {/* Hero Section with Backdrop */}
      <div className="relative rounded-lg overflow-hidden bg-muted">
        {/* Backdrop Image */}
        <div className="relative aspect-video md:aspect-[21/9]">
          <img
            src={getBackdropUrl(details.backdrop_path) || "/placeholder.svg"}
            alt={details.title}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-500",
              backdropLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setBackdropLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="relative w-32 md:w-48 aspect-[2/3] rounded-lg overflow-hidden bg-muted shadow-lg">
                <img
                  src={getImageUrl(details.poster_path) || "/placeholder.svg"}
                  alt={details.title}
                  className={cn(
                    "h-full w-full object-cover transition-opacity duration-300",
                    posterLoaded ? "opacity-100" : "opacity-0",
                  )}
                  onLoad={() => setPosterLoaded(true)}
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{details.title}</h1>
                {details.tagline && <p className="text-lg text-muted-foreground italic">{details.tagline}</p>}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{releaseYear}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{runtime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{rating}</span>
                  <span className="text-muted-foreground">({details.vote_count} votos)</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {details.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button onClick={handleFavoriteToggle} variant={isFavorite(movie.id) ? "default" : "outline"}>
                  <Heart className={cn("h-4 w-4 mr-2", isFavorite(movie.id) && "fill-current text-red-500")} />
                  {isFavorite(movie.id) ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Synopsis */}
          {details.overview && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Sinopse</h2>
                <p className="text-muted-foreground leading-relaxed">{details.overview}</p>
              </CardContent>
            </Card>
          )}

          {/* Cast */}
          {mainCast.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Elenco Principal
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mainCast.map((actor) => (
                    <div key={actor.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {actor.profile_path ? (
                          <img
                            src={getImageUrl(actor.profile_path, "w185") || "/placeholder.svg"}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{actor.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Movie Details */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Detalhes</h2>

              {director && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Direção</h3>
                  <p className="text-sm">{director.name}</p>
                </div>
              )}

              <Separator />

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Data de Lançamento</h3>
                <p className="text-sm">
                  {details.release_date ? new Date(details.release_date).toLocaleDateString("pt-BR") : "Não informado"}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Duração</h3>
                <p className="text-sm">{runtime}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Idioma Original</h3>
                <p className="text-sm flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {details.original_language.toUpperCase()}
                </p>
              </div>

              {details.budget > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Orçamento</h3>
                    <p className="text-sm">${details.budget.toLocaleString("en-US")}</p>
                  </div>
                </>
              )}

              {details.revenue > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Bilheteria</h3>
                    <p className="text-sm">${details.revenue.toLocaleString("en-US")}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Production Companies */}
          {details.production_companies.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Produção</h2>
                <div className="space-y-3">
                  {details.production_companies.slice(0, 5).map((company) => (
                    <div key={company.id} className="flex items-center gap-3">
                      {company.logo_path ? (
                        <div className="w-8 h-8 bg-white rounded p-1 flex items-center justify-center">
                          <img
                            src={getImageUrl(company.logo_path, "w185") || "/placeholder.svg"}
                            alt={company.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-sm">{company.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
