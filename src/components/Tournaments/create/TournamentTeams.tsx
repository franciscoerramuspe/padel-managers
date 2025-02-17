import { Users } from 'lucide-react';

interface Team {
  teams: {
    id: string;
    player1_id: string;
    player2_id: string;
    created_at: string;
    updated_at: string;
  };
  team_id: string;
}

interface TournamentTeamsProps {
  teams: Team[];
}

export default function TournamentTeams({ teams }: TournamentTeamsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Equipos Inscritos ({teams.length}/8)</h3>
        <span className="text-sm text-gray-500">
          {teams.length === 8 ? 'Cupo completo' : `Faltan ${8 - teams.length} equipos`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <div 
            key={team.team_id}
            className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Equipo {team.teams.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500">
                  Jugadores: {team.teams.player1_id.slice(0, 8)}, {team.teams.player2_id.slice(0, 8)}
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(team.teams.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}

        {/* Placeholder slots for remaining teams */}
        {teams.length < 8 && Array.from({ length: 8 - teams.length }).map((_, index) => (
          <div 
            key={`empty-${index}`}
            className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex items-center justify-center"
          >
            <p className="text-gray-400">Equipo pendiente</p>
          </div>
        ))}
      </div>
    </div>
  );
}