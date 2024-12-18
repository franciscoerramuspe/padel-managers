'use client'

import { useState } from 'react'

interface Player {
  id: string
  name: string
}

interface Team {
  id: string
  player1: Player
  player2: Player
}

interface Match {
  id: string
  round: number
  position: number
  team1?: Team
  team2?: Team
  winner?: Team
  nextMatchId?: string
}

interface TournamentBracketProps {
  matches: Match[]
  onUpdateMatch?: (matchId: string, winnerId: string) => void
}

export function TournamentBracket({ matches, onUpdateMatch }: TournamentBracketProps) {
  const [hoveredMatch, setHoveredMatch] = useState<string | null>(null)

  // Group matches by round
  const roundsMap = matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = []
    }
    acc[match.round].push(match)
    return acc
  }, {} as Record<number, Match[]>)

  // Sort rounds and matches within each round
  const rounds = Object.entries(roundsMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([round, matches]) => ({
      round: Number(round),
      matches: matches.sort((a, b) => a.position - b.position)
    }))

  return (
    <div className="tournament-bracket flex gap-8 p-4 overflow-x-auto min-h-[500px]">
      {rounds.map(({ round, matches }) => (
        <div
          key={round}
          className="round flex flex-col justify-around min-w-[300px] gap-8"
          style={{
            marginTop: `${round > 1 ? Math.pow(2, round - 2) * 4 : 0}rem`,
            marginBottom: `${round > 1 ? Math.pow(2, round - 2) * 4 : 0}rem`
          }}
        >
          {matches.map((match) => (
            <div
              key={match.id}
              className={`match-container relative bg-white rounded-lg shadow-md border-2 
                ${hoveredMatch === match.id ? 'border-blue-500' : 'border-gray-200'}
                ${match.winner ? 'border-green-500' : ''}`}
              onMouseEnter={() => setHoveredMatch(match.id)}
              onMouseLeave={() => setHoveredMatch(null)}
            >
              <div className="p-4 space-y-4">
                <MatchTeam
                  team={match.team1}
                  isWinner={match.winner?.id === match.team1?.id}
                  onClick={() => match.team1 && onUpdateMatch?.(match.id, match.team1.id)}
                />
                <div className="border-t border-gray-200" />
                <MatchTeam
                  team={match.team2}
                  isWinner={match.winner?.id === match.team2?.id}
                  onClick={() => match.team2 && onUpdateMatch?.(match.id, match.team2.id)}
                />
              </div>
              
              {/* Connection lines to next match */}
              {match.nextMatchId && (
                <div className="absolute right-0 top-1/2 w-8 border-t-2 border-gray-300" 
                  style={{ transform: 'translateX(100%)' }} 
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function MatchTeam({ team, isWinner, onClick }: { 
  team?: Team
  isWinner?: boolean
  onClick?: () => void 
}) {
  if (!team) {
    return (
      <div className="h-12 flex items-center justify-center bg-gray-50 rounded text-gray-400">
        TBD
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-2 rounded hover:bg-gray-50 transition-colors
        ${isWinner ? 'bg-green-50' : ''}`}
    >
      <div className="font-semibold text-sm">
        {team.player1.name} / {team.player2.name}
      </div>
    </button>
  )
} 