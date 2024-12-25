'use client'

import { Team } from '@/types/tournament'

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

interface Standing {
  team: Team
  played: number
  won: number
  lost: number
  points: number
}

interface RoundRobinStandingsProps {
  matches: Match[]
  teams: Team[]
}

export function RoundRobinStandings({ matches, teams }: RoundRobinStandingsProps) {
  // Initialize standings for all teams
  const standings: Standing[] = teams.map(team => ({
    team,
    played: 0,
    won: 0,
    lost: 0,
    points: 0
  }))

  // Calculate standings from matches
  matches.forEach(match => {
    if (match.winner) {
      const winnerStanding = standings.find(s => s.team.id === match.winner?.id)
      const loserStanding = standings.find(s => 
        s.team.id === (match.team1?.id === match.winner?.id ? match.team2?.id : match.team1?.id)
      )

      if (winnerStanding) {
        winnerStanding.played++
        winnerStanding.won++
        winnerStanding.points += 3 // 3 points for a win
      }

      if (loserStanding) {
        loserStanding.played++
        loserStanding.lost++
      }
    }
  })

  // Sort standings by points (descending) and then by won matches
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    return b.won - a.won
  })

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Clasificación</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PJ</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PG</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PP</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {standings.map((standing, index) => (
              <tr key={standing.team.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}º</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {standing.team.player1.name} / {standing.team.player2.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{standing.played}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600">{standing.won}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-600">{standing.lost}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold">{standing.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 