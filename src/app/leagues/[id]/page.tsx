"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type { LeagueMatch } from "@/types/league"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { LeagueHeader } from "@/components/Leagues/LeagueHeader"
import { LeagueStandings } from "@/components/Leagues/LeagueStandings"
import { LeagueRounds } from "@/components/Leagues/LeagueRounds"
import { LeagueRoundMatches } from "@/components/Leagues/LeagueRoundMatches"
import { useCategories } from "@/hooks/useCategories"
import { useLeague } from "@/hooks/useLeague"
import { toast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function LeagueDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const leagueId = params.id as string
  const [selectedRound, setSelectedRound] = useState(1)
  const [matches, setMatches] = useState<LeagueMatch[]>([])
  const [isLoadingMatches, setIsLoadingMatches] = useState(false)

  const { league, isLoading: isLoadingLeague, error } = useLeague(leagueId)
  const { categories, isLoading: isLoadingCategories } = useCategories()

  // Cargar partidos cuando cambia la fecha seleccionada
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoadingMatches(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/leagues/matches/${leagueId}?round=${selectedRound}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
          }
        )
        if (!response.ok) {
          throw new Error('Error al cargar los partidos')
        }
        const data = await response.json()
        setMatches(data.matches)
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los partidos",
          variant: "destructive",
        })
      } finally {
        setIsLoadingMatches(false)
      }
    }

    if (leagueId && selectedRound) {
      fetchMatches()
    }
  }, [leagueId, selectedRound])

  const handleMatchUpdate = (updatedMatch: LeagueMatch) => {
    setMatches(currentMatches =>
      currentMatches.map(match =>
        match.id === updatedMatch.id ? updatedMatch : match
      )
    )
  }

  if (isLoadingLeague || isLoadingCategories) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Card className="w-[300px]">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <LoadingSpinner size="lg" showText />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !league) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-destructive"
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
              <p className="text-xl text-center">
                No se pudo cargar la información de la liga.
              </p>
              <button
                onClick={() => router.push("/leagues")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Volver a Ligas
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120]">
      <LeagueHeader
        league={league}
        categories={categories}
        onBack={() => router.push("/leagues")}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Tabla de Posiciones */}
          <Card className="w-full bg-white dark:bg-[#0E1629] border-gray-200 dark:border-[#1D283A] shadow-sm dark:shadow-lg">
            <CardContent className="p-6">
              <LeagueStandings leagueId={leagueId} />
            </CardContent>
          </Card>

          {/* Gestión de Resultados */}
          <Card className="w-full bg-white dark:bg-[#0E1629] border-gray-200 dark:border-[#1D283A] shadow-sm dark:shadow-lg">
            <CardHeader className="border-b border-gray-200 dark:border-[#1D283A]">
              <CardTitle className="text-gray-900 dark:text-white text-xl">Gestión de Resultados</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <LeagueRounds
                leagueId={leagueId}
                totalRounds={7}
                onSelectRound={setSelectedRound}
              />

              {isLoadingMatches ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner size="md" />
                </div>
              ) : (
                <div className="mt-8">
                  <LeagueRoundMatches
                    matches={matches}
                    roundNumber={selectedRound}
                    totalRounds={7}
                    onMatchUpdate={handleMatchUpdate}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
