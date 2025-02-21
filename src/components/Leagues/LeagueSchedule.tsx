import { mockMatches } from '@/mocks/leagueData';
import { Calendar, Clock } from 'lucide-react';

interface LeagueScheduleProps {
  leagueId: string;
}

export function LeagueSchedule({ leagueId }: LeagueScheduleProps) {
  // Por ahora usamos datos mock
  const matches = mockMatches;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Calendario de Partidos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <div 
            key={match.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Calendar className="w-4 h-4" />
              <span>{new Date(match.date).toLocaleDateString()}</span>
              <Clock className="w-4 h-4 ml-2" />
              <span>{match.time}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{match.team1_id}</span>
                <span className="text-sm">{match.score?.split('-')[0] || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{match.team2_id}</span>
                <span className="text-sm">{match.score?.split('-')[1] || '-'}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className={`text-sm ${
                match.status === 'pending' ? 'text-blue-600' :
                match.status === 'completed' ? 'text-green-600' :
                'text-gray-600'
              }`}>
                {match.status === 'pending' ? 'Pendiente' :
                 match.status === 'completed' ? 'Completado' :
                 'Cancelado'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 