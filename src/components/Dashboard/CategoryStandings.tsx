import { Standing } from '@/hooks/useStandings';

interface CategoryStandingsProps {
  category: string;
  standings: Standing[];
  isLoading: boolean;
}

export function CategoryStandings({ category, standings, isLoading }: CategoryStandingsProps) {
  if (isLoading) {
    return <div className="text-center py-4">Cargando tabla de posiciones...</div>;
  }

  if (!standings.length) {
    return <div className="text-center py-4">No hay datos disponibles para esta categoría.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Categoría {category}
      </h3>
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pos
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Equipo
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                PJ
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                PG
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                PP
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                SG
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                SP
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                DG
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pts
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {standings.map((standing, index) => (
              <tr 
                key={standing.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {index + 1}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {standing.team ? 
                    `${standing.team.player1.first_name} ${standing.team.player1.last_name} - 
                     ${standing.team.player2.first_name} ${standing.team.player2.last_name}` : 
                    'Equipo no disponible'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-gray-100">
                  {standing.games_played}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600 dark:text-green-400">
                  {standing.wins}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-medium text-red-600 dark:text-red-400">
                  {standing.losses}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-gray-100">
                  {standing.sets_won}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-gray-100">
                  {standing.sets_lost}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-gray-100">
                  {standing.sets_difference}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-semibold text-blue-600 dark:text-blue-400">
                  {standing.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 