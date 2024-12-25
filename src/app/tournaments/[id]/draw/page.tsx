'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TournamentBracket } from '@/components/TournamentBracket'
import { RoundRobinStandings } from '@/components/RoundRobinStandings'
import { Team } from '@/types/tournament'
import { GroupStageView } from '@/components/GroupStageView'

interface Tournament {
  id: string
  name: string
  teams: Team[]
  format: 'single_elimination' | 'round_robin' | 'group_stage'
}

interface Match {
  id: string
  round: number
  position: number
  team1?: Team
  team2?: Team
  winner?: Team
  points_team1: number
  points_team2: number
}

const RoundRobinMatch = ({ match, onUpdateMatch }: { match: Match, onUpdateMatch: (matchId: string, winnerId: string) => void }) => (
  <Card className="p-4">
    <div className="space-y-4">
      <div className={`text-sm ${match.winner?.id === match.team1?.id ? 'font-bold text-green-600' : ''}`}>
        {match.team1?.player1.name} / {match.team1?.player2.name}
      </div>
      <div className="text-xs text-gray-500 flex items-center justify-center">
        vs
      </div>
      <div className={`text-sm ${match.winner?.id === match.team2?.id ? 'font-bold text-green-600' : ''}`}>
        {match.team2?.player1.name} / {match.team2?.player2.name}
      </div>
      {!match.winner && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => match.team1 && onUpdateMatch(match.id, match.team1.id)}
            className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Equipo 1 Gana
          </button>
          <button
            onClick={() => match.team2 && onUpdateMatch(match.id, match.team2.id)}
            className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Equipo 2 Gana
          </button>
        </div>
      )}
    </div>
  </Card>
)

export default function TournamentDrawPage() {
  const params = useParams()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  const generateDraw = async () => {
    try {
      const response = await fetch(`/api/tournaments/${params.id}/draw/generate`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate draw')
      }
      
      const data = await response.json()
      setMatches(data.matches)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const [tournamentRes, drawRes] = await Promise.all([
          fetch(`/api/tournaments/${params.id}`),
          fetch(`/api/tournaments/${params.id}/draw`)
        ])

        if (!tournamentRes.ok) throw new Error('Failed to fetch tournament')
        
        const tournamentData = await tournamentRes.json()
        setTournament(tournamentData)
        
        if (drawRes.ok) {
          const drawData = await drawRes.json()
          setMatches(drawData.matches)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTournament()
  }, [params.id])

  const updateMatch = async (matchId: string, winnerId: string) => {
    try {
      const response = await fetch(`/api/tournaments/${params.id}/draw/matches/${matchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ winnerId })
      })
      
      if (!response.ok) throw new Error('Failed to update match')
      
      // Refresh the matches
      const drawResponse = await fetch(`/api/tournaments/${params.id}/draw`)
      const data = await drawResponse.json()
      setMatches(data.matches)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container py-8">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">
            {tournament?.format === 'group_stage' 
              ? 'Fase de Grupos' 
              : tournament?.format === 'round_robin' 
                ? 'Liga' 
                : 'Cuadro'} del Torneo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                No se ha generado el {
                  tournament?.format === 'group_stage' 
                    ? 'calendario de grupos' 
                    : tournament?.format === 'round_robin' 
                      ? 'calendario' 
                      : 'cuadro'
                } del torneo aún
              </p>
              <button
                onClick={generateDraw}
                className="bg-[#6B8AFF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5A75E6] transition-colors duration-300"
              >
                Generar {
                  tournament?.format === 'group_stage' 
                    ? 'Grupos' 
                    : tournament?.format === 'round_robin' 
                      ? 'Calendario' 
                      : 'Cuadro'
                }
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {tournament?.format === 'group_stage' ? (
                <GroupStageView 
                  matches={matches}
                  teams={tournament.teams}
                  onUpdateMatch={updateMatch}
                />
              ) : tournament?.format === 'round_robin' ? (
                <div className="space-y-8">
                  {Array.from(new Set(matches.map(m => m.round))).map(round => (
                    <div key={round} className="space-y-4">
                      <h3 className="text-xl font-semibold border-b pb-2">Ronda {round}</h3>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {matches
                          .filter(m => m.round === round)
                          .map(match => (
                            <RoundRobinMatch 
                              key={match.id} 
                              match={match}
                              onUpdateMatch={updateMatch}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                  <RoundRobinStandings 
                    matches={matches}
                    teams={tournament.teams}
                  />
                </div>
              ) : (
                <TournamentBracket 
                  matches={matches} 
                  onUpdateMatch={updateMatch}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 