import { Calendar, MapPin, Clock, DollarSign, Users } from 'lucide-react';
import { formatDate } from '@/utils/date';

interface TournamentOverviewProps {
  tournament: any; // TODO: Add proper type
}

export function TournamentOverview({ tournament }: TournamentOverviewProps) {
  const tournamentInfo = tournament.tournament_info?.[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Información General</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fechas del Torneo */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">Fechas del Torneo</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {new Date(tournament.start_date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })} - {new Date(tournament.end_date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Inscripciones hasta: {tournamentInfo?.inscription_end_date ? new Date(tournamentInfo.inscription_end_date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : 'No especificado'}
              </p>
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">Ubicación</h3>
              <p className="text-gray-600 dark:text-gray-300">{tournamentInfo?.tournament_club_name || 'No especificado'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tournamentInfo?.tournament_club_address || ''}</p>
            </div>
          </div>
        </div>

        {tournamentInfo?.description && (
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Acerca del Torneo</h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {tournamentInfo.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 