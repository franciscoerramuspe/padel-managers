import Link from 'next/link';
import TournamentCard from './TournamentCard';
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
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}
    </div>
  );
}; 