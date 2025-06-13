import { CalendarDays, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";

interface Match {
  id: string;
  category_id: string;
  category_name: string;
  team1: string;
  team2: string;
  match_date: string;
  court: string;
  status: "SCHEDULED" | "COMPLETED" | "WALKOVER";
  team1_sets1_won: number;
  team1_sets2_won: number;
  team2_sets1_won: number;
  team2_sets2_won: number;
}

interface LeagueScheduleCardProps {
  leagueId?: string;
}

export function LeagueScheduleCard({ leagueId }: LeagueScheduleCardProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching matches with leagueId:', leagueId);
        
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const url = `${baseUrl}/leagues/matches/league/${leagueId || 'all'}`;
        console.log('Fetching from URL:', url);

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('Response error:', {
            status: response.status,
            statusText: response.statusText,
            errorData
          });
          throw new Error(
            errorData?.message || 
            `Error al cargar los partidos: ${response.status} ${response.statusText}`
          );
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        if (!data) {
          throw new Error('No se recibieron datos del servidor');
        }

        const pendingMatches = Array.isArray(data.pending) ? data.pending : [];
        
        const scheduledMatches = pendingMatches
          .filter((match: Match) => match.status === "SCHEDULED")
          .sort((a: Match, b: Match) => 
            new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
          );
        
        console.log('Scheduled matches:', scheduledMatches);
        setMatches(scheduledMatches);
      } catch (err) {
        console.error('Error in fetchMatches:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [leagueId]);

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      time: new Intl.DateTimeFormat('es', {  
        hour: '2-digit',
        minute: '2-digit'
      }).format(date),
      date: new Intl.DateTimeFormat('es', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      }).format(date)
    };
  };

  // Limitamos a mostrar solo los primeros 8 partidos
  const displayMatches = matches.slice(0, 8);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 min-h-[200px] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 p-4">
        <p className="text-red-500 dark:text-red-400 text-center">
          {error}
        </p>
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="bg-white dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 p-4">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Próximos Partidos
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No hay partidos programados
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700/50">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Próximos Partidos
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6 p-6">
        {displayMatches.map((match) => (
          <div 
            key={match.id}
            className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1D283A]/80 dark:to-[#1D283A] 
                     rounded-2xl p-5 hover:shadow-xl transition-all duration-300
                     border border-gray-200/50 dark:border-gray-700/30
                     backdrop-blur-sm"
          >
            {/* Categoría Badge */}
            <div className="absolute -top-3 left-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium
                           bg-gradient-to-r from-purple-500 to-purple-600 
                           text-white shadow-lg shadow-purple-500/30
                           dark:from-purple-600 dark:to-purple-700
                           dark:shadow-purple-900/30">
                {match.category_name}
              </span>
            </div>

            {/* Court Badge */}
            <div className="absolute -top-3 right-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium
                           bg-gray-900/5 dark:bg-white/5 
                           text-gray-700 dark:text-gray-300
                           border border-gray-200/50 dark:border-gray-700/30">
                {match.court || 'Sin asignar'}
              </span>
            </div>

            {/* Match Content */}
            <div className="mt-4 space-y-6">
              {/* Teams */}
              <div className="space-y-4">
                {/* Team 1 */}
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate" title={match.team1}>
                      {match.team1}
                    </p>
                  </div>
                </div>

                {/* VS Divider */}
                <div className="flex items-center justify-center">
                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700/30"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 text-sm font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 
                                   text-white rounded-full py-1 shadow-lg shadow-emerald-500/20
                                   dark:shadow-emerald-900/30">
                        VS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team 2 */}
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate" title={match.team2}>
                      {match.team2}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/30">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {formatDateTime(match.match_date).time}h
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {formatDateTime(match.match_date).date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 