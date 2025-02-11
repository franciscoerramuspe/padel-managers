'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTournaments } from '@/hooks/useTournaments';
import Link from 'next/link';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MatchResultModal } from '@/components/Tournaments/groups/MatchResultModal';
import { GroupTable } from '@/components/Tournaments/groups/GroupTable';

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

  const generateGroupMatches = (teams: number) => {
    const matches = [];
    for (let i = 0; i < teams; i++) {
      for (let j = i + 1; j < teams; j++) {
        matches.push({
          team1: `Equipo ${i + 1}`,
          team2: `Equipo ${j + 1}`
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
            <GroupTable
              key={groupIndex}
              groupIndex={groupIndex}
              teams={generateGroupTeams(groupIndex)}
              matches={generateGroupMatches(3)}
              onUpdateMatch={handleUpdateMatch}
            />
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
            onSubmit={(result) => {
              console.log(result);
            }}
          />
        )}
      </div>
    </div>
  );
}