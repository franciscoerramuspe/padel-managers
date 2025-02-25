import { Users, Calendar, DollarSign, Trophy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface TournamentStatsProps {
  tournament: any; // TODO: Add proper type
  teams: any[];
  tournamentId: string;
}

export function TournamentStats({ tournament, teams, tournamentId }: TournamentStatsProps) {
  const router = useRouter();
  const tournamentInfo = tournament.tournament_info?.[0];
  const teamsCount = tournament.tournament_teams?.length || 0;
  const MAX_TEAMS = 12;
  const progressPercentage = (teamsCount / MAX_TEAMS) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Estadísticas del Torneo</h2>
        
        <div className="space-y-6">
          {/* Progreso de Inscripciones */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Progreso de Inscripciones</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{teamsCount}/{MAX_TEAMS}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Equipos inscritos</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{teamsCount}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Duración</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.ceil((new Date(tournament.end_date).getTime() - new Date(tournament.start_date).getTime()) / (1000 * 60 * 60 * 24))} días
              </span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Premio</span>
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                ${tournamentInfo?.first_place_prize || '0'}
              </span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Inscripción</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${tournamentInfo?.inscription_cost || '0'}
              </span>
            </div>
          </div>

          {/* Botón de Ver Parejas */}
          <button
            onClick={() => router.push(`/tournaments/${tournamentId}/teams`)}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            Ver parejas inscritas
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 