'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SingleEliminationBracket from '@/components/Tournaments/SingleEliminationBracket';
import RoundRobinBracket from '@/components/Tournaments/RoundRobinBracket';
import { ScheduleMatchModal } from '@/components/Tournaments/ScheduleMatchModal';
import { Tournament } from '../../../../types/tournament';

interface Match {
  id: string;
  tournament_id: string;
  round: number;
  position: number;
  team1: {
    id: string;
    name: string;
  } | null;
  team2: {
    id: string;
    name: string;
  } | null;
  status: 'pending' | 'completed';
  team1_score: {
    sets: Array<{
      games: number;
      tiebreak: number | null;
    }>;
  } | null;
  team2_score: {
    sets: Array<{
      games: number;
      tiebreak: number | null;
    }>;
  } | null;
  winner_id: string | null;
  scheduled_start: string | null;
  scheduled_end: string | null;
  court: {
    id: string;
    name: string;
  } | null;
}

interface Tournament {
  id: string;
  name: string;
  format: string;
  tournament_teams: Array<{
    team: {
      id: string;
      name: string;
    }
  }>;
}

interface ScheduleData {
  court_id: string;
  start_time: string;
  end_time: string;
}

export default function TournamentDrawPage() {
  const params = useParams();
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching draw for tournament:', params.id);
      const response = await fetch(`http://localhost:3001/api/tournaments/${params.id}/draw`);
      if (!response.ok) throw new Error('Failed to fetch draw');
      
      const data = await response.json();
      console.log('Data:', data);
      setMatches(data.matches);

      if (data.tournament) {
        setTournament(data.tournament);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los partidos');
    } finally {
      setLoading(false);
    }
  };

  const generateDraw = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/tournaments/${params.id}/draw/generate`,
        { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to generate draw');
      }

      // Refresh the page data after generating
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      setError('Error al generar el cuadro');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMatch = async (matchId: string, scheduleData: ScheduleData) => {
    try {
      console.log('Scheduling match:', matchId);
      const response = await fetch(`http://localhost:3001/api/tournaments/matches/${matchId}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) throw new Error('Failed to schedule match');

      // Refresh tournament data after scheduling
      fetchData();
      setIsModalOpen(false);
      setSelectedMatch(null);
    } catch (error) {
      console.error('Error scheduling match:', error);
    }
  };    

  const renderBracket = () => {
    if (!matches) return null;

    switch (tournament?.format) {
      case 'single_elimination':
        return (
          <SingleEliminationBracket 
            matches={matches} 
            onScheduleMatch={(matchId) => {
              setSelectedMatch(matchId);
              setIsModalOpen(true);
            }}
          />
        );
      case 'round_robin':
        return (
          <RoundRobinBracket 
            matches={matches} 
            teams={tournament.tournament_teams.map(tt => tt.team)}
            onScheduleMatch={(matchId) => {
              setSelectedMatch(matchId);
              setIsModalOpen(true);
            }}
          />
        );
      default:
        return (
          <div className="text-center text-gray-500">
            Formato de torneo no soportado
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#6B8AFF]"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Torneo no encontrado</h1>
          <Link href="/tournaments" className="text-blue-600 hover:text-blue-700">
            ← Volver a torneos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[90rem] mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <Link href={`/tournaments/${tournament.id}`} className="text-blue-600 hover:text-blue-700">
            ← Volver al torneo
          </Link>
          {matches && matches.length === 0 && (
            <button
              onClick={generateDraw}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Generando...' : 'Generar Cuadro'}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {matches?.length ? (
          <div className="bg-white rounded-lg shadow-sm p-4">
            {renderBracket()}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No hay partidos generados aún
          </div>
        )}
      </div>

      <ScheduleMatchModal
        isOpen={isModalOpen}
        matchId={selectedMatch}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMatch(null);
        }}
        onSchedule={handleScheduleMatch}
      />
    </div>
  );
} 