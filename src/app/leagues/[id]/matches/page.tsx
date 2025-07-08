"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useLeague } from "@/hooks/useLeague"
import { useCategories } from "@/hooks/useCategories"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowLeft, CalendarDays, Clock, Filter, ListFilter, ChevronLeft, ChevronRight, CheckCircle, XCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LeagueMatchModal } from "@/components/Leagues/LeagueMatchModal"
import { updateMatchResult, updateMatchSchedule } from "@/services/leagueService"
import { toast } from "@/components/ui/use-toast"
import { formatUruguayDateTime } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { LeagueMatch } from "@/types/league"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

function formatMatchDate(dateStr: string) {
  const { date, time } = formatUruguayDateTime(dateStr);
  return { date, time };
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
  const [selectedRound, setSelectedRound] = useState<string>("all")
  
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] flex justify-center items-center">
        <Card className="w-[300px] bg-white dark:bg-[#0E1629] border-gray-200 dark:border-gray-700/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cargando partidos de la liga...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] flex justify-center items-center p-4">
        <Card className="w-full max-w-md bg-white dark:bg-[#0E1629] border-gray-200 dark:border-gray-700/50">
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
              <p className="text-xl text-center text-gray-900 dark:text-white">{error}</p>
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

  if (isLoadingLeague || isLoadingCategories) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] flex justify-center items-center">
        <Card className="w-[300px] bg-white dark:bg-[#0E1629] border-gray-200 dark:border-gray-700/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cargando información de la liga...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (leagueError || !league) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] flex justify-center items-center p-4">
        <Card className="w-full max-w-md bg-white dark:bg-[#0E1629] border-gray-200 dark:border-gray-700/50">
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
              <p className="text-xl text-center text-gray-900 dark:text-white">
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
              <div className="flex flex-col gap-6">
                {/* Stats and Filters Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">{completed} Completados</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{scheduled} Programados</span>
                    </div>
                    {walkover > 0 && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-50/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-700 dark:text-red-300">{walkover} W.O.</span>
                      </div>
                    )}
                  </div>

                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[180px] bg-primary/10 hover:bg-primary/20 transition-colors border-primary/20">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <SelectValue placeholder="Filtrar por estado" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="COMPLETED">Completados</SelectItem>
                      <SelectItem value="SCHEDULED">Programados</SelectItem>
                      <SelectItem value="WALKOVER">W.O.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="all" className="w-full" value={selectedRound} onValueChange={setSelectedRound}>
                  <TabsList className="w-full h-auto p-1 bg-background/50 dark:bg-background/10 border-b border-border">
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-6 py-2 transition-colors"
                    >
                      Todas las fechas
                    </TabsTrigger>
                    {Array.from(new Set(matches.map(match => match.match_number))).sort((a, b) => a - b).map((round) => (
                      <TabsTrigger 
                        key={round} 
                        value={round.toString()}
                        className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-6 py-2 transition-colors"
                      >
                        Fecha {round}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="all" className="mt-6">
                    <div className="grid gap-4">
                      {currentMatches.map((match) => {
                        const { date, time } = formatMatchDate(match.match_date);
                        return (
                          <Card key={match.id} className="overflow-hidden bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                            <div className="p-6">
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getStatusBadge(match.status)}
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      {date}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      {time}
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
                        );
                      })}
                    </div>
                  </TabsContent>

                  {Array.from(new Set(matches.map(match => match.match_number))).sort((a, b) => a - b).map((round) => (
                    <TabsContent key={round} value={round.toString()} className="mt-6">
                      <div className="grid gap-4">
                        {matches
                          .filter(match => match.match_number === round && (statusFilter === 'all' || match.status === statusFilter))
                          .map((match) => {
                            const { date, time } = formatMatchDate(match.match_date);
                            return (
                              <Card key={match.id} className="overflow-hidden bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                                <div className="p-6">
                                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        {getStatusBadge(match.status)}
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                          {date}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                          {time}
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
                            );
                          })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
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