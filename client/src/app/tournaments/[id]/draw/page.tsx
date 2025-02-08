'use client';

import { useParams } from 'next/navigation';
import { useTournaments } from '@/hooks/useTournaments';
import { TournamentBracket } from '@/components/Tournaments/TournamentBracket';
import { DrawHeader } from '@/components/Tournaments/DrawHeader';
import { DrawStats } from '@/components/Tournaments/DrawStats';
import { DrawTeamsList } from '@/components/Tournaments/DrawTeamsList';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function TournamentDrawPage() {
  const params = useParams();
  const { tournament, teams, matches, loading, generateBracket } = useTournaments(params.id as string);

  if (loading) return <LoadingSpinner />;
  if (!tournament) return null;

  const canGenerateBracket = teams.length === 8 && matches.length === 0;
  const status = matches.length === 0 ? 'Por Generar' : 'En Curso';

  return (
    <div className="min-h-screen bg-gray-50">
      <DrawHeader 
        tournamentName={tournament.name}
        tournamentId={params.id as string}
        canGenerateBracket={canGenerateBracket}
        onGenerateBracket={generateBracket}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <DrawStats 
            teamsCount={teams.length}
            matchesCount={matches.length}
            status={status}
          />

          <DrawTeamsList teams={teams} />

          {matches.length > 0 ? (
            <TournamentBracket 
              matches={matches}
              format="single_elimination"
              tournamentId={params.id as string}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No hay bracket generado
              </h2>
              <p className="text-gray-500 mb-4">
                {teams.length < 8 
                  ? 'Espera a que se completen las inscripciones para generar el bracket.'
                  : 'Ya puedes generar el bracket del torneo.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 