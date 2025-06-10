import { mockTeams } from '@/mocks/leagueData';
import { LeagueTeam } from '@/types/league';

interface LeagueStandingsProps {
  leagueId: string;
}

export function LeagueStandings({ leagueId }: LeagueStandingsProps) {
  // Por ahora usamos datos mock
  const teams = mockTeams;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tabla de Posiciones</h2>
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-[#1D283A]">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-[#1D283A]">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#1D283A]">
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Pos
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Equipo
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                PJ
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                PG
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                PP
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                SG
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                SP
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                DG
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Pts
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-[#1D283A]">
            {teams.map((team, index) => (
              <tr key={team.id} 
                  className="hover:bg-gray-50 dark:hover:bg-[#1D283A]/50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{team.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {team.players[0]} - {team.players[1]}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                  {team.stats.played}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600 dark:text-green-400">
                  {team.stats.won}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-red-600 dark:text-red-400">
                  {team.stats.lost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600 dark:text-green-400">
                  {team.stats.setsWon}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-red-600 dark:text-red-400">
                  {team.stats.setsLost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-gray-300">
                  {team.stats.setsWon - team.stats.setsLost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-purple-700 dark:text-purple-400">
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
