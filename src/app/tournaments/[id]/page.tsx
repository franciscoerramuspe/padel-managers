'use client';

import { useParams, useRouter } from 'next/navigation';
import { TournamentHeader } from '@/components/Tournaments/TournamentHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useTournaments } from '@/hooks/useTournaments';
import { TournamentOverview } from '@/components/Tournaments/TournamentOverview';
import { TournamentPrizes } from '@/components/Tournaments/TournamentPrizes';
import { TournamentTeams } from '@/components/Tournaments/TournamentTeams';
import { TournamentRules } from '@/components/Tournaments/TournamentRules';
import { TournamentStats } from '@/components/Tournaments/TournamentStats';
import { SocialMediaGenerator } from '@/components/Tournaments/SocialMediaGenerator';
import { RulesDownloader } from '@/components/Tournaments/RulesDownloader';
import { TournamentSchedule } from '@/components/Tournaments/TournamentSchedule';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function TournamentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { tournament, teams, loading } = useTournaments(params.id as string);

  if (loading) return <LoadingSpinner />;
  if (!tournament) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TournamentHeader 
        tournament={tournament}
        onBack={() => router.push('/tournaments')}
      />

      <main className="max-w-7xl mx-auto px-4 -mt-16 relative z-10 sm:px-6 lg:px-8">
        {/* Primera fila: Información General y Estadísticas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 backdrop-blur-sm
                          border border-gray-200 dark:border-gray-700">
              <TournamentOverview tournament={tournament} />
            </div>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 backdrop-blur-sm
                          border border-gray-200 dark:border-gray-700">
              <TournamentStats 
                tournament={tournament}
                teams={teams}
                tournamentId={params.id as string}
              />
            </div>
          </div>
        </div>

        {/* Segunda fila: Horarios */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6
                        border border-gray-200 dark:border-gray-700">
            <TournamentSchedule tournament={tournament} />
          </div>
        </div>

        {/* Tercera fila: Premios */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 
                        dark:from-yellow-900/20 dark:to-yellow-800/20
                        rounded-xl shadow-sm p-6 
                        border border-yellow-200 dark:border-yellow-700">
            <TournamentPrizes tournament={tournament} />
          </div>
        </div>

        {/* Cuarta fila: Equipos */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6
                        border border-gray-200 dark:border-gray-700">
            <TournamentTeams teams={teams} />
          </div>
        </div>

        {/* Quinta fila: Utilidades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6
                        border border-gray-200 dark:border-gray-700">
            <RulesDownloader 
              tournament={tournament}
              tournamentInfo={{
                rules: tournament.tournament_info?.[0]?.rules || ''
              }}
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6
                        border border-gray-200 dark:border-gray-700">
            <SocialMediaGenerator 
              tournament={tournament}
              tournamentInfo={tournament.tournament_info?.[0]}
            />
          </div>
        </div>

        {/* Sexta fila: Reglas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6
                      border border-gray-200 dark:border-gray-700">
          <TournamentRules tournament={tournament} />
        </div>

        <div className="bg-gray-800 dark:bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Estadísticas del Torneo</h2>
          
          <Link 
            href={`/tournaments/${tournament.id}/groups`} 
            className="w-full mt-4"
          >
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              variant="default"
            >
              Ver parejas inscritas
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
