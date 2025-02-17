import { Calendar, MapPin, Clock, DollarSign, Users } from 'lucide-react';
import { formatDate } from '@/utils/date';

interface TournamentOverviewProps {
  tournament: any; // TODO: Add proper type
}

export function TournamentOverview({ tournament }: TournamentOverviewProps) {
  const tournamentInfo = tournament.tournament_info?.[0];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Información General</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fechas y Horarios */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fechas del Torneo</h3>
                <p className="text-gray-600">
                  {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Inscripciones hasta: {formatDate(tournamentInfo?.signup_limit_date)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-50 rounded-lg p-3">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Horarios</h3>
                <p className="text-gray-600">
                  {tournament.time_slots?.map(([start, end]: number[]) => 
                    `${start}:00 - ${end}:00`
                  ).join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Ubicación y Detalles */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-50 rounded-lg p-3">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Ubicación</h3>
                <p className="text-gray-900">{tournamentInfo?.tournament_location}</p>
                <p className="text-gray-600">{tournamentInfo?.tournament_address}</p>
                <p className="text-sm text-gray-500 mt-1">{tournamentInfo?.tournament_club_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-amber-50 rounded-lg p-3">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Inscripción</h3>
                <p className="text-2xl font-bold text-amber-600">
                  ${tournamentInfo?.inscription_cost}
                </p>
                <p className="text-sm text-gray-500">por equipo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        {tournamentInfo?.description && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Acerca del Torneo</h3>
            <p className="text-gray-600 whitespace-pre-line">
              {tournamentInfo.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 