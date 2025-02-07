'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Building2, 
  Trophy, 
  DollarSign,
  ArrowLeft,
  Share2
} from 'lucide-react';
import Image from 'next/image';
interface Tournament {
  id: string;
  name: string;
  category: string;
  status: string;
  start_date: string;
  end_date: string;
  tournament_teams: any[];
  tournament_info: [{
    description: string;
    rules: string;
    tournament_location: string;
    tournament_club_name: string;
    tournament_thumbnail?: string;
    inscription_cost: number;
    signup_limit_date: string;
    first_place_prize: string;
    second_place_prize: string;
    third_place_prize: string;
  }];
}

export default function TournamentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch tournament');
        const data = await response.json();
        setTournament(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTournament();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Torneo no encontrado</h1>
          <button
            onClick={() => router.push('/tournaments')}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a torneos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image */}
      <div className="relative h-[300px] bg-gradient-to-r from-blue-600 to-blue-800">
        {tournament.tournament_info[0]?.tournament_thumbnail && (
        <Image
        src={tournament.tournament_info[0].tournament_thumbnail}
        alt={tournament.name}
        fill
        priority
        sizes="100vw"
        className="w-full h-full object-cover opacity-30"
      />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => router.push('/tournaments')}
              className="text-white/80 hover:text-white font-semibold mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a torneos
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">{tournament.name}</h1>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                {tournament.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium
                ${tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  tournament.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'}`}>
                {tournament.status === 'upcoming' ? 'Próximo' :
                 tournament.status === 'in_progress' ? 'En Curso' : 'Finalizado'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Descripción</h2>
              <p className="text-gray-600">{tournament.tournament_info[0]?.description}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Reglas del Torneo</h2>
              <p className="text-gray-600 whitespace-pre-line">{tournament.tournament_info[0]?.rules}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Premios</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tournament.tournament_info[0]?.first_place_prize && (
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
                    <Trophy className="h-6 w-6 text-yellow-600 mb-2" />
                    <h3 className="font-semibold text-yellow-900">1er Lugar</h3>
                    <p className="text-yellow-800">{tournament.tournament_info[0].first_place_prize}</p>
                  </div>
                )}
                {tournament.tournament_info[0]?.second_place_prize && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
                    <Trophy className="h-6 w-6 text-gray-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">2do Lugar</h3>
                    <p className="text-gray-800">{tournament.tournament_info[0].second_place_prize}</p>
                  </div>
                )}
                {tournament.tournament_info[0]?.third_place_prize && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                    <Trophy className="h-6 w-6 text-orange-600 mb-2" />
                    <h3 className="font-semibold text-orange-900">3er Lugar</h3>
                    <p className="text-orange-800">{tournament.tournament_info[0].third_place_prize}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Costo de Inscripción</p>
                    <p className="font-semibold text-green-600">
                      ${tournament.tournament_info[0]?.inscription_cost}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Equipos Inscritos</p>
                    <p className="font-semibold">{tournament.tournament_teams.length} equipos</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Fechas del Torneo</p>
                    <p className="font-semibold">
                      {new Date(tournament.start_date).toLocaleDateString()} - 
                      {new Date(tournament.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha Límite de Inscripción</p>
                    <p className="font-semibold">
                      {new Date(tournament.tournament_info[0]?.signup_limit_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Club</p>
                    <p className="font-semibold">{tournament.tournament_info[0]?.tournament_club_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ubicación</p>
                    <p className="font-semibold">{tournament.tournament_info[0]?.tournament_location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Inscribirse al Torneo
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Compartir Torneo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
