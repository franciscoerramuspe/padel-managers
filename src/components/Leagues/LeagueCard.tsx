import { Calendar, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { League } from '@/types/league';
import { Category } from '@/hooks/useCategories';
import { getCategoryName } from '@/utils/category';

interface LeagueCardProps {
  league: League;
  categories: Category[];
}

export function LeagueCard({ league, categories }: LeagueCardProps) {
  const categoryName = getCategoryName(league.category_id, categories);

  return (
    <Link href={`/leagues/${league.id}`}>
      <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-md dark:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{league.name}</h3>
            <span className="inline-block mt-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-sm rounded-md">
              {categoryName}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            league.status === 'upcoming' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' :
            league.status === 'in_progress' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
            'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
          }`}>
            {league.status === 'upcoming' ? 'Próxima' :
             league.status === 'in_progress' ? 'En curso' :
             'Finalizada'}
          </span>
        </div>

        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Inicio: {new Date(league.start_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Equipos: {league.team_size || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{league.frequency}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 