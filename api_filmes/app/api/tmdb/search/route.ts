import { type NextRequest, NextResponse } from "next/server"
import { tmdbServerService } from "@/lib/tmdb-server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const page = Number.parseInt(searchParams.get("page") || "1")

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    const results = await tmdbServerService.searchMovies(query, page)
    return NextResponse.json(results)
  } catch (error) {
    console.error("Search movies error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 },
    )
  }
}
