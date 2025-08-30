import { type NextRequest, NextResponse } from "next/server"
import { tmdbServerService } from "@/lib/tmdb-server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const movieId = Number.parseInt(params.id)

    if (isNaN(movieId)) {
      return NextResponse.json({ error: "ID do filme inválido" }, { status: 400 })
    }

    const credits = await tmdbServerService.getMovieCredits(movieId)
    return NextResponse.json(credits)
  } catch (error) {
    console.error("Get movie credits error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 },
    )
  }
}
