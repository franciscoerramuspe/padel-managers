import { Users, Shield } from 'lucide-react';

interface TournamentTeamsProps {
  teams: any[]; // TODO: Add proper type
}

export function TournamentTeams({ teams }: TournamentTeamsProps) {
  const MAX_TEAMS = 12;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-7 w-7 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Equipos</h2>
          </div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            {teams.length}/{MAX_TEAMS}
          </span>
        </div>

        <div className="space-y-4">
          {teams.map((teamEntry) => (
            <div key={teamEntry.team_id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-grow">
                <div className="text-sm text-gray-900">
                  {`${teamEntry.teams.player1?.first_name} ${teamEntry.teams.player1?.last_name} / 
                    ${teamEntry.teams.player2?.first_name} ${teamEntry.teams.player2?.last_name}`}
                </div>
              </div>
            </div>
          ))}

          {/* Espacios vacíos para equipos faltantes */}
          {teams.length < MAX_TEAMS && Array.from({ length: MAX_TEAMS - teams.length }).map((_, index) => (
            <div key={`empty-${index}`} className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-grow">
                <p className="text-sm text-gray-400">Equipo pendiente</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 