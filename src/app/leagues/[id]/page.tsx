"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type { LeagueMatch } from "@/types/league"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { LeagueHeader } from "@/components/Leagues/LeagueHeader"
import { LeagueStandings } from "@/components/Leagues/LeagueStandings"
import { LeagueScheduleCard } from "@/components/Dashboard/LeagueScheduleCard"
import { useCategories } from "@/hooks/useCategories"
import { useLeague } from "@/hooks/useLeague"
import { useStandings } from "@/hooks/useStandings"
import { toast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { CategoryStandings } from "@/components/Dashboard/CategoryStandings"

export default function LeagueDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const leagueId = params.id as string

  const { league, isLoading: isLoadingLeague, error: leagueError } = useLeague(leagueId)
  const { categories, isLoading: isLoadingCategories } = useCategories()
  const { standings, isLoading: isLoadingStandings, error: standingsError } = useStandings(
    league?.category_id // Usar el category_id de la liga
  )

  if (isLoadingLeague || isLoadingCategories || isLoadingStandings) {
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

  if (leagueError || !league) {
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

  const category = categories?.find(cat => cat.id === league.category_id)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120]">
      {/* Header */}
      <div className="bg-white dark:bg-[#0E1629] border-b border-gray-200 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => router.push("/leagues")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a ligas</span>
          </button>
          
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {league.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                {category?.name || 'Categoría no disponible'}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-400">
                {league.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Tabla de Posiciones */}
          <Card className="w-full bg-white dark:bg-[#0E1629] border-gray-200 dark:border-gray-700/50 shadow-sm">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700/50">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Tabla de Posiciones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <CategoryStandings
                category={category?.name || ''}
                standings={standings}
                isLoading={isLoadingStandings}
              />
            </CardContent>
          </Card>

          {/* Próximos Partidos */}
          <LeagueScheduleCard leagueId={leagueId} />
        </div>
      </main>
    </div>
  )
}
