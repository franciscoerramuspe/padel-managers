import { Users2, Trophy, UserCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Team {
  id: string;
  player1: {
    id: string;
    name: string;
  };
  player2: {
    id: string;
    name: string;
  };
}

interface LeagueTeamsProps {
  teams: Team[];
  maxTeams: number;
  status: string;
}

export function LeagueTeams({ teams, maxTeams, status }: LeagueTeamsProps) {
  const registeredTeams = teams.length;
  const availableSpots = maxTeams - registeredTeams;
  const registrationProgress = (registeredTeams / maxTeams) * 100;
  const isRegistrationOpen = status === 'Inscribiendo';

  return (
    <div className="space-y-8">
      {/* Header con estado de inscripciones y stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Estado de inscripciones */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-blue-200/20 dark:border-blue-800/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Equipos Registrados
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {registeredTeams} de {maxTeams} equipos
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium 
              ${isRegistrationOpen 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30'
                : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800/30'
              }`}
            >
              {isRegistrationOpen ? 'Inscripciones Abiertas' : 'Inscripciones Cerradas'}
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="space-y-3">
            <Progress 
              value={registrationProgress} 
              className="h-3 bg-gray-100 dark:bg-gray-800/50" 
              indicatorClassName={`${
                registrationProgress === 100
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-500'
              }`}
            />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {registeredTeams} equipos registrados
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {availableSpots} cupos disponibles
              </span>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-2xl p-6 border border-purple-200/20 dark:border-purple-800/20">
          <div className="flex flex-col h-full justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estado</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {registrationProgress === 100 ? 'Completo' : 'En Proceso'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {registrationProgress === 100 
                ? 'Todos los cupos han sido ocupados'
                : `${availableSpots} ${availableSpots === 1 ? 'cupo disponible' : 'cupos disponibles'}`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Lista de equipos */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Users2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          Listado de Parejas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div 
              key={team.id}
              className="group p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 
                        hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 
                        dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 
                        transition-all duration-300 ease-in-out"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Jugador 1</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white pl-7">{team.player1.name}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Jugador 2</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white pl-7">{team.player2.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 