interface Standing {
  position: number;
  name: string;
  played: number;
  won: number;
  lost: number;
  setsWon: number;
  setsLost: number;
  setsDiff: number;
  points: number;
}

interface CategoryStandingsProps {
  category: string;
  standings: Standing[];
}

export function CategoryStandings({ category, standings }: CategoryStandingsProps) {
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
            {standings.map((team) => (
              <tr 
                key={team.name}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {team.position}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {team.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-gray-100">
                  {team.played}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600 dark:text-green-400">
                  {team.won}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-medium text-red-600 dark:text-red-400">
                  {team.lost}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-gray-100">
                  {team.setsWon}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-gray-100">
                  {team.setsLost}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-gray-100">
                  {team.setsDiff}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-semibold text-blue-600 dark:text-blue-400">
                  {team.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 