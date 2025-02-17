import { Shield } from "lucide-react";
import { TournamentBracket } from "../TournamentsOld/TournamentBracket";

interface AdminPanelProps {
  teams: any[];
  matches: any[];
  onGenerateBracket: () => void;
}

export function AdminPanel({ teams, matches, onGenerateBracket }: AdminPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Panel de Administración</h2>
        </div>
        {teams.length === 8 && !matches.length && (
          <button
            onClick={onGenerateBracket}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generar Bracket
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Equipos Inscritos ({teams.length}/8)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team: any) => (
              <div 
                key={team.team_id}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="text-sm text-gray-600">
                  <p>Jugador 1: {team.player1?.first_name} {team.player1?.last_name}</p>
                  <p>Jugador 2: {team.player2?.first_name} {team.player2?.last_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {matches.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Bracket del Torneo</h3>
            <TournamentBracket 
              matches={matches} 
              format="single_elimination"
            />
          </div>
        )}
      </div>
    </div>
  );
} 