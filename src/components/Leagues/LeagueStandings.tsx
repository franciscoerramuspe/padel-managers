import { mockTeams } from '@/mocks/leagueData';
import { LeagueTeam } from '@/types/league';

interface LeagueStandingsProps {
  leagueId: string;
}

export function LeagueStandings({ leagueId }: LeagueStandingsProps) {
  // Por ahora usamos datos mock
  const teams = mockTeams;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Tabla de Posiciones</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-purple-50 to-purple-100">
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                Pos
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                Equipo
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-purple-800 uppercase tracking-wider">
                PJ
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-purple-800 uppercase tracking-wider">
                PG
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-purple-800 uppercase tracking-wider">
                PP
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-purple-800 uppercase tracking-wider">
                SG
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-purple-800 uppercase tracking-wider">
                SP
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-purple-800 uppercase tracking-wider">
                DG
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-purple-800 uppercase tracking-wider">
                Pts
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams.map((team, index) => (
              <tr key={team.id} 
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-purple-50 transition-colors duration-150`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{team.name}</div>
                    <div className="text-xs text-gray-500">
                      {team.players[0]} - {team.players[1]}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  {team.stats.played}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                  {team.stats.won}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-red-500">
                  {team.stats.lost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                  {team.stats.setsWon}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-red-500">
                  {team.stats.setsLost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                  {team.stats.setsWon - team.stats.setsLost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-purple-700 bg-purple-50 rounded">
                  {team.stats.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
