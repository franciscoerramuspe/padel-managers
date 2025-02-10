'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTournaments } from '@/hooks/useTournaments';
import Link from 'next/link';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MatchResultModal } from '@/components/Tournaments/groups/MatchResultModal';

export default function TournamentGroupsPage() {
  const params = useParams();
  const router = useRouter();
  const { tournament, teams, matches, loading } = useTournaments(params.id as string);
  const [selectedFormat, setSelectedFormat] = useState<'3groups' | '4groups'>('3groups');
  const [selectedMatch, setSelectedMatch] = useState<{
    team1: { name: string };
    team2: { name: string };
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (loading) return <LoadingSpinner />;
  if (!tournament) return null;

  const handleUpdateResult = (result: any) => {
    console.log(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/tournaments/${params.id}`}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                ← Volver al torneo
              </Link>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">Fase de Grupos</h1>
            </div>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              Generar Fase de Grupos
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedFormat('3groups')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedFormat === '3groups'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                3 Grupos
              </button>
              <button
                onClick={() => setSelectedFormat('4groups')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedFormat === '4groups'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                4 Grupos
              </button>
            </div>
          </div>
        </div>

        {/* Grupos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: selectedFormat === '3groups' ? 3 : 4 }).map((_, groupIndex) => (
            <div key={groupIndex} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">Grupo {groupIndex + 1}</h3>
              </div>
              
              {/* Tabla de Posiciones */}
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Equipo</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">PJ</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">PG</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">PP</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 3 }).map((_, teamIndex) => (
                        <tr key={teamIndex} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">{teamIndex + 1}</span>
                              </div>
                              <div className="text-sm">
                                <p className="font-medium text-gray-900">Equipo {teamIndex + 1}</p>
                                <p className="text-gray-500">Jugador 1 / Jugador 2</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-3 px-4 text-sm text-gray-600">0</td>
                          <td className="text-center py-3 px-4 text-sm text-gray-600">0</td>
                          <td className="text-center py-3 px-4 text-sm text-gray-600">0</td>
                          <td className="text-center py-3 px-4 text-sm font-medium text-gray-900">0</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Partidos del Grupo */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Partidos</h4>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, matchIndex) => (
                      <div
                        key={matchIndex}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Equipo A</span>
                          <span className="text-sm font-medium text-gray-900">vs</span>
                          <span className="text-sm text-gray-600">Equipo B</span>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedMatch({
                              team1: { name: "Equipo A" },
                              team2: { name: "Equipo B" }
                            });
                            setIsModalOpen(true);
                          }}
                          className="mt-2 w-full px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Actualizar Resultado
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedMatch && (
          <MatchResultModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedMatch(null);
            }}
            match={selectedMatch}
            onSubmit={handleUpdateResult}
          />
        )}
      </div>
    </div>
  );
}