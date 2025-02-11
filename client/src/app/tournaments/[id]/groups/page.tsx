'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTournaments } from '@/hooks/useTournaments';
import Link from 'next/link';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MatchResultModal } from '@/components/Tournaments/groups/MatchResultModal';
import { GroupTable } from '@/components/Tournaments/groups/GroupTable';
import { Info, Users, AlertCircle } from "lucide-react";

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

  const generateGroupMatches = (teams: any[]) => {
    const matches = [];
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        // Partido de ida
        matches.push({
          id: `${i}-${j}-ida`,
          team1: teams[i].name,
          team2: teams[j].name,
          score: null,
          completed: false
        });
        // Partido de vuelta
        matches.push({
          id: `${i}-${j}-vuelta`,
          team1: teams[j].name,
          team2: teams[i].name,
          score: null,
          completed: false
        });
      }
    }
    return matches;
  };

  const generateGroupTeams = (groupIndex: number) => {
    return Array.from({ length: 3 }).map((_, index) => ({
      id: `${groupIndex}-${index}`,
      name: `Equipo ${index + 1}`,
      players: ['Jugador 1', 'Jugador 2'],
      stats: {
        played: 0,
        won: 0,
        lost: 0,
        points: 0
      }
    }));
  };

  const handleUpdateMatch = (match: any) => {
    setSelectedMatch({
      team1: { name: match.team1 },
      team2: { name: match.team2 }
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header mejorado */}
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

        {/* Panel de Acción Principal */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card de Equipos Inscriptos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Equipos Inscriptos</h3>
                <p className="text-sm text-gray-500 mt-1">12 equipos en total</p>
              </div>
            </div>
          </div>

          {/* Card de Formato */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 rounded-full p-3">
                <AlertCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Formato Seleccionado</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedFormat === '3groups' ? '3 grupos de 4 equipos' : '4 grupos de 3 equipos'}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Acción */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Generar Grupos</h3>
            <p className="text-sm text-gray-500 mb-4">
              Al generar los grupos, se distribuirán automáticamente todos los equipos inscriptos.
            </p>
            <button
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors"
            >
              Generar Fase de Grupos
            </button>
          </div>
        </div>

        {/* Banner Informativo */}
        <div className="mb-8 bg-green-50 border border-green-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-green-500 mt-0.5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-900 mb-1">
                ¿Cómo configurar los resultados de los partidos?
              </h3>
              <div className="text-sm text-green-700 space-y-2">
                <p>
                  • Los partidos están organizados por fechas. Utiliza la navegación para ver todos los partidos del grupo.
                </p>
                <p>
                  • Cada equipo jugará partidos de ida y vuelta contra los demás equipos del grupo.
                </p>
                <p>
                  • Para registrar un resultado, haz clic en "Actualizar Resultado" y completa el marcador del partido.
                </p>
                <p>
                  • La tabla de posiciones se actualizará automáticamente según los resultados ingresados.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de grupos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: selectedFormat === '3groups' ? 3 : 4 }).map((_, groupIndex) => {
            const groupTeams = generateGroupTeams(groupIndex);
            return (
              <GroupTable
                key={groupIndex}
                groupIndex={groupIndex}
                teams={groupTeams}
                matches={generateGroupMatches(groupTeams)}
                onUpdateMatch={handleUpdateMatch}
              />
            );
          })}
        </div>

        {selectedMatch && (
          <MatchResultModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedMatch(null);
            }}
            match={selectedMatch}
            onSubmit={(result) => {
              console.log(result);
            }}  
          />
        )}
      </div>
    </div>
  );
}