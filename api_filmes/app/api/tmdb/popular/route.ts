import { type NextRequest, NextResponse } from "next/server"
import { tmdbServerService } from "@/lib/tmdb-server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")

    const results = await tmdbServerService.getPopularMovies(page)
    return NextResponse.json(results)
  } catch (error) {
    console.error("Get popular movies error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 },
    )
  }
}
