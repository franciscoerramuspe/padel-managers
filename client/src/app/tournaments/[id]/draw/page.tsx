'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTournaments } from '@/hooks/useTournaments';
import { TournamentBracket } from '@/components/Tournaments/TournamentBracket';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function TournamentDrawPage() {
  const params = useParams();
  const router = useRouter();
  const { tournament, teams, matches, loading, generateBracket } = useTournaments(params.id as string);

  if (loading) return <LoadingSpinner />;
  if (!tournament) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/tournaments/${params.id}`}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver al torneo
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Bracket del Torneo
              </h1>
            </div>

            {teams.length === 8 && matches.length === 0 && (
              <Button 
                onClick={generateBracket}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Generar Bracket
              </Button>
            )}
          </div>
        </div>

        {/* Estado del Bracket */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Equipos Inscritos</h3>
                <p className="text-2xl font-bold text-blue-600">{teams.length}/8</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Partidos Programados</h3>
                <p className="text-2xl font-bold text-green-600">{matches.length}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-medium text-purple-900 mb-2">Estado</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {matches.length === 0 ? 'Por Generar' : 'En Curso'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bracket o Mensaje */}
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
    </div>
  );
} 