const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

// You'll need to get your API key from https://www.themoviedb.org/settings/api
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "your-api-key-here"

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[]
  runtime: number
  budget: number
  revenue: number
  status: string
  tagline: string
  homepage: string
  imdb_id: string
  production_companies: { id: number; name: string; logo_path: string | null }[]
  production_countries: { iso_3166_1: string; name: string }[]
  spoken_languages: { iso_639_1: string; name: string }[]
}

export interface SearchResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface Credits {
  cast: {
    id: number
    name: string
    character: string
    profile_path: string | null
    order: number
  }[]
  crew: {
    id: number
    name: string
    job: string
    department: string
    profile_path: string | null
  }[]
}

class TMDBService {
  private async fetchFromTMDB(endpoint: string, retries = 3): Promise<any> {
    const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${TMDB_API_KEY}`

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // Add timeout
          signal: AbortSignal.timeout(10000), // 10 second timeout
        })

        if (!response.ok) {
          // Handle specific HTTP errors
          switch (response.status) {
            case 401:
              throw new Error("Chave da API inválida. Verifique sua configuração.")
            case 404:
              throw new Error("Recurso não encontrado.")
            case 429:
              throw new Error("Muitas requisições. Tente novamente em alguns segundos.")
            case 500:
            case 502:
            case 503:
            case 504:
              if (attempt < retries) {
                // Wait before retry for server errors
                await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
                continue
              }
              throw new Error("Erro no servidor. Tente novamente mais tarde.")
            default:
              throw new Error(`Erro na API: ${response.status} ${response.statusText}`)
          }
        }

        const data = await response.json()
        return data
      } catch (error) {
        if (error instanceof Error) {
          // Handle network errors
          if (error.name === "AbortError" || error.name === "TimeoutError") {
            if (attempt < retries) {
              await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
              continue
            }
            throw new Error("Conexão muito lenta. Verifique sua internet e tente novamente.")
          }

          if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
            if (attempt < retries) {
              await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
              continue
            }
            throw new Error("Erro de conexão. Verifique sua internet e tente novamente.")
          }
        }

        // If it's our custom error, don't retry
        if (attempt === retries || (error instanceof Error && error.message.includes("Chave da API"))) {
          throw error
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
      }
    }

    throw new Error("Falha após múltiplas tentativas. Tente novamente mais tarde.")
  }

  async searchMovies(query: string, page = 1): Promise<SearchResponse> {
    return this.fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=${page}&language=pt-BR`)
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.fetchFromTMDB(`/movie/${movieId}?language=pt-BR`)
  }

  async getMovieCredits(movieId: number): Promise<Credits> {
    return this.fetchFromTMDB(`/movie/${movieId}/credits?language=pt-BR`)
  }

  async getPopularMovies(page = 1): Promise<SearchResponse> {
    return this.fetchFromTMDB(`/movie/popular?page=${page}&language=pt-BR`)
  }

  async getTrendingMovies(page = 1): Promise<SearchResponse> {
    return this.fetchFromTMDB(`/trending/movie/week?page=${page}&language=pt-BR`)
  }

  getImageUrl(path: string | null, size = "w500"): string {
    if (!path) return "/abstract-movie-poster.png"
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  }

  getBackdropUrl(path: string | null, size = "w1280"): string {
    if (!path) return "/movie-backdrop.png"
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.fetchFromTMDB("/configuration")
      return true
    } catch (error) {
      return false
    }
  }

  async getApiStatus(): Promise<{ online: boolean; message: string }> {
    try {
      await this.fetchFromTMDB("/configuration")
      return { online: true, message: "API funcionando normalmente" }
    } catch (error) {
      return {
        online: false,
        message: error instanceof Error ? error.message : "Erro desconhecido na API",
      }
    }
  }
}

export const tmdbService = new TMDBService()
