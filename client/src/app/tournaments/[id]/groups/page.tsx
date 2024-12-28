'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GroupGenerator } from '@/components/GroupGenerator';

interface Team {
  id: string;
  name: string;
}

interface Tournament {
  id: string;
  name: string;
  tournament_teams: Team[];
  format: string;
}

export default function TournamentGroupsPage() {
  const params = useParams();
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTeams, setTotalTeams] = useState(0);
  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/${params.id}`);
        if (!response.ok) throw new Error('Error al cargar el torneo');
        const data = await response.json();
        console.log('Data:', data);
        setTournament(data);
        setTotalTeams(data.tournament_teams.length);
      } catch (error) {
        setError('No se pudo cargar el torneo');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#6B8AFF]"></div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Torneo no encontrado'}
          </h1>
          <Link
            href="/tournaments"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Volver a torneos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/tournaments/${tournament.id}`}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Volver al torneo
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {tournament.format === 'round_robin' 
              ? 'Cuadros Round Robin'
              : 'Grupos del Torneo'}
          </h1>

          <GroupGenerator 
            tournamentId={tournament.id} 
            totalTeams={totalTeams} 
          />
        </div>
      </div>
    </div>
  );
}
