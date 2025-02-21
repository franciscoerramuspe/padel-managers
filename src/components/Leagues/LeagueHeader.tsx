import { ArrowLeft } from 'lucide-react';
import { League } from '@/types/league';

interface LeagueHeaderProps {
  league: League;
  onBack: () => void;
}

export function LeagueHeader({ league, onBack }: LeagueHeaderProps) {
  return (
    <div className="relative">
      {/* Banner con gradiente */}
      <div className="relative h-[300px]">
        <div className="h-full bg-gradient-to-r from-purple-600 to-purple-800" />
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Contenido del header */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a ligas
          </button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              {league.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-100 text-sm font-medium border border-purple-400/20">
                {league.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                league.status === 'upcoming' 
                  ? 'bg-blue-500/20 text-blue-100 border border-blue-400/20' 
                  : league.status === 'in_progress'
                  ? 'bg-green-500/20 text-green-100 border border-green-400/20'
                  : 'bg-gray-500/20 text-gray-100 border border-gray-400/20'
              }`}>
                {league.status === 'upcoming' ? 'Próxima' : 
                 league.status === 'in_progress' ? 'En Curso' : 
                 'Finalizada'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 