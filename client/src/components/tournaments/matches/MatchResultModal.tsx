'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Match {
  id: string
  team1_id: string
  team2_id: string
}

interface MatchResultModalProps {
  isOpen: boolean
  onClose: () => void
  match: Match | null
  team1Name: string
  team2Name: string
  onSubmit: (matchId: string, data: MatchResultData) => Promise<void>
}

interface SetScore {
  games: number
  tiebreak: number | null
}

interface TeamScore {
  id: string
  score: {
    sets: SetScore[]
  }
}

interface MatchResultData {
  teams: TeamScore[]
  winner_id: string
}

export function MatchResultModal({ isOpen, onClose, match, team1Name, team2Name, onSubmit }: MatchResultModalProps) {
  const [scores, setScores] = useState<TeamScore[]>([
    { id: '', score: { sets: [{ games: 0, tiebreak: null }, { games: 0, tiebreak: null }, { games: 0, tiebreak: null }] } },
    { id: '', score: { sets: [{ games: 0, tiebreak: null }, { games: 0, tiebreak: null }, { games: 0, tiebreak: null }] } }
  ])
  const [isThirdSetEnabled, setIsThirdSetEnabled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && match) {
      setScores([
        { id: match.team1_id, score: { sets: [{ games: 0, tiebreak: null }, { games: 0, tiebreak: null }, { games: 0, tiebreak: null }] } },
        { id: match.team2_id, score: { sets: [{ games: 0, tiebreak: null }, { games: 0, tiebreak: null }, { games: 0, tiebreak: null }] } }
      ])
      setIsThirdSetEnabled(false)
    }
  }, [isOpen, match])

  const handleScoreChange = (teamIndex: number, setIndex: number, games: number) => {
    setScores(prev => {
      const newScores = [...prev]
      newScores[teamIndex].score.sets[setIndex].games = Math.min(7, Math.max(0, games))
      
      // Reset tiebreak scores if games score changes
      if (newScores[teamIndex].score.sets[setIndex].games !== 7 || 
          newScores[1 - teamIndex].score.sets[setIndex].games !== 6) {
        newScores[0].score.sets[setIndex].tiebreak = null
        newScores[1].score.sets[setIndex].tiebreak = null
      }
      
      return newScores
    })

    // Check if third set should be enabled
    if (setIndex < 2) {
      const team1WonSets = scores[0].score.sets.slice(0, 2).filter((set, idx) => 
        set.games > scores[1].score.sets[idx].games
      ).length
      const team2WonSets = scores[1].score.sets.slice(0, 2).filter((set, idx) => 
        set.games > scores[0].score.sets[idx].games
      ).length
      setIsThirdSetEnabled(team1WonSets === 1 && team2WonSets === 1)
    }
  }

  const handleTiebreakChange = (teamIndex: number, setIndex: number, tiebreak: number) => {
    setScores(prev => {
      const newScores = [...prev]
      newScores[teamIndex].score.sets[setIndex].tiebreak = Math.max(0, tiebreak)
      return newScores
    })
  }

  const isTiebreakSet = (setIndex: number) => {
    const set1Games = scores[0].score.sets[setIndex].games
    const set2Games = scores[1].score.sets[setIndex].games
    return (set1Games === 7 && set2Games === 6) || (set1Games === 6 && set2Games === 7)
  }

  const calculateWinner = (): string => {
    const team1WonSets = scores[0].score.sets.filter((set, idx) => {
      if (!isThirdSetEnabled && idx === 2) return false
      return set.games > scores[1].score.sets[idx].games
    }).length
    const team2WonSets = scores[1].score.sets.filter((set, idx) => {
      if (!isThirdSetEnabled && idx === 2) return false
      return set.games > scores[0].score.sets[idx].games
    }).length
    return team1WonSets > team2WonSets ? scores[0].id : scores[1].id
  }

  const validateScores = (): boolean => {
    setValidationError(null)

    // Check each set
    for (let setIndex = 0; setIndex < (isThirdSetEnabled ? 3 : 2); setIndex++) {
      const team1Games = scores[0].score.sets[setIndex].games
      const team2Games = scores[1].score.sets[setIndex].games

      // Validate basic game scores
      if (team1Games === team2Games) {
        setValidationError(`Set ${setIndex + 1}: Los juegos no pueden estar empatados`)
        return false
      }

      // Validate 7-game scenarios
      if (team1Games === 7) {
        if (team2Games !== 5 && team2Games !== 6) {
          setValidationError(`Set ${setIndex + 1}: Con 7 juegos, el oponente debe tener 5 o 6 juegos`)
          return false
        }
        if (team2Games === 6) {
          if (scores[0].score.sets[setIndex].tiebreak === null || scores[1].score.sets[setIndex].tiebreak === null) {
            setValidationError(`Set ${setIndex + 1}: Puntuación de tie-break requerida para resultado 7-6`)
            return false
          }
        }
      }

      if (team2Games === 7) {
        if (team1Games !== 5 && team1Games !== 6) {
          setValidationError(`Set ${setIndex + 1}: Con 7 juegos, el oponente debe tener 5 o 6 juegos`)
          return false
        }
        if (team1Games === 6) {
          if (scores[0].score.sets[setIndex].tiebreak === null || scores[1].score.sets[setIndex].tiebreak === null) {
            setValidationError(`Set ${setIndex + 1}: Puntuación de tie-break requerida para resultado 7-6`)
            return false
          }
        }
      }

      // Validate tiebreak scores
      if (scores[0].score.sets[setIndex].tiebreak !== null || scores[1].score.sets[setIndex].tiebreak !== null) {
        if (team1Games !== 7 && team2Games !== 7) {
          setValidationError(`Set ${setIndex + 1}: Tie-break solo permitido en sets 7-6`)
          return false
        }
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!match) return

    if (!validateScores()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Format data according to API requirements
      const resultData: MatchResultData = {
        teams: scores.map(team => ({
          id: team.id,
          score: {
            sets: team.score.sets
              .slice(0, isThirdSetEnabled ? 3 : 2)
              .map(set => ({
                games: set.games,
                tiebreak: set.tiebreak
              }))
          }
        })),
        winner_id: calculateWinner()
      }

      await onSubmit(match.id, resultData)
      toast({
        title: "Resultado guardado",
        description: "El resultado del partido ha sido registrado exitosamente.",
      })
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el resultado'
      setValidationError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!match) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Agregar Resultado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            {/* Team Names */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
              <span className="font-medium text-lg">{team1Name}</span>
              <span className="text-gray-500">vs</span>
              <span className="font-medium text-lg text-right">{team2Name}</span>
            </div>
            
            {/* Sets */}
            {[0, 1, 2].map((setIndex) => (
              <div 
                key={setIndex} 
                className={`grid grid-cols-[1fr_auto_1fr] gap-4 items-center ${
                  setIndex === 2 && !isThirdSetEnabled ? 'opacity-50' : ''
                }`}
              >
                <div className="space-y-2">
                  <Label htmlFor={`team1-set-${setIndex}`} className="text-sm text-gray-500">
                    Set {setIndex + 1}
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id={`team1-set-${setIndex}`}
                      type="number"
                      min="0"
                      max="7"
                      value={scores[0].score.sets[setIndex].games}
                      onChange={(e) => handleScoreChange(0, setIndex, parseInt(e.target.value))}
                      className="w-16 text-center"
                      aria-label={`Set ${setIndex + 1} score for ${team1Name}`}
                      disabled={setIndex === 2 && !isThirdSetEnabled}
                    />
                    {isTiebreakSet(setIndex) && (
                      <Input
                        type="number"
                        min="0"
                        value={scores[0].score.sets[setIndex].tiebreak ?? ''}
                        onChange={(e) => handleTiebreakChange(0, setIndex, parseInt(e.target.value))}
                        className="w-16 text-center"
                        placeholder="TB"
                        aria-label={`Set ${setIndex + 1} tiebreak for ${team1Name}`}
                        disabled={setIndex === 2 && !isThirdSetEnabled}
                      />
                    )}
                  </div>
                </div>
                <span className="text-gray-400 self-end">-</span>
                <div className="space-y-2">
                  <Label htmlFor={`team2-set-${setIndex}`} className="text-sm text-gray-500">
                    Set {setIndex + 1}
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id={`team2-set-${setIndex}`}
                      type="number"
                      min="0"
                      max="7"
                      value={scores[1].score.sets[setIndex].games}
                      onChange={(e) => handleScoreChange(1, setIndex, parseInt(e.target.value))}
                      className="w-16 text-center"
                      aria-label={`Set ${setIndex + 1} score for ${team2Name}`}
                      disabled={setIndex === 2 && !isThirdSetEnabled}
                    />
                    {isTiebreakSet(setIndex) && (
                      <Input
                        type="number"
                        min="0"
                        value={scores[1].score.sets[setIndex].tiebreak ?? ''}
                        onChange={(e) => handleTiebreakChange(1, setIndex, parseInt(e.target.value))}
                        className="w-16 text-center"
                        placeholder="TB"
                        aria-label={`Set ${setIndex + 1} tiebreak for ${team2Name}`}
                        disabled={setIndex === 2 && !isThirdSetEnabled}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Winner Display */}
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <Trophy className="w-5 h-5" />
            <span className="font-medium">
              Ganador: {calculateWinner() === scores[0].id ? team1Name : team2Name}
            </span>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Resultado"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

