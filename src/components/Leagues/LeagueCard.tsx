import { Calendar, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { League } from '@/types/league';

export function LeagueCard({ league }: { league: League }) {
  return (
    <Link href={`/leagues/${league.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{league.name}</h3>
            <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-md">
              {league.category}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            league.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
            league.status === 'in_progress' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {league.status === 'upcoming' ? 'Próxima' :
             league.status === 'in_progress' ? 'En curso' :
             'Finalizada'}
          </span>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Inicio: {new Date(league.start_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Equipos: {league.teams_count}/{league.max_teams}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{league.schedule} ({league.frequency})</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 