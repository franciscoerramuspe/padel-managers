import { CalendarDays, Clock, MapPin } from "lucide-react";

interface Match {
  id: number;
  category: string;
  team1: string;
  team2: string;
  dateTime: string;
  court: string;
  status: "SCHEDULED" | "COMPLETED" | "WALKOVER";
  team1_sets_won?: number;
  team2_sets_won?: number;
}

interface LeagueScheduleCardProps {
  matches: Match[];
}

export function LeagueScheduleCard({ matches }: LeagueScheduleCardProps) {
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

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700/50">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Próximos Partidos
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {displayMatches.map((match) => (
          <div 
            key={match.id}
            className="bg-gray-50 dark:bg-[#1D283A]/30 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-[#1D283A]/50 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-400/10 px-2 py-1 rounded">
                {match.category}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-400/10 px-2 py-1 rounded">
                {match.court}
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2 items-center">
                <div className="col-span-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 text-right md:text-left">
                    {match.team1}
                  </p>
                </div>

                <div className="col-span-1 flex flex-col items-center justify-center">
                  {match.status === "COMPLETED" ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1 bg-[#0B1120] rounded-xl p-2 min-w-[90px] justify-center shadow-lg">
                        <div className="flex gap-2">
                          {[match.team1_sets_won || 0, match.team2_sets_won || 0].map((score, idx) => (
                            <div 
                              key={idx}
                              className="w-8 h-10 flex items-center justify-center bg-[#1D283A] rounded-lg text-emerald-400 font-mono text-2xl font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] border border-emerald-500/20"
                              style={{ 
                                fontFamily: 'JetBrains Mono, monospace',
                                textShadow: '0 0 10px rgba(52,211,153,0.3)'
                              }}
                            >
                              {score}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-1 text-[10px] text-emerald-500/80 dark:text-emerald-400/80 font-mono uppercase tracking-widest">
                        Sets
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      VS
                    </span>
                  )}
                </div>

                <div className="col-span-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 text-left md:text-right">
                    {match.team2}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-[#1D283A]">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDateTime(match.dateTime).time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  <span>{formatDateTime(match.dateTime).date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 