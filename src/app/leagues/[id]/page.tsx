"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { LeagueMatch } from "@/types/league"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { LeagueHeader } from "@/components/Leagues/LeagueHeader"
import { LeagueStandings } from "@/components/Leagues/LeagueStandings"
import { LeagueRounds } from "@/components/Leagues/LeagueRounds"
import { LeagueMatchResults } from "@/components/Leagues/LeagueMatchResults"
// import { mockLeagues, mockMatches } from '@/mocks/leagueData'; // Remove mock data imports
import { useCategories } from "@/hooks/useCategories"
import { useLeague } from "@/hooks/useLeague"
import { toast } from "@/components/ui/use-toast"

export default function LeagueDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const leagueId = params.id as string
  const [selectedRound, setSelectedRound] = useState(1)

  const { league, isLoading: isLoadingLeague, error } = useLeague(leagueId)
  const { categories, isLoading: isLoadingCategories } = useCategories()

  // Handle matches state and actions
  const [matches, setMatches] = useState<LeagueMatch[]>([])

  const handleSaveResults = (results: LeagueMatch[]) => {
    console.log("Saving results:", results)
  }

  if (isLoadingLeague || isLoadingCategories) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/80">
        <div className="bg-card dark:bg-card p-8 rounded-xl shadow-md dark:shadow-lg">
          <LoadingSpinner />
          <p className="mt-4 text-muted-foreground dark:text-muted-foreground text-center">Cargando información de la liga...</p>
        </div>
      </div>
    )
  }

  if (error || !league) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background dark:bg-background px-4">
        <div className="bg-card dark:bg-card p-8 rounded-xl shadow-md dark:shadow-lg max-w-md w-full text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-destructive dark:text-destructive mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-xl text-foreground dark:text-foreground mb-6">No se pudo cargar la información de la liga.</p>
          <button
            onClick={() => router.push("/leagues")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg w-full"
          >
            Volver a Ligas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/80">
      <LeagueHeader
        league={league}
        categories={categories}
        onBack={() => router.push("/leagues")}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="bg-card dark:bg-card rounded-xl shadow-md dark:shadow-lg p-8 transition-all duration-300 hover:shadow-lg border border-border">
            <h2 className="text-2xl font-bold mb-6 text-foreground dark:text-foreground border-b border-border pb-3">Tabla de Posiciones</h2>
            <LeagueStandings leagueId={leagueId} />
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-card dark:bg-card rounded-xl shadow-md dark:shadow-lg p-8 transition-all duration-300 hover:shadow-lg border border-border">
            <h2 className="text-2xl font-bold mb-6 text-foreground dark:text-foreground border-b border-border pb-3">Gestión de Resultados</h2>
            <LeagueRounds
              leagueId={leagueId}
              totalRounds={7}
              onSelectRound={setSelectedRound}
            />
            <div className="mt-8">
              <LeagueMatchResults
                matches={matches}
                onSaveResults={handleSaveResults}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
