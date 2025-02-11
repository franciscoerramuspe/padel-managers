import { Shield, Users, Trophy, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface TournamentAdminPanelProps {
  tournament: any;
  teams: any[];
}

export function TournamentAdminPanel({ tournament, teams }: TournamentAdminPanelProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-blue-50 p-4 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-blue-900">Panel de Administración</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-gray-600" />
              <h3 className="font-medium">Estado de Inscripciones</h3>
            </div>
            <p className="text-2xl font-bold">{teams.length}/8</p>
            <p className="text-sm text-gray-500">equipos inscritos</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-gray-600" />
              <h3 className="font-medium">Estado del Torneo</h3>
            </div>
            <p className="text-lg font-medium">
              {tournament.status === 'upcoming' ? 'Por comenzar' :
               tournament.status === 'in_progress' ? 'En curso' :
               'Finalizado'}
            </p>
          </div>
        </div>

        {teams.length === 8 && (
          <Button 
            onClick={() => router.push(`/tournaments/${tournament.id}/draw`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Gestionar Bracket del Torneo
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
} 