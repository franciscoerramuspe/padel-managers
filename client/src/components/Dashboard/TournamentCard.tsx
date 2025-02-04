import Link from 'next/link';
import Image from 'next/image';
import { Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tournament } from '@/types/tournament';

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  return (
    <Link
      href={`/tournaments/${tournament.id}`}
      className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
    >
      <div className="relative h-[430px] w-full">
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
  );
};

export default TournamentCard;
