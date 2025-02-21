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
      <h2 className="text-xl font-bold mb-6">Tabla de Posiciones</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pos
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipo
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                PJ
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                PG
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                PP
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                SG
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                SP
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                DG
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pts
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams.map((team, index) => (
              <tr key={team.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {team.stats.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{team.name}</div>
                    <div className="text-sm text-gray-500">
                      {team.players.player1} - {team.players.player2}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  {team.stats.played_matches}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  {team.stats.won_matches}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  {team.stats.lost_matches}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  {team.stats.sets_won}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  {team.stats.sets_lost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  {team.stats.sets_difference}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
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