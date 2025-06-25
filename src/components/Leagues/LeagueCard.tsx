import { Calendar, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { League } from '@/types/league';
import { Category } from '@/hooks/useCategories';
import { getCategoryName } from '@/utils/category';
import { Progress } from '@/components/ui/progress';

interface LeagueCardProps {
  league: League;
  categories: Category[];
}

export function LeagueCard({ league, categories }: LeagueCardProps) {
  const categoryName = getCategoryName(league.category_id, categories);
  const registeredTeams = league.registeredTeams || 0;
  const registrationProgress = (registeredTeams / league.team_size) * 100;
  const availableSpots = league.team_size - registeredTeams;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Inscribiendo':
        return 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300';
      case 'Activa':
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
      case 'Finalizada':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Inscribiendo':
        return 'Inscripciones abiertas';
      case 'Activa':
        return 'En Curso';
      case 'Finalizada':
        return 'Finalizada';
      default:
        return status;
    }
  };

  return (
    <Link href={`/leagues/${league.id}`}>
      <div className="relative bg-white dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-md dark:shadow-lg transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 group">
        {/* Estado de la liga (badge flotante) */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(league.status)}`}>
            {getStatusText(league.status)}
          </span>
        </div>

        {/* Imagen de la liga */}
        {league.image_url && (
          <div className="relative aspect-square w-full mb-6">
            <Image
              src={league.image_url}
              alt={league.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Encabezado */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Categoría
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
              {categoryName}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
            {league.name}
          </h3>
        </div>

        {/* Información principal */}
        <div className="space-y-4">
          {/* Fecha de inicio */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de inicio</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(league.start_date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Equipos y progreso */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Equipos registrados
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {registeredTeams} / {league.team_size}
              </span>
            </div>

            <div className="space-y-2">
              <Progress 
                value={registrationProgress} 
                className="h-2 bg-gray-100 dark:bg-gray-700" 
                indicatorClassName={`${
                  registrationProgress === 100
                    ? 'bg-blue-500 dark:bg-blue-600'
                    : 'bg-emerald-500 dark:bg-emerald-600'
                }`}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {registrationProgress}% completado
                </span>
                {league.status === 'Inscribiendo' && availableSpots > 0 ? (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {availableSpots} cupos disponibles
                  </span>
                ) : registeredTeams === league.team_size && (
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Cupos completos
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Frecuencia */}
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Frecuencia: {league.frequency === 'biweekly' ? 'Quincenal' : league.frequency}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 