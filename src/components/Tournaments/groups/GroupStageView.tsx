'use client'

import { Card } from './ui/card'
import { TournamentTeam } from '../types/tournament'

interface GroupStageProps {
  matches: any[]
  teams: TournamentTeam[]
  onUpdateMatch: (matchId: string, winnerId: string) => void
}

export function GroupStageView({ matches, teams, onUpdateMatch }: GroupStageProps) {
  const groupATeams = teams.filter(t => t.group === 'A')
  const groupBTeams = teams.filter(t => t.group === 'B')
  const groupMatches = matches.filter(m => m.round === 1)
  const semifinalMatches = matches.filter(m => m.round === 2)
  const finalMatch = matches.find(m => m.round === 3)

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Group A */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Grupo A</h3>
          <div className="space-y-4">
            {groupMatches
              .filter(m => m.group === 'A')
              .map(match => (
                <GroupMatch 
                  key={match.id} 
                  match={match} 
                  onUpdateMatch={onUpdateMatch}
                />
              ))}
          </div>
        </div>

        {/* Group B */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Grupo B</h3>
          <div className="space-y-4">
            {groupMatches
              .filter(m => m.group === 'B')
              .map(match => (
                <GroupMatch 
                  key={match.id} 
                  match={match} 
                  onUpdateMatch={onUpdateMatch}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Semifinals */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Semifinales</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {semifinalMatches.map(match => (
            <GroupMatch 
              key={match.id} 
              match={match} 
              onUpdateMatch={onUpdateMatch}
            />
          ))}
        </div>
      </div>

      {/* Final */}
      {finalMatch && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Final</h3>
          <div className="max-w-md mx-auto">
            <GroupMatch 
              match={finalMatch} 
              onUpdateMatch={onUpdateMatch}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const GroupMatch = ({ match, onUpdateMatch }: { match: any, onUpdateMatch: (matchId: string, winnerId: string) => void }) => (
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
      {!match.winner && match.team1 && match.team2 && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onUpdateMatch(match.id, match.team1.id)}
            className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Equipo 1 Gana
          </button>
          <button
            onClick={() => onUpdateMatch(match.id, match.team2.id)}
            className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Equipo 2 Gana
          </button>
        </div>
      )}
    </div>
  </Card>
) 