import { LeagueCard } from './LeagueCard';
import { League } from '@/types/league';

export function LeagueList({ leagues }: { leagues: League[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leagues.map((league) => (
        <LeagueCard key={league.id} league={league} />
      ))}
    </div>
  );
} 