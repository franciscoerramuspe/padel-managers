'use client';

import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TournamentTeam {
  team_id: string;
  teams: {
    id: string;
    player1_id: string;
    player2_id: string;
  };
}

interface TournamentInfo {
  id: string;
  description: string;
  inscription_cost: number;
  tournament_location: string;
  tournament_club_name: string;
  tournament_thumbnail?: string;
}

interface Tournament {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  tournament_teams: TournamentTeam[];
  tournament_info: TournamentInfo[];
}

export default function TournamentList() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments`);
      if (!response.ok) {
        throw new Error('Error al cargar los torneos');
      }
      const data = await response.json();
      setTournaments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching tournaments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#6B8AFF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-red-600">Error al cargar los torneos</h3>
        <p className="text-gray-500 mt-2">{error}</p>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-700">No hay torneos disponibles</h3>
        <p className="text-gray-500 mt-2">Intenta más tarde</p>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: es });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tournaments.map((tournament) => (
        <div
          key={tournament.id}
          className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
        >
          {tournament.tournament_info[0]?.tournament_thumbnail && (
            <img
              src={tournament.tournament_info[0].tournament_thumbnail}
              alt={tournament.name}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{tournament.name}</h2>
          <div className="flex flex-col space-y-3">
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-full w-fit">
              {tournament.status}
            </span>
            <span className="text-sm text-gray-600">
              {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
            </span>
            {tournament.tournament_info[0] && (
              <>
                <span className="text-sm text-gray-600">
                  {tournament.tournament_info[0].tournament_club_name}
                </span>
                <span className="text-sm font-semibold text-green-600">
                  Inscripción: ${tournament.tournament_info[0].inscription_cost}
                </span>
              </>
            )}
            <span className="text-sm text-gray-600">
              {tournament.tournament_teams.length} equipos inscritos
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

