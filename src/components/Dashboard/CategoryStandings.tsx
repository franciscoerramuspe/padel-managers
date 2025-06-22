import { Standing } from '@/hooks/useStandings';
import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyStandings } from './EmptyStandings';

interface CategoryStandingsProps {
  category: string;
  standings: Standing[];
  isLoading: boolean;
}

const HeaderWithTooltip = ({ short, full }: { short: string; full: string }) => (
  <Tooltip.Provider delayDuration={100}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-help">
          {short}
        </th>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-white shadow-md animate-in fade-in duration-200"
          sideOffset={5}
        >
          {full}
          <Tooltip.Arrow className="fill-gray-100 dark:fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export function CategoryStandings({ category, standings, isLoading }: CategoryStandingsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          Cargando tabla de posiciones...
        </p>
      </div>
    );
  }

  if (!standings.length) {
    return <EmptyStandings message={`No hay datos disponibles para la categoría ${category}.`} />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Categoría {category}
      </h3>
      <div className="w-full overflow-x-auto rounded-lg bg-white dark:bg-gray-900 p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <HeaderWithTooltip short="Pos" full="Posición" />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Equipo
              </th>
              <HeaderWithTooltip short="PJ" full="Partidos Jugados" />
              <HeaderWithTooltip short="PG" full="Partidos Ganados" />
              <HeaderWithTooltip short="PP" full="Partidos Perdidos" />
              <HeaderWithTooltip short="SG" full="Sets Ganados" />
              <HeaderWithTooltip short="SP" full="Sets Perdidos" />
              <HeaderWithTooltip short="DG" full="Diferencia de Sets" />
              <HeaderWithTooltip short="Pts" full="Puntos Totales" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {standings.map((standing, index) => (
              <tr 
                key={standing.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap text-2xl font-bold font-orbitron text-green-600 dark:text-green-400">
                  {index + 1}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                  {standing.team ? 
                    `${standing.team.player1.first_name} ${standing.team.player1.last_name} - 
                     ${standing.team.player2.first_name} ${standing.team.player2.last_name}` : 
                    'Equipo no disponible'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-2xl text-center font-orbitron text-green-600 dark:text-green-400">
                  {standing.games_played}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-2xl text-center font-orbitron text-green-600 dark:text-green-400">
                  {standing.wins}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-2xl text-center font-orbitron text-red-600 dark:text-red-500">
                  {standing.losses}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-2xl text-center font-orbitron text-green-600 dark:text-green-400">
                  {standing.sets_won}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-2xl text-center font-orbitron text-red-600 dark:text-red-500">
                  {standing.sets_lost}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-2xl text-center font-orbitron text-green-600 dark:text-green-400">
                  {standing.sets_difference}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-3xl text-center font-orbitron font-bold text-green-600 dark:text-green-400">
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