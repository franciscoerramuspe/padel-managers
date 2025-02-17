import { Calendar, Clock, Users, MapPin, Trophy, DollarSign, FileText, Info, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

interface TournamentInfoProps {
  tournament: any;
  onBack: () => void;
}

export function TournamentInfo({ tournament, onBack }: TournamentInfoProps) {
  const tournamentInfo = tournament.tournament_info?.[0] || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Torneos
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Acerca del torneo */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Acerca del torneo</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-600">{tournamentInfo.description || 'Sin descripción disponible'}</p>
            </div>
          </section>

          {/* Premios Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">Premios</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-yellow-600 font-semibold">1° Lugar</span>
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">${tournamentInfo.first_place_prize || '0'}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-600 font-semibold">2° Lugar</span>
                  <Trophy className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">${tournamentInfo.second_place_prize || '0'}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-orange-600 font-semibold">3° Lugar</span>
                  <Trophy className="h-5 w-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">${tournamentInfo.third_place_prize || '0'}</p>
              </div>
            </div>
          </section>

          {/* Reglamento Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl font-bold">Reglamento</h2>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="prose max-w-none">
                {tournamentInfo.rules ? (
                  <div className="whitespace-pre-line">{tournamentInfo.rules}</div>
                ) : (
                  <p className="text-gray-500">Reglamento no disponible</p>
                )}
              </div>
              <Button variant="outline" className="mt-4">
                Descargar PDF
              </Button>
            </div>
          </section>
        </div>

        {/* Sidebar - Registration Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-blue-600">${tournamentInfo.inscription_cost || '0'}</h3>
              <p className="text-gray-500">por equipo</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Fecha límite de inscripción</p>
                  <p className="font-medium">
                    {new Date(tournamentInfo.signup_limit_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Cupos disponibles</p>
                  <p className="font-medium">{8 - (tournament.tournament_teams?.length || 0)} de 8</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Sede del torneo</p>
                  <p className="font-medium">{tournamentInfo.tournament_location}</p>
                  <p className="text-sm text-gray-500">{tournamentInfo.tournament_address}</p>
                </div>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Inscribirse ahora
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Al inscribirte aceptas el reglamento del torneo y las políticas de participación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}