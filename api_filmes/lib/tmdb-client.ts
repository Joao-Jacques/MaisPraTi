const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

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

class TMDBClientService {
  private async fetchFromAPI(endpoint: string): Promise<any> {
    const response = await fetch(`/api/tmdb${endpoint}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || `Erro na API: ${response.status}`)
    }

    return response.json()
  }

  async searchMovies(query: string, page = 1): Promise<SearchResponse> {
    return this.fetchFromAPI(`/search?query=${encodeURIComponent(query)}&page=${page}`)
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.fetchFromAPI(`/movie/${movieId}`)
  }

  async getMovieCredits(movieId: number): Promise<Credits> {
    return this.fetchFromAPI(`/movie/${movieId}/credits`)
  }

  async getPopularMovies(page = 1): Promise<SearchResponse> {
    return this.fetchFromAPI(`/popular?page=${page}`)
  }

  async getTrendingMovies(page = 1): Promise<SearchResponse> {
    return this.fetchFromAPI(`/trending?page=${page}`)
  }
}

export const tmdbService = new TMDBClientService()

export function getImageUrl(path: string | null, size = "w500"): string {
  if (!path) return "/abstract-movie-poster.png"
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export function getBackdropUrl(path: string | null, size = "w1280"): string {
  if (!path) return "/movie-backdrop.png"
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}
