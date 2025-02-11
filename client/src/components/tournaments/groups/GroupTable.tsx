import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Team {
  id: string;
  name: string;
  players: string[];
  stats: {
    played: number;
    won: number;
    lost: number;
    points: number;
  };
}

interface GroupTableProps {
  groupIndex: number;
  teams: Team[];
  matches: any[];
  onUpdateMatch: (match: any) => void;
}

export function GroupTable({ groupIndex, teams, matches, onUpdateMatch }: GroupTableProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={`group-${groupIndex}`} className="border-none">
        <AccordionTrigger className="w-full bg-blue-600 px-6 py-4 rounded-t-xl hover:no-underline">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold text-white">Grupo {groupIndex + 1}</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent className="bg-white rounded-b-xl shadow-sm pt-0">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Equipo</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">PJ</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">PG</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">PP</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, index) => (
                    <tr key={team.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{team.name}</p>
                            <p className="text-gray-500">{team.players.join(' / ')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4 text-sm text-gray-600">{team.stats.played}</td>
                      <td className="text-center py-3 px-4 text-sm text-gray-600">{team.stats.won}</td>
                      <td className="text-center py-3 px-4 text-sm text-gray-600">{team.stats.lost}</td>
                      <td className="text-center py-3 px-4 text-sm font-medium text-gray-900">{team.stats.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Partidos</h4>
              <div className="space-y-3">
                {matches.map((match, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{match.team1}</span>
                      <span className="text-sm font-medium text-gray-900">vs</span>
                      <span className="text-sm text-gray-600">{match.team2}</span>
                    </div>
                    <button 
                      onClick={() => onUpdateMatch(match)}
                      className="mt-2 w-full px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Actualizar Resultado
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
} 