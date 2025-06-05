interface Match {
  id: number;
  category: string;
  team1: string;
  team2: string;
  dateTime: string;
  court: string;
}

interface LeagueScheduleCardProps {
  matches: Match[];
}

export function LeagueScheduleCard({ matches }: LeagueScheduleCardProps) {
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return new Intl.DateTimeFormat('es', {  
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Limitamos a mostrar solo los primeros 8 partidos
  const displayMatches = matches.slice(0, 8);

  return (
    <div className="bg-slate-800/50 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100">
          Próximos Partidos
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {displayMatches.map((match) => (
          <div 
            key={match.id}
            className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-400 bg-purple-400/10 px-2 py-1 rounded">
                {match.category}
              </span>
              <span className="text-sm text-gray-400 bg-gray-400/10 px-2 py-1 rounded">
                {match.court}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-base font-medium text-gray-100">
                {match.team1} vs {match.team2}
              </p>
              <p className="text-sm text-gray-400">
                {formatDateTime(match.dateTime)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 