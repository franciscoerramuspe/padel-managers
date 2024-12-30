'use client'

import { motion } from "framer-motion"
import { Trophy, Calendar, MapPin } from 'lucide-react'
import { BracketCard } from "./BracketCard"

interface Match {
  id: string
  round: number
  position: number
  team1?: { id: string; name: string; seed?: number }
  team2?: { id: string; name: string; seed?: number }
  winner_id: string | null
  status: 'pending' | 'completed'
  scheduled_start?: string
  scheduled_end?: string
  court?: {
    id: string
    name: string
  }
}

interface Props {
  matches: Array<{
    id: string;
    team1?: { id: string; name: string };
    team2?: { id: string; name: string };
    winner_id?: string;
    scheduled_start?: string;
    scheduled_end?: string;
    court?: {
      id: string;
      name: string;
    };
  }>;
  onScheduleMatch?: (matchId: string) => void;
}

export default function SingleEliminationBracket({ matches, onScheduleMatch }: Props) {
  // Group matches by round
  const roundMatches = matches.reduce((acc, match) => {
    if (!acc[match.round]) acc[match.round] = []
    acc[match.round].push(match)
    return acc
  }, {} as Record<number, Match[]>)

  const maxRound = Math.max(...Object.keys(roundMatches).map(Number))
  const roundNames = {
    1: 'Primera Ronda',
    2: 'Cuartos de Final',
    3: 'Semifinales',
    4: 'Final'
  }

  return (
    <div className="relative w-full overflow-x-auto bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Torneo de Padel</h2>
        <p className="text-gray-500 mt-2">Bracket de Eliminación Simple</p>
      </div>

      <div className="flex gap-16 p-4 overflow-x-auto">
        {Object.entries(roundMatches).map(([round, matches]) => {
          const roundNumber = parseInt(round)
          const isLastRound = roundNumber === maxRound

          return (
            <div key={round} className="flex flex-col">
              <h3 className="text-lg font-semibold text-center mb-4 text-gray-600">
                {roundNames[roundNumber as keyof typeof roundNames] || `Ronda ${round}`}
              </h3>
              <div className="flex flex-col relative">
                {matches.map((match, idx) => (
                  <div key={match.id} className="relative">
                    <div className="w-64 border rounded-lg bg-white shadow-sm">
                      <div className="p-4 space-y-4">
                        <div className={`p-2 rounded ${match.winner_id === match.team1?.id ? 'bg-green-100' : ''}`}>
                          {match.team1?.name || 'Por determinar'}
                        </div>
                        <div className="text-center text-sm text-gray-500">vs</div>
                        <div className={`p-2 rounded ${match.winner_id === match.team2?.id ? 'bg-green-100' : ''}`}>
                          {match.team2?.name || 'Por determinar'}
                        </div>
                        
                        {/* Match Schedule Information */}
                        {match.scheduled_start && match.court && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg space-y-2">
                            <div className="text-sm font-medium text-blue-800">
                              Partido Programado
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-700">
                              <Calendar className="w-4 h-4" />
                              {new Date(match.scheduled_start).toLocaleString('es-ES', {
                                dateStyle: 'long',
                                timeStyle: 'short'
                              })}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-700">
                              <MapPin className="w-4 h-4" />
                              {match.court.name}
                            </div>
                          </div>
                        )}
                        
                        {/* Schedule Match button - only show if not scheduled */}
                        {onScheduleMatch && !match.scheduled_start && (
                          <button
                            onClick={() => onScheduleMatch(match.id)}
                            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded 
                              hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            Programar Partido
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Connecting Lines */}
                    {roundNumber < maxRound && (
                      <>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="absolute top-1/2 -right-16 w-16 h-0.5 bg-gradient-to-r from-blue-200 to-blue-300"
                        />
                        {idx % 2 === 0 && (
                          <motion.div
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="absolute top-1/2 -right-16 w-0.5 h-full bg-gradient-to-b from-blue-200 to-blue-300"
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
