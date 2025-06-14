"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useLeague } from "@/hooks/useLeague"
import { useCategories } from "@/hooks/useCategories"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowLeft, CalendarDays, Clock, Filter, ListFilter, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LeagueMatchModal } from "@/components/Leagues/LeagueMatchModal"
import { updateMatchResult, updateMatchSchedule } from "@/services/leagueService"
import { toast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { LeagueMatch } from "@/types/league"

interface Match {
  id: string;
  category_id: string;
  category_name: string;
  team1: string;
  team2: string;
  match_date: string;
  court: string;
  status: "SCHEDULED" | "COMPLETED" | "WALKOVER";
  team1_sets1_won: number;
  team1_sets2_won: number;
  team2_sets1_won: number;
  team2_sets2_won: number;
}

interface MatchResult {
  team1_sets1_won: number;
  team1_sets2_won: number;
  team2_sets1_won: number;
  team2_sets2_won: number;
}

export default function LeagueMatchesPage() {
  const params = useParams()
  const router = useRouter()
  const leagueId = params.id as string
  const [matches, setMatches] = useState<LeagueMatch[]>([])
  const [filteredMatches, setFilteredMatches] = useState<LeagueMatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<LeagueMatch | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const matchesPerPage = 5

  const { league, isLoading: isLoadingLeague, error: leagueError } = useLeague(leagueId)
  const { categories, isLoading: isLoadingCategories } = useCategories()

  const fetchMatches = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const url = `${baseUrl}/leagues/matches/league/${leagueId}`
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al cargar los partidos')
      }

      const data = await response.json()
      const allMatches = [...data.completed, ...data.pending].sort((a, b) => 
        new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
      )
      setMatches(allMatches)
      setFilteredMatches(allMatches)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [leagueId])

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredMatches(matches)
    } else {
      setFilteredMatches(matches.filter(match => match.status === statusFilter))
    }
  }, [statusFilter, matches])

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
      setIsUpdating(true)
      await updateMatchResult(matchId, result)
      
      // Actualizar el estado local
      const updatedMatches = matches.map(match =>
        match.id === matchId
          ? {
              ...match,
              ...result,
              status: 'COMPLETED',
            }
          : match
      )
      
      setMatches(updatedMatches)
      toast({
        title: 'Éxito',
        description: 'Resultado guardado correctamente',
      })
      handleModalClose()
      await fetchMatches() // Recargar los partidos para obtener los datos actualizados
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'No se pudo guardar el resultado',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleScheduleUpdate = async (matchId: string, schedule: any) => {
    try {
      setIsUpdating(true)
      await updateMatchSchedule(matchId, schedule)
      
      // Actualizar el estado local
      const updatedMatches = matches.map(match =>
        match.id === matchId
          ? {
              ...match,
              match_date: `${schedule.date}T${schedule.time}`,
            }
          : match
      )
      
      setMatches(updatedMatches)
      toast({
        title: 'Éxito',
        description: 'Horario actualizado correctamente',
      })
      handleModalClose()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el horario',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Completado</Badge>
      case 'WALKOVER':
        return <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">W.O.</Badge>
      case 'SCHEDULED':
        return <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">Programado</Badge>
      default:
        return null
    }
  }

  const getMatchesSummary = () => {
    const completed = matches.filter(match => match.status === 'COMPLETED').length
    const scheduled = matches.filter(match => match.status === 'SCHEDULED').length
    const walkover = matches.filter(match => match.status === 'WALKOVER').length
    return { completed, scheduled, walkover }
  }

  // Pagination handlers
  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage)
  const startIndex = (currentPage - 1) * matchesPerPage
  const endIndex = startIndex + matchesPerPage
  const currentMatches = filteredMatches.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoadingLeague || isLoadingCategories) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" showText />
      </div>
    )
  }

  if (leagueError || !league) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-6">
              <p className="text-xl text-center text-red-500">
                No se pudo cargar la información de la liga
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

  const { completed, scheduled, walkover } = getMatchesSummary()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-6">
      <div className="container mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push(`/leagues/${params.id}`)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la liga
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white">Partidos de {league.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    {completed} Completados
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                    {scheduled} Programados
                  </Badge>
                  {walkover > 0 && (
                    <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                      {walkover} W.O.
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                  <ListFilter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectItem value="all">Todos los partidos</SelectItem>
                      <SelectItem value="COMPLETED">Completados</SelectItem>
                      <SelectItem value="SCHEDULED">Programados</SelectItem>
                      <SelectItem value="WALKOVER">W.O.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner size="lg" showText />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 dark:text-red-400">{error}</p>
                </div>
              ) : filteredMatches.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No hay partidos que mostrar</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4">
                    {currentMatches.map((match) => (
                      <Card key={match.id} className="overflow-hidden bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusBadge(match.status)}
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(match.match_date).toLocaleDateString()}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(match.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <div className="text-right md:text-left">
                                  <p className="font-medium text-gray-900 dark:text-white">{match.team1}</p>
                                  {match.status === 'COMPLETED' && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {match.team1_sets1_won + match.team1_sets2_won} sets
                                    </p>
                                  )}
                                </div>
                                <div className="flex justify-center">
                                  <Button
                                    variant={match.status === 'COMPLETED' ? 'outline' : 'default'}
                                    onClick={() => handleMatchClick(match)}
                                    disabled={isUpdating}
                                    className={match.status === 'COMPLETED' 
                                      ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white border-0' 
                                      : 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800'}
                                  >
                                    {match.status === 'COMPLETED' ? 'Ver resultado' : 'Gestionar partido'}
                                  </Button>
                                </div>
                                <div className="text-left md:text-right">
                                  <p className="font-medium text-gray-900 dark:text-white">{match.team2}</p>
                                  {match.status === 'COMPLETED' && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {match.team2_sets1_won + match.team2_sets2_won} sets
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 p-0 ${
                            currentPage === page
                              ? "bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white"
                              : ""
                          }`}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedMatch && (
          <LeagueMatchModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            match={selectedMatch}
            onSubmit={handleSaveResult}
            onScheduleUpdate={handleScheduleUpdate}
            isLoading={isUpdating}
          />
        )}
      </div>
    </div>
  )
} 