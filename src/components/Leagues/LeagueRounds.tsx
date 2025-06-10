"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CalendarDays, Clock, Trophy } from "lucide-react"

interface LeagueRoundsProps {
  leagueId: string
  totalRounds: number
  onSelectRound: (round: number) => void
}

export function LeagueRounds({ leagueId, totalRounds, onSelectRound }: LeagueRoundsProps) {
  const [selectedRound, setSelectedRound] = useState(1)

  const handleRoundSelect = (round: number) => {
    setSelectedRound(round)
    onSelectRound(round)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fechas de la Liga</h3>

      <div className="flex flex-wrap gap-2 mb-6">
        {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => (
          <Button
            key={round}
            variant={selectedRound === round ? "default" : "outline"}
            onClick={() => handleRoundSelect(round)}
            className={`${
              selectedRound === round
                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                : "border-gray-200 dark:border-[#1D283A] hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-[#1D283A] text-gray-700 dark:text-gray-300"
            } transition-all duration-200`}
          >
            Fecha {round}
          </Button>
        ))}
      </div>

      <Card className="border-gray-200 dark:border-[#1D283A] bg-white dark:bg-[#1D283A]/30">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 dark:bg-[#0E1629] p-2 rounded-full">
              <CalendarDays className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Próxima fecha: 15 de Abril, 2025</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 dark:bg-[#0E1629] p-2 rounded-full">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">22:30 - 00:00</span>
          </div>
          
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-[#1D283A]">
            <div className="bg-amber-50 dark:bg-[#0E1629] p-2 rounded-full">
              <Trophy className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Fecha {selectedRound} de {totalRounds} del torneo
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
