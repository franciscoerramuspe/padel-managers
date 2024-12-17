// app/tournaments/TournamentList.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Tournament {
  id: string;
  name: string;
  teams: any[];
  teams_limit: number;
  current_registrations: number;
  category: string;
  start_date: string;
  end_date: string;
  price: number;
  sign_up_limit_date: string;
}

export default function TournamentList() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/tournaments?${searchParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch tournaments');
        const data = await response.json();
        setTournaments(data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay torneos disponibles para las fechas seleccionadas
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tournaments.map((tournament) => (
        <div
          key={tournament.id}
          className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{tournament.name}</h2>
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                  {tournament.category}
                </span>
                <p className="mt-2 text-sm text-gray-600">
                  {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                </p>
              </div>
              <span className="text-lg font-bold text-green-600">
                ${tournament.price}
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Equipos:</span> {tournament.current_registrations}/{tournament.teams_limit}
              </p>
              <p className="text-sm">
                <span className="font-medium">Fecha límite de inscripción:</span>{' '}
                {new Date(tournament.sign_up_limit_date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="mt-4">
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
