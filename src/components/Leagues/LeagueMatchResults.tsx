"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { LeagueMatch } from "@/types/league"
import { LeagueMatchModal } from "./LeagueMatchModal"
import { updateMatchResult } from "@/services/leagueService"
import { toast } from "@/components/ui/use-toast"

interface LeagueMatchResultsProps {
  matches: LeagueMatch[]
  onSaveResults: (results: LeagueMatch[]) => void
}

export function LeagueMatchResults({ matches, onSaveResults }: LeagueMatchResultsProps) {
  const [selectedMatch, setSelectedMatch] = useState<LeagueMatch | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleMatchClick = (match: LeagueMatch) => {
    setSelectedMatch(match)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedMatch(null)
  }

  const handleSaveResult = async (matchId: string, result: any) => {
    try {
      setIsLoading(true)
      
      // Convertir el resultado del modal al formato que espera el backend
      const backendResult = {
        home_sets: result.score.set1.team1 + (result.score.set2.team1 === result.score.set1.team1 ? 1 : 0),
        away_sets: result.score.set1.team2 + (result.score.set2.team2 === result.score.set1.team2 ? 1 : 0)
      }

      // Llamar al backend
      await updateMatchResult(matchId, backendResult)

      // Actualizar la UI
      const updatedMatches = matches.map((match) =>
        match.id === matchId
          ? {
              ...match,
              score: result.score,
              status: "COMPLETED" as const,
              winner_league_team_id: result.winner_id,
              team1_sets_won: backendResult.home_sets,
              team2_sets_won: backendResult.away_sets
            }
          : match,
      )
      
      onSaveResults(updatedMatches)
      toast({
        title: "Éxito",
        description: "El resultado se ha guardado correctamente",
      })
      handleModalClose()
    } catch (error) {
      console.error("Error al guardar el resultado:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el resultado. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getMatchStatusText = (match: LeagueMatch) => {
    switch (match.status) {
      case "COMPLETED":
        return "Ver Resultado"
      case "WALKOVER":
        return "W.O."
      case "SCHEDULED":
      default:
        return "Ingresar Resultado"
    }
  }

  const isMatchEditable = (match: LeagueMatch) => {
    return match.status === "SCHEDULED"
  }

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Partidos y Resultados</h3>

      {matches.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">No hay partidos programados para esta fecha</p>
          <p className="text-sm text-gray-500">Los partidos aparecerán aquí cuando estén programados</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-purple-200 transition-all duration-200 ${
                match.status === "COMPLETED" ? "bg-gradient-to-r from-white to-green-50" : 
                match.status === "WALKOVER" ? "bg-gradient-to-r from-white to-red-50" : ""
              }`}
            >
              <div className="grid grid-cols-7 gap-4 items-center">
                <div className="col-span-3 text-right md:text-left">
                  <p className="font-medium text-gray-800">{match.team1}</p>
                  {match.status === "COMPLETED" && (
                    <p className="text-sm text-gray-500 mt-1">{match.team1_sets_won} sets</p>
                  )}
                  {match.status === "WALKOVER" && match.walkover_team_id === match.league_team1_id && (
                    <p className="text-sm text-red-500 mt-1">W.O.</p>
                  )}
                </div>

                <div className="col-span-1 flex justify-center">
                  {match.status === "COMPLETED" || match.status === "WALKOVER" ? (
                    <div className="flex items-center justify-center bg-gray-100 rounded-lg px-3 py-2 w-full">
                      <span className="font-bold text-lg text-gray-800">VS</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMatchClick(match)}
                      disabled={isLoading || !isMatchEditable(match)}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-none shadow-sm hover:shadow w-full"
                    >
                      {isLoading ? "Guardando..." : getMatchStatusText(match)}
                    </Button>
                  )}
                </div>

                <div className="col-span-3 text-left md:text-right">
                  <p className="font-medium text-gray-800">{match.team2}</p>
                  {match.status === "COMPLETED" && (
                    <p className="text-sm text-gray-500 mt-1">{match.team2_sets_won} sets</p>
                  )}
                  {match.status === "WALKOVER" && match.walkover_team_id === match.league_team2_id && (
                    <p className="text-sm text-red-500 mt-1">W.O.</p>
                  )}
                </div>
              </div>

              {(match.status === "COMPLETED" || match.status === "WALKOVER") && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${match.winner_league_team_id === match.league_team1_id ? "bg-green-500" : "bg-gray-300"} mr-2`}
                    ></div>
                    <span
                      className={`text-sm ${match.winner_league_team_id === match.league_team1_id ? "font-medium text-green-700" : "text-gray-500"}`}
                    >
                      {match.team1}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMatchClick(match)}
                    disabled={isLoading}
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    Ver detalles
                  </Button>

                  <div className="flex items-center">
                    <span
                      className={`text-sm ${match.winner_league_team_id === match.league_team2_id ? "font-medium text-green-700" : "text-gray-500"}`}
                    >
                      {match.team2}
                    </span>
                    <div
                      className={`w-3 h-3 rounded-full ${match.winner_league_team_id === match.league_team2_id ? "bg-green-500" : "bg-gray-300"} ml-2`}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedMatch && (
        <LeagueMatchModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          match={selectedMatch}
          onSubmit={handleSaveResult}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
