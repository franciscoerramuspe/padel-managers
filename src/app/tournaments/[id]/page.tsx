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

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="h-full bg-white rounded-xl shadow-sm p-6">
              <TournamentOverview tournament={tournament} />  
            </div>
          </div>

          <div className="h-full">
            <div className="h-full bg-white rounded-xl shadow-sm p-6">
              <TournamentStats 
                tournament={tournament}
                teams={teams}
                tournamentId={params.id as string}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TournamentTeams teams={teams} />
          <div className="space-y-8">
            <TournamentPrizes tournament={tournament} />
            <RulesDownloader 
              tournament={tournament}
              tournamentInfo={{
                rules: tournament.tournament_info?.[0]?.rules || ''
              }}
            />
            <SocialMediaGenerator 
              tournament={tournament}
              tournamentInfo={tournament.tournament_info?.[0]}
            />
          </div>
        </div>

        <div className="space-y-8">
          <TournamentRules tournament={tournament} />
        </div>
      </main>
    </div>
  );
}
