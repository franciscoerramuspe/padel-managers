import Link from 'next/link';
import TournamentCard from './TournamentCard';
import { Tournament } from '@/types/tournament';

interface UpcomingTournamentsProps {
  tournaments: Tournament[];
}

export function UpcomingTournaments({ tournaments }: UpcomingTournamentsProps) {
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming').slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Próximos Torneos
        </h2>
        <Link 
          href="/tournaments"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          Ver todos
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <TournamentCard 
            key={tournament.id}
            tournament={tournament}
          />
        ))}
      </div>
    </div>
  );
} 