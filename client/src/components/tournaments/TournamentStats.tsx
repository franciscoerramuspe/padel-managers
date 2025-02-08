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
  const MAX_TEAMS = 8;
  const progressPercentage = (teamsCount / MAX_TEAMS) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Estadísticas del Torneo</h2>
        
        <div className="space-y-6">
          {/* Progreso de Inscripciones */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Progreso de Inscripciones</span>
              <span className="text-sm font-semibold text-blue-600">{teamsCount}/{MAX_TEAMS}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Equipos</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{teamsCount}</p>
              <p className="text-sm text-gray-500">equipos inscritos</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Inscripción</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">${tournamentInfo?.inscription_cost}</p>
              <p className="text-sm text-gray-500">por equipo</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Duración</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.ceil((new Date(tournament.end_date).getTime() - new Date(tournament.start_date).getTime()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-sm text-gray-500">días</p>
            </div>

            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-600">Premio</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">${tournamentInfo?.first_place_prize}</p>
              <p className="text-sm text-gray-500">primer lugar</p>
            </div>
          </div>
        </div>

        {/* Botón del Bracket */}
        {teams.length > 0 && (
          <div className="mt-6">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push(`/tournaments/${tournamentId}/draw`)}
            >
              Ver Bracket del Torneo
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 