'use client';

import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  Building2, 
  DollarSign, 
  Users, 
  ImageIcon,
  InboxIcon 
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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

  const filteredTournaments = tournaments
    .filter(tournament => 
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.tournament_info[0]?.tournament_club_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(tournament => filterStatus === 'all' ? true : tournament.status === filterStatus);

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: es });
  };

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">


        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o club..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus('upcoming')}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === 'upcoming' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Próximos
              </button>
              <button
                onClick={() => setFilterStatus('in_progress')}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === 'in_progress' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                En Curso
              </button>
            </div>
          </div>
        </div>

        {/* Tournament Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <InboxIcon className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-red-700">Error al cargar los torneos</h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <InboxIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No hay torneos disponibles</h3>
            <p className="text-gray-500 mt-2">No se encontraron torneos que coincidan con tu búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <Link
                href={`/tournaments/${tournament.id}`}
                key={tournament.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="relative">
                  {tournament.tournament_info[0]?.tournament_thumbnail ? (
                    <img
                      src={tournament.tournament_info[0].tournament_thumbnail}
                      alt={tournament.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      tournament.status === 'upcoming' 
                        ? 'bg-blue-100 text-blue-800'
                        : tournament.status === 'in_progress'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tournament.status === 'upcoming' ? 'Próximo' : 
                       tournament.status === 'in_progress' ? 'En Curso' : 'Finalizado'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {tournament.name}
                  </h2>
                  
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
                      </span>
                    </div>
                    
                    {tournament.tournament_info[0] && (
                      <>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm">
                            {tournament.tournament_info[0].tournament_club_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm font-medium text-green-600">
                            Inscripción: ${tournament.tournament_info[0].inscription_cost}
                          </span>
                        </div>
                      </>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {tournament.tournament_teams.length} equipos inscritos
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

