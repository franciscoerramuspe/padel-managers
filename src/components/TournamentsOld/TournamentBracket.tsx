'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Player {
  id: string
  name: string
}

interface Team {
  id: string
  player1: Player
  player2: Player
  group?: string
  points?: number
}

interface Match {
  id: string
  round: number
  position: number
  team1?: Team
  team2?: Team
  winner?: Team
  nextMatchId?: string
  group?: string
  scheduled_start?: string
  scheduled_end?: string
  court_id?: string
}

type TournamentFormat = "single_elimination" | "round_robin";

interface TournamentBracketProps {
  matches: Match[]
  format: TournamentFormat
  onUpdateMatch?: (matchId: string, winnerId: string) => void
  onScheduleMatch?: (matchId: string, startTime: string, endTime: string, courtId: string) => void
}

const MatchTeam = ({ team, isWinner, onClick }: { 
  team?: Team, 
  isWinner?: boolean,
  onClick?: () => void 
}) => (
  <div 
    className={`p-2 cursor-pointer hover:bg-gray-50 rounded ${isWinner ? 'bg-green-100' : ''}`}
    onClick={onClick}
  >
    {team ? (
      <div className="text-sm">
        {team.player1.name} / {team.player2.name}
      </div>
    ) : (
      <div className="text-sm text-gray-400">TBD</div>
    )}
  </div>
)

const ScheduleDialog = ({ 
  isOpen, 
  onClose, 
  onSchedule, 
  matchId 
}: { 
  isOpen: boolean
  onClose: () => void
  onSchedule: (matchId: string, startTime: string, endTime: string, courtId: string) => void
  matchId: string 
}) => {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [courtId, setCourtId] = useState('')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Programar Partido</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Inicio</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fin</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cancha</label>
            <select
              value={courtId}
              onChange={(e) => setCourtId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccionar cancha</option>
              <option value="1">Cancha 1</option>
              <option value="2">Cancha 2</option>
            </select>
          </div>
          <Button 
            onClick={() => {
              onSchedule(matchId, startTime, endTime, courtId)
              onClose()
            }}
          >
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function TournamentBracket({ matches, format, onUpdateMatch, onScheduleMatch }: TournamentBracketProps) {
  const [hoveredMatch, setHoveredMatch] = useState<string | null>(null)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)

  const matchesByRound = matches.reduce((acc, match) => {
    if (!acc[match.round]) acc[match.round] = [];
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  const renderMatch = (match: Match) => (
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
        {onScheduleMatch && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => {
              setSelectedMatchId(match.id)
              setScheduleDialogOpen(true)
            }}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {match.scheduled_start ? 'Reprogramar' : 'Programar'}
          </Button>
        )}
      </div>
      
      {match.nextMatchId && format === 'single_elimination' && (
        <div className="absolute right-0 top-1/2 w-8 border-t-2 border-gray-300" 
          style={{ transform: 'translateX(100%)' }} 
        />
      )}
    </div>
  )

  return (
    <>
      {format === 'single_elimination' ? (
        <div className="flex gap-8 p-4 overflow-x-auto">
          {Object.entries(matchesByRound).map(([round, roundMatches]) => (
            <div key={round} className="flex flex-col gap-8">
              <h3 className="text-lg font-semibold text-center">
                Ronda {round}
              </h3>
              <div className="flex flex-col gap-16">
                {roundMatches.map(renderMatch)}
              </div>
            </div>
          ))}
        </div>
      ) : format === 'round_robin' ? (
        <div className="space-y-8">
          {Object.entries(matchesByRound).map(([round, roundMatches]) => (
            <div key={round} className="space-y-4">
              <h3 className="text-xl font-semibold">Ronda {round}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roundMatches.map(renderMatch)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {['A', 'B'].map(group => (
            <div key={group}>
              <h3 className="text-xl font-semibold mb-4">Grupo {group}</h3>
              <div className="space-y-4">
                {matches
                  .filter(m => m.group === group && m.round === 1)
                  .map(renderMatch)}
              </div>
            </div>
          ))}
        </div>
      )}

      <ScheduleDialog
        isOpen={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
        onSchedule={onScheduleMatch!}
        matchId={selectedMatchId!}
      />
    </>
  )
}