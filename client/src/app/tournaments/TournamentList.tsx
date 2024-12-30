'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import dotenv from 'dotenv';

dotenv.config();

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments?${searchParams.toString()}`);
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
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#6B8AFF]"></div>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-700">No hay torneos disponibles</h3>
        <p className="text-gray-500 mt-2">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tournaments.map((tournament) => (
        <div
          key={tournament.id}
          className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{tournament.name}</h2>
                <span className="inline-block px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-full">
                  {tournament.category}
                </span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                ${tournament.price}
              </span>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600 flex items-center">
                <Calendar className="mr-2" size={16} />
                {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <Users className="mr-2" size={16} />
                Equipos: {tournament.teams.length}/{tournament.teams_limit}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <Clock className="mr-2" size={16} />
                Inscripción hasta: {new Date(tournament.sign_up_limit_date).toLocaleDateString()}
              </p>
            </div>
            
            <Link 
              href={`/tournaments/${tournament.id}`}
              className="w-full bg-[#6B8AFF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5A75E6] transition-colors duration-300 text-center block"
            >
              Ver Detalles
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

