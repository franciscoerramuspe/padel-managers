'use client';

import { useParams } from 'next/navigation';
import { useTournaments } from '@/hooks/useTournaments';
import { DrawBracket } from '@/components/Tournaments/DrawBracket';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

export default function TournamentBracketFullPage() {
  const params = useParams();
  const { tournament, matches, teams, loading, generateBracket } = useTournaments(params.id as string);

  if (loading) return <LoadingSpinner />;
  if (!tournament || !teams) return null;

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {tournament.name}
              </h1>
              <p className="text-sm text-gray-500">Bracket del Torneo</p>
            </div>
            <Link
              href={`/tournaments/${params.id}/draw`}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
              Volver
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-1 bg-gray-50">
        <div className="w-80 bg-white border-r border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Equipos Participantes</h2>
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                {teams.length}/8
              </span>
            </div>
            <div className="space-y-2 mb-6">
              {teams.map((team, index) => (
                <div 
                  key={team.team_id} 
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {team.player1.first_name} {team.player1.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {team.player2.first_name} {team.player2.last_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={generateBracket}
              disabled={teams.length !== 8}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {teams.length === 8 ? 'Generar cruces de partidos' : `Faltan ${8 - teams.length} equipos`}
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <div className="h-[600px] w-full bg-white rounded-lg shadow-sm border border-gray-200">
            <DrawBracket 
              matches={matches} 
              fullScreen 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 