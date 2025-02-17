import { motion } from "framer-motion"
import { Calendar, Clock } from 'lucide-react'
import { format } from "date-fns"
import es from "date-fns/locale/es"

interface Team {
  id: string
  name: string
  seed?: number
}

interface BracketCardProps {
  team1?: Team
  team2?: Team
  winner_id: string | null
  matchId: string
  onSchedule: (id: string) => void
  scheduled_start?: string
  roundNumber: number
}

export function BracketCard({
  team1,
  team2,
  winner_id,
  matchId,
  onSchedule,
  scheduled_start,
  roundNumber
}: BracketCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-[280px] bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <div className="p-4 space-y-3">
        {/* Match Time */}
        {scheduled_start && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Clock className="w-4 h-4" />
            <span>
              {format(new Date(scheduled_start), "d 'de' MMMM, HH:mm", { locale: es })}
            </span>
          </div>
        )}

        {/* Teams */}
        <div className="space-y-2">
          <TeamSlot
            team={team1}
            isWinner={winner_id === team1?.id}
            roundNumber={roundNumber}
          />
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm font-medium text-gray-400">VS</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <TeamSlot
            team={team2}
            isWinner={winner_id === team2?.id}
            roundNumber={roundNumber}
          />
        </div>

        {/* Schedule Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSchedule(matchId)}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
        >
          <Calendar className="w-4 h-4" />
          <span>Programar Partido</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

function TeamSlot({ team, isWinner, roundNumber }: { team?: Team; isWinner: boolean; roundNumber: number }) {
  return (
    <div
      className={`
        relative p-3 rounded-lg transition-colors duration-200
        ${isWinner ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-transparent'}
      `}
    >
      {team?.seed && (
        <span className="absolute -left-1 -top-1 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
          {team.seed}
        </span>
      )}
      <span className={`font-medium ${isWinner ? 'text-green-700' : 'text-gray-700'}`}>
        {team?.name || 'Por determinar'}
      </span>
    </div>
  )
}

