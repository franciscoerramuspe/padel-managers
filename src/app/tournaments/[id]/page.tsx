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

export default function TournamentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { tournament, teams, loading } = useTournaments(params.id as string);

  if (loading) return <LoadingSpinner />;
  if (!tournament) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <TournamentHeader 
        tournament={tournament}
        onBack={() => router.push('/tournaments')}
      />

      <main className="max-w-7xl mx-auto px-4 -mt-16 relative z-10 sm:px-6 lg:px-8">
        {/* Primera fila: Información General y Estadísticas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 backdrop-blur-sm">
              <TournamentOverview tournament={tournament} />
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 backdrop-blur-sm">
              <TournamentStats 
                tournament={tournament}
                teams={teams}
                tournamentId={params.id as string}
              />
            </div>
          </div>
        </div>

        {/* Segunda fila: Horarios (horizontal) */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <TournamentSchedule tournament={tournament} />
          </div>
        </div>

        {/* Tercera fila: Premios */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm p-6 border border-yellow-200">
            <TournamentPrizes tournament={tournament} />
          </div>
        </div>

        {/* Cuarta fila: Equipos (ancho completo) */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <TournamentTeams teams={teams} />
          </div>
        </div>

        {/* Quinta fila: Utilidades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <RulesDownloader 
              tournament={tournament}
              tournamentInfo={{
                rules: tournament.tournament_info?.[0]?.rules || ''
              }}
            />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <SocialMediaGenerator 
              tournament={tournament}
              tournamentInfo={tournament.tournament_info?.[0]}
            />
          </div>
        </div>

        {/* Sexta fila: Reglas */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <TournamentRules tournament={tournament} />
        </div>
      </main>
    </div>
  );
}
