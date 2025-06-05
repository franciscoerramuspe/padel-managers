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
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Fechas de la Liga</h3>

      <div className="flex flex-wrap gap-2 mb-6">
        {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => (
          <Button
            key={round}
            variant={selectedRound === round ? "default" : "outline"}
            onClick={() => handleRoundSelect(round)}
            className={`${
              selectedRound === round
                ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-none shadow-md"
                : "border-gray-300 hover:border-purple-300 hover:bg-purple-50"
            } transition-all duration-200 rounded-lg px-4 py-2`}
          >
            Fecha {round}
          </Button>
        ))}
      </div>

      <Card className="p-6 border border-gray-200 shadow-sm bg-gradient-to-br from-white to-purple-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-2 rounded-full">
            <CalendarDays className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">Próxima fecha: 15 de Abril, 2025</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-2 rounded-full">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">22:30 - 00:00</span>
        </div>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
          <div className="bg-yellow-100 p-2 rounded-full">
            <Trophy className="w-5 h-5 text-yellow-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">
            Fecha {selectedRound} de {totalRounds} del torneo
          </span>
        </div>
      </Card>
    </div>
  )
}
