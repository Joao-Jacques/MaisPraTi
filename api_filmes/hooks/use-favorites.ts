"use client"

import { useState, useEffect } from "react"
import { favoritesService, type FavoriteMovie } from "@/lib/favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = favoritesService.getFavorites()
        setFavorites(storedFavorites)
      } catch (error) {
        console.error("Error loading favorites:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [])

  const addToFavorites = (movie: Omit<FavoriteMovie, "addedAt">) => {
    try {
      favoritesService.addToFavorites(movie)
      const updatedFavorites = favoritesService.getFavorites()
      setFavorites(updatedFavorites)
      return { success: true, message: `${movie.title} foi adicionado aos favoritos!` }
    } catch (error) {
      console.error("Error adding to favorites:", error)
      return { success: false, message: "Erro ao adicionar aos favoritos" }
    }
  }

  const removeFromFavorites = (movieId: number) => {
    try {
      const movieToRemove = favorites.find((fav) => fav.id === movieId)
      favoritesService.removeFromFavorites(movieId)
      const updatedFavorites = favoritesService.getFavorites()
      setFavorites(updatedFavorites)
      return {
        success: true,
        message: movieToRemove ? `${movieToRemove.title} foi removido dos favoritos!` : "Filme removido dos favoritos!",
      }
    } catch (error) {
      console.error("Error removing from favorites:", error)
      return { success: false, message: "Erro ao remover dos favoritos" }
    }
  }

  const isFavorite = (movieId: number): boolean => {
    return favorites.some((fav) => fav.id === movieId)
  }

  const toggleFavorite = (movie: Omit<FavoriteMovie, "addedAt">) => {
    if (isFavorite(movie.id)) {
      return removeFromFavorites(movie.id)
    } else {
      return addToFavorites(movie)
    }
  }

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    favoritesCount: favorites.length,
  }
}
