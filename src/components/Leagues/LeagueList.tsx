import { LeagueCard } from './LeagueCard';
import { League } from '@/types/league';
import { Category } from '@/hooks/useCategories';

interface LeagueListProps {
  leagues: League[];
  categories: Category[];
}

export function LeagueList({ leagues, categories }: LeagueListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leagues.map((league) => (
        <LeagueCard key={league.id} league={league} categories={categories} />
      ))}
    </div>
  );
} 