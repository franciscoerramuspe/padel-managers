import { Category, Tournament } from '@/types/tournament';
import { formatDate } from '@/utils/date';
import { getCategoryName } from '@/utils/category';
import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';
import Image from 'next/image';

interface TournamentCardProps {
  tournament: Tournament;
  categories: Category[];
}

export const TournamentCard = ({ tournament, categories }: TournamentCardProps) => {
  return (
    <Link
      href={`/tournaments/${tournament.id}`}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      <div className="relative h-48">
        {tournament.tournament_info[0]?.tournament_thumbnail ? (
          <Image
            src={tournament.tournament_info[0].tournament_thumbnail}
            alt={tournament.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400">Sin imagen</div>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium shadow-sm">
            {tournament.status === 'upcoming' ? 'Próximo' :
             tournament.status === 'in_progress' ? 'En Curso' : 'Finalizado'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {tournament.name}
        </h2>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {getCategoryName(tournament.category_id, categories)}
          </span>
        </div>

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
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{tournament.tournament_info[0].tournament_club_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">
                  {tournament.tournament_teams?.length || 0} equipos inscritos
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}; 