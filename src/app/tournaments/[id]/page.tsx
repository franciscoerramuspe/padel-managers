// src/app/tournaments/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Users, Clock } from 'lucide-react';
import { TournamentEditButton } from '@/components/TournamentEditButton'

export interface Tournament {
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
  prize_pool: number;
  format: string;
  status: string;
  location: string;
}

export default function TournamentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(`/api/tournaments/${params.id}`);
        if (!response.ok) {
          console.error('Tournament fetch failed:', await response.text());
          throw new Error('Tournament not found');
        }
        const data = await response.json();
        console.log('Tournament data:', data);
        setTournament(data);
      } catch (error) {
        console.error('Error fetching tournament:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#6B8AFF]"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Torneo no encontrado</h1>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Volver a torneos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 font-semibold mb-8 flex items-center"
        >
          ← Volver a torneos
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{tournament.name}</h1>
              <span className="inline-block px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-full">
                {tournament.category}
              </span>
            </div>
            <span className="text-3xl font-bold text-green-600">
              ${tournament.price}
            </span>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center text-gray-700">
              <Calendar className="mr-3" size={20} />
              <div>
                <p className="font-semibold">Fechas del torneo</p>
                <p>{new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-700">
              <Users className="mr-3" size={20} />
              <div>
                <p className="font-semibold">Equipos registrados</p>
                <p>{tournament.current_registrations} de {tournament.teams_limit} equipos</p>
              </div>
            </div>

            <div className="flex items-center text-gray-700">
              <Clock className="mr-3" size={20} />
              <div>
                <p className="font-semibold">Fecha límite de inscripción</p>
                <p>{new Date(tournament.sign_up_limit_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <TournamentEditButton tournament={tournament} />
            <button 
              className="w-full bg-[#6B8AFF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5A75E6] transition-colors duration-300"
            >
              Inscribirse al torneo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
