'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { League, LeagueMatch } from '@/types/league';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { LeagueHeader } from '@/components/Leagues/LeagueHeader';
import { LeagueStandings } from '@/components/Leagues/LeagueStandings';
import { LeagueRounds } from '@/components/Leagues/LeagueRounds';
import { LeagueMatchResults } from '@/components/Leagues/LeagueMatchResults';
import { mockLeagues, mockMatches } from '@/mocks/leagueData';

export default function LeagueDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedRound, setSelectedRound] = useState(1);
  
  // Por ahora usamos data mockeada
  const league = mockLeagues.find(l => l.id === params.id);
  
  if (!league) return <LoadingSpinner />;

  const handleSaveResults = (results: LeagueMatch[]) => {
    // TODO: Integrar con backend
    console.log('Saving results:', results);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LeagueHeader 
        league={league}
        onBack={() => router.push('/leagues')}
      />

      <main className="max-w-7xl mx-auto px-4 -mt-16 relative z-10 sm:px-6 lg:px-8">
        {/* Primera fila: Información General y Estadísticas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Información General</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Categoría</h3>
                  <p className="mt-1">{league.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Horario</h3>
                  <p className="mt-1">{league.schedule}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Frecuencia</h3>
                  <p className="mt-1">{league.frequency}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Estado de la Liga</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Equipos</h3>
                  <p className="mt-1">{league.teams_count}/{league.max_teams}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Inicio</h3>
                  <p className="mt-1">{new Date(league.start_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Segunda fila: Tabla de Posiciones */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <LeagueStandings leagueId={params.id as string} />
          </div>
        </div>

        {/* Tercera fila: Fechas y Resultados */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Gestión de Resultados</h2>
            <LeagueRounds
              leagueId={params.id as string}
              totalRounds={7}
              onSelectRound={setSelectedRound}
            />
            <div className="mt-6">
              <LeagueMatchResults
                matches={mockMatches.filter(m => m.round === selectedRound)}
                onSaveResults={handleSaveResults}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 