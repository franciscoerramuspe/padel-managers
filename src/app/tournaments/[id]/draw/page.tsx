'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TournamentBracket } from '@/components/TournamentBracket'

interface Team {
  id: string
  player1: { name: string }
  player2: { name: string }
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

export default function TournamentDrawPage() {
  const params = useParams()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTournamentDraw = async () => {
      try {
        const response = await fetch(`/api/tournaments/${params.id}/draw`)
        if (!response.ok) throw new Error('Failed to fetch tournament draw')
        const data = await response.json()
        setMatches(data.matches)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTournamentDraw()
  }, [params.id])

  const generateDraw = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tournaments/${params.id}/draw/generate`, {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate tournament draw');
      }

      const data = await response.json();
      if (data.matches) {
        setMatches(data.matches);
      } else {
        console.error('No matches in response:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <CardTitle className="text-3xl">Cuadro del Torneo</CardTitle>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                No se ha generado el cuadro del torneo aún
              </p>
              <button
                onClick={generateDraw}
                className="bg-[#6B8AFF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5A75E6] transition-colors duration-300"
              >
                Generar Cuadro
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <TournamentBracket 
                matches={matches} 
                onUpdateMatch={updateMatch}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 