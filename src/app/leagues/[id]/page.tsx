"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type { League, LeagueMatch } from "@/types/league"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { LeagueHeader } from "@/components/Leagues/LeagueHeader"
import { LeagueStandings } from "@/components/Leagues/LeagueStandings"
import { LeagueRounds } from "@/components/Leagues/LeagueRounds"
import { LeagueMatchResults } from "@/components/Leagues/LeagueMatchResults"
// import { mockLeagues, mockMatches } from '@/mocks/leagueData'; // Remove mock data imports
import { useCategories } from "@/hooks/useCategories"
import { getCategoryName } from "@/utils/category"
import { toast } from "@/components/ui/use-toast"

export default function LeagueDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const leagueId = params.id as string

  const [league, setLeague] = useState<League | null>(null)
  const [isLoadingLeague, setIsLoadingLeague] = useState(true)
  const [selectedRound, setSelectedRound] = useState(1) // Assuming this is for match rounds, might need real data too

  const { categories, isLoading: isLoadingCategories, fetchCategories } = useCategories()

  useEffect(() => {
    // fetchCategories is already called within useCategories hook, no need to call it here if not conditional
  }, []) // Empty dependency array, categories will be fetched by the hook.

  useEffect(() => {
    if (leagueId) {
      const fetchLeagueDetails = async () => {
        setIsLoadingLeague(true)
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leagues/${leagueId}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch league details. Status: ${response.status}`)
          }
          const data: League = await response.json()
          setLeague(data)
        } catch (error) {
          console.error("Error fetching league details:", error)
          toast({
            title: "Error",
            description: "No se pudieron cargar los detalles de la liga.",
            variant: "destructive",
          })
          setLeague(null) // Set to null on error
        } finally {
          setIsLoadingLeague(false)
        }
      }
      fetchLeagueDetails()
    }
  }, [leagueId])

  // TODO: Fetch real matches based on leagueId and selectedRound instead of mockMatches
  const [matches, setMatches] = useState<LeagueMatch[]>([]) // Placeholder for real matches
  useEffect(() => {
    // Example: Fetch matches when leagueId or selectedRound changes
    // const fetchMatchesForRound = async () => {
    //   if(leagueId && selectedRound) {
    //     // const response = await fetch(`/api/leagues/${leagueId}/round/${selectedRound}/matches`);
    //     // const data = await response.json();
    //     // setMatches(data);
    //     setMatches(mockMatches.filter(m => m.round === selectedRound)); // Replace with actual fetch
    //   }
    // };
    // fetchMatchesForRound();
    // For now, continue using filtered mock matches if you have them, or implement fetching
  }, [leagueId, selectedRound])

  const handleSaveResults = (results: LeagueMatch[]) => {
    // TODO: Integrar con backend
    console.log("Saving results:", results)
  }

  if (isLoadingLeague || isLoadingCategories) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 text-center">Cargando información de la liga...</p>
        </div>
      </div>
    )
  }

  if (!league) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mx-auto mb-4"
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
          <p className="text-xl text-gray-700 mb-6">No se pudo cargar la información de la liga.</p>
          <button
            onClick={() => router.push("/leagues")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg w-full"
          >
            Volver a Ligas
          </button>
        </div>
      </div>
    )
  }

  const categoryName = getCategoryName(league.category_id, categories)
  // Determine time slots string if needed, e.g., league.time_slots.join(', ') or format it nicely
  const timeSlotsDisplay =
    league.time_slots?.map((slot) => `${slot[0]}:00 - ${slot[1]}:00`).join(" / ") || "No especificado"

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <LeagueHeader league={league} categories={categories} onBack={() => router.push("/leagues")} />

      <main className="max-w-7xl mx-auto px-4 -mt-24 relative z-10 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Información General</h2>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="mb-4 md:mb-0 md:w-1/2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Categoría</h3>
                    <p className="mt-1 text-lg font-medium text-gray-800">{categoryName}</p>
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Frecuencia</h3>
                    <p className="mt-1 text-lg font-medium text-gray-800">{league.frequency || "No especificada"}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="mb-4 md:mb-0 md:w-1/2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                      Horarios Disponibles
                    </h3>
                    <p className="mt-1 text-lg font-medium text-gray-800">{timeSlotsDisplay}</p>
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                      Duración de Partido
                    </h3>
                    <p className="mt-1 text-lg font-medium text-gray-800">
                      {league.match_duration_minutes || "No especificada"} minutos
                    </p>
                  </div>
                </div>

                {league.description && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Descripción</h3>
                    <p className="mt-2 whitespace-pre-line text-gray-700 leading-relaxed">{league.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Detalles de la Liga</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tamaño de Equipo</h3>
                    <p className="mt-1 text-xl font-bold text-gray-800">{league.team_size || "No especificado"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Canchas</h3>
                    <p className="mt-1 text-xl font-bold text-gray-800">{league.courts_available}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-600">Costo de Inscripción</h3>
                  <p className="mt-1 text-2xl font-bold text-blue-700">${league.inscription_cost}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Sistema de Puntos
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-green-800">Victoria</span>
                      <span className="text-lg font-bold text-green-700">{league.points_for_win} pts</span>
                    </div>
                    <div className="flex justify-between items-center bg-yellow-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-yellow-800">Derrota con set</span>
                      <span className="text-lg font-bold text-yellow-700">{league.points_for_loss_with_set} pts</span>
                    </div>
                    <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-red-800">Derrota</span>
                      <span className="text-lg font-bold text-red-700">{league.points_for_loss} pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg border border-gray-100">
            <LeagueStandings leagueId={leagueId} />
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Gestión de Resultados</h2>
            <LeagueRounds
              leagueId={leagueId}
              totalRounds={7} // TODO: Get total rounds from league data or calculate
              onSelectRound={setSelectedRound}
            />
            <div className="mt-8">
              <LeagueMatchResults
                matches={matches} // Use state for matches, eventually fetched data
                onSaveResults={handleSaveResults}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
