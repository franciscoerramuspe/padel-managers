interface Player {
  first_name: string;
  last_name: string;
}

interface Team {
  team_id: string;
  player1: Player;
  player2: Player;
}

interface DrawTeamsListProps {
  teams: Team[];
}

export function DrawTeamsList({ teams }: DrawTeamsListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Equipos Participantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teams.map((team) => (
            <div 
              key={team.team_id}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="space-y-2">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {team.player1.first_name} {team.player1.last_name}
                  </p>
                  <p className="text-gray-500">Jugador 1</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {team.player2.first_name} {team.player2.last_name}
                  </p>
                  <p className="text-gray-500">Jugador 2</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 