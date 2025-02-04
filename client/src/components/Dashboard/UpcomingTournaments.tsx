import Link from 'next/link';
import Image from 'next/image';
import { Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tournament } from '@/types/tournament';

interface UpcomingTournamentsProps {
  tournaments: Tournament[];
}

export const UpcomingTournaments = ({ tournaments }: UpcomingTournamentsProps) => {
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming').slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Próximos Torneos</h2>
        <Link 
          href="/tournaments" 
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Ver todos
        </Link>
      </div>

      {upcomingTournaments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No hay torneos próximos
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingTournaments.map((tournament) => (
            <Link
              key={tournament.id}
              href={`/tournaments/${tournament.id}`}
              className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="relative h-40">
                {tournament.tournament_info[0]?.tournament_thumbnail ? (
                  <Image
                    src={tournament.tournament_info[0].tournament_thumbnail}
                    alt={tournament.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {tournament.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(tournament.start_date), 'dd MMM yyyy', { locale: es })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}; 