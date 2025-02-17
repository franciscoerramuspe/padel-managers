interface Match {
    id?: string;
    tournament_id: string;
    home_team_id: string | null;
    away_team_id: string | null;
    match_day: string;
    start_time: string;
    status: string;
    round: number;
    score?: string;
  }
  
  interface TournamentBracketProps {
    matches: Match[];
  }
  
  export default function TournamentBracket({ matches }: TournamentBracketProps) {
    // Organizar partidos por ronda
    const matchesByRound = matches.reduce((acc, match) => {
      if (!acc[match.round]) {
        acc[match.round] = [];
      }
      acc[match.round].push(match);
      return acc;
    }, {} as Record<number, Match[]>);
  
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px] p-4">
          <div className="flex justify-between gap-8">
            {/* Cuartos de final */}
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-4">Cuartos de Final</h4>
              <div className="space-y-4">
                {matchesByRound[1]?.map((match) => (
                  <div 
                    key={match.id} 
                    className="border rounded-lg p-3 bg-white shadow-sm"
                  >
                    <div className="text-xs text-gray-500 mb-2">
                      {new Date(match.match_day).toLocaleDateString()} - {match.start_time}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{match.home_team_id?.slice(0, 8) || 'TBD'}</span>
                        <span className="text-sm">{match.score?.split('-')[0] || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{match.away_team_id?.slice(0, 8) || 'TBD'}</span>
                        <span className="text-sm">{match.score?.split('-')[1] || '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Semifinales */}
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-4">Semifinales</h4>
              <div className="space-y-4">
                {matchesByRound[2]?.map((match) => (
                  <div 
                    key={match.id} 
                    className="border rounded-lg p-3 bg-white shadow-sm"
                  >
                    <div className="text-xs text-gray-500 mb-2">
                      {match.match_day ? new Date(match.match_day).toLocaleDateString() : 'Fecha por definir'} 
                      {match.start_time ? ` - ${match.start_time}` : ''}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{match.home_team_id?.slice(0, 8) || 'Por definir'}</span>
                        <span className="text-sm">{match.score?.split('-')[0] || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{match.away_team_id?.slice(0, 8) || 'Por definir'}</span>
                        <span className="text-sm">{match.score?.split('-')[1] || '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Final */}
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-4">Final</h4>
              {matchesByRound[3]?.map((match) => (
                <div 
                  key={match.id} 
                  className="border rounded-lg p-3 bg-white shadow-sm"
                >
                  <div className="text-xs text-gray-500 mb-2">
                    {match.match_day ? new Date(match.match_day).toLocaleDateString() : 'Fecha por definir'}
                    {match.start_time ? ` - ${match.start_time}` : ''}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{match.home_team_id?.slice(0, 8) || 'Por definir'}</span>
                      <span className="text-sm">{match.score?.split('-')[0] || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{match.away_team_id?.slice(0, 8) || 'Por definir'}</span>
                      <span className="text-sm">{match.score?.split('-')[1] || '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }