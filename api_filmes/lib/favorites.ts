export interface FavoriteMovie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  addedAt: string
}

class FavoritesService {
  private readonly STORAGE_KEY = "tmdb-favorites"

  getFavorites(): FavoriteMovie[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading favorites:", error)
      return []
    }
  }

  addToFavorites(movie: Omit<FavoriteMovie, "addedAt">): void {
    if (typeof window === "undefined") return

    try {
      const favorites = this.getFavorites()
      const isAlreadyFavorite = favorites.some((fav) => fav.id === movie.id)

      if (!isAlreadyFavorite) {
        const newFavorite: FavoriteMovie = {
          ...movie,
          addedAt: new Date().toISOString(),
        }

        const updatedFavorites = [newFavorite, ...favorites]
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedFavorites))
      }
    } catch (error) {
      console.error("Error adding to favorites:", error)
    }
  }

  removeFromFavorites(movieId: number): void {
    if (typeof window === "undefined") return

    try {
      const favorites = this.getFavorites()
      const updatedFavorites = favorites.filter((fav) => fav.id !== movieId)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedFavorites))
    } catch (error) {
      console.error("Error removing from favorites:", error)
    }
  }

  isFavorite(movieId: number): boolean {
    const favorites = this.getFavorites()
    return favorites.some((fav) => fav.id === movieId)
  }

  clearFavorites(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.error("Error clearing favorites:", error)
    }
  }
}

export const favoritesService = new FavoritesService()
