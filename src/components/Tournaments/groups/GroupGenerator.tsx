import React, { useState, useEffect } from 'react';
import { GroupMatches } from './GroupMatches';
import { MatchResultModal } from '../matches/MatchResultModal';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { GroupStatusBar } from './GroupStatusBar';
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell 
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

interface Match {
  id: string;
  tournament_id: string;
  home_team_id: string;
  away_team_id: string;
  winner_team_id: string | null;
  score: string | null;
  status: 'pending' | 'completed';
  round_number: number;
  match_day: string | null;
  start_time: string | null;
}

interface Team {
  id: string;
  player1_id: string;
  player2_id: string;
}

interface GroupTeam {
  id: string;
  name: string;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  points: number;
  player1_id: string;
  player2_id: string;
}

interface GroupMatch {
  id: string;
  home_team_id: string;
  away_team_id: string;
  score: string | null;
  status: 'pending' | 'completed';
  round_number: number;
  match_day: string;
  start_time: string;
}

interface Group {
  id: string;
  name: string;
  teams: GroupTeam[];
  matches: GroupMatch[];
}

interface GroupGeneratorProps {
  tournamentId: string;
  totalTeams: number;
  matches: Match[];
  onMatchesUpdate: () => Promise<void>;
}

export function GroupGenerator({ 
  tournamentId, 
  totalTeams, 
  matches,
  onMatchesUpdate 
}: GroupGeneratorProps) {
  const [numberOfGroups, setNumberGroups] = useState<3 | 4>(3);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Record<string, Group>>({});
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [format, setFormat] = useState<'3groups' | '4groups'>('3groups');

  // Filtramos los partidos de la fase de grupos (round_number = 1)
  const groupMatches = matches.filter(match => match.round_number === 1);
  const completedMatches = groupMatches.filter(match => 
    match.status === 'completed' && 
    match.score && 
    match.winner_team_id
  );

  const isGroupPhaseComplete = groupMatches.length > 0 && 
    completedMatches.length === groupMatches.length;

  useEffect(() => {
    fetchExistingGroups();
  }, [tournamentId]);

  const fetchExistingGroups = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/${tournamentId}/groups`
      );
      if (!response.ok) throw new Error('Failed to fetch groups');
      
      const data = await response.json();
      if (data.groups) {
        setGroups(data.groups);
      }
    } catch (err) {
      setError('No se han generado grupos');
    } finally {
      setIsLoading(false);
    }
  };

  const generateGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/${tournamentId}/groups`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ numberOfGroups })
        }
      );

      if (!response.ok) throw new Error('Failed to generate groups');
      
      const data = await response.json();
      setGroups(data.groups);
      await onMatchesUpdate();
      
    } catch (err) {
      setError('No se pudieron generar los grupos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateResult = async (matchId: string, result: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/matches/${matchId}/score`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result)
        }
      );
      
      if (!response.ok) throw new Error('Failed to update match result');
      
      await onMatchesUpdate();
      setIsModalOpen(false);
    } catch (error) {
      setError('No se pudo actualizar el resultado del partido');
    }
  };

  if (isLoading) {
    return <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />;
  }

  return (
    <div className="space-y-8">
      {/* Selector de Formato */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Formato del Torneo</h2>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              format === '3groups' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
            onClick={() => setFormat('3groups')}
          >
            3 Grupos
            <span className="block text-sm">
              2 mejores primeros a semifinal + ronda previa
            </span>
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              format === '4groups' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
            onClick={() => setFormat('4groups')}
          >
            4 Grupos
            <span className="block text-sm">
              2 clasificados por grupo
            </span>
          </button>
        </div>
      </div>

      {/* Vista de Grupos */}
      <div className="grid grid-cols-2 gap-6">
        {groups.map((group, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Grupo {index + 1}</h3>
            {/* Tabla de posiciones */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipo</TableHead>
                  <TableHead>PJ</TableHead>
                  <TableHead>PG</TableHead>
                  <TableHead>PP</TableHead>
                  <TableHead>PTS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>Equipo {team.id.slice(0, 4)}</TableCell>
                    <TableCell>{team.matches_played}</TableCell>
                    <TableCell>{team.matches_won}</TableCell>
                    <TableCell>{team.matches_lost}</TableCell>
                    <TableCell className="font-bold">{team.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Lista de partidos */}
            <div className="mt-4">
              <h4 className="font-semibold">Partidos</h4>
              {group.matches.map((match) => (
                <div key={match.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span>{match.team1_name}</span>
                    <span className="font-bold">
                      {match.score || 'vs'}
                    </span>
                    <span>{match.team2_name}</span>
                  </div>
                  {!match.completed && (
                    <Button
                      onClick={() => {
                        setSelectedMatch(match);
                        setIsModalOpen(true);
                      }}
                      className="mt-2 w-full"
                      variant="outline"
                    >
                      Actualizar Resultado
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        {isGroupPhaseComplete ? (
          <Button
            onClick={() => {
              // Aquí iría la lógica para generar la siguiente fase
              // según el formato elegido (3 o 4 grupos)
            }}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {numberOfGroups === 3 
              ? 'Generar Ronda Previa y Semifinales'
              : 'Generar Cuartos de Final'}
          </Button>
        ) : (
          <Button
            disabled
            className="bg-gray-300 text-gray-500 cursor-not-allowed"
          >
            Complete todos los partidos de grupo
          </Button>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {selectedMatch && (
        <MatchResultModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          match={selectedMatch}
          onSubmit={handleUpdateResult}
        />
      )}
    </div>
  );
}

export function TournamentGroupStage({ groups, onUpdateMatch }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="p-6">
            <h3 className="text-xl font-bold mb-4">Grupo {group.name}</h3>
            
            {/* Tabla de posiciones */}
            <Table>
              <thead>
                <tr>
                  <th>Equipo</th>
                  <th>PJ</th>
                  <th>PG</th>
                  <th>PP</th>
                  <th>PTS</th>
                </tr>
              </thead>
              <tbody>
                {group.teams.map((team) => (
                  <tr key={team.id}>
                    <td>{team.name}</td>
                    <td>{team.played}</td>
                    <td>{team.won}</td>
                    <td>{team.lost}</td>
                    <td className="font-bold">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Partidos del grupo */}
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold">Partidos</h4>
              {group.matches.map((match) => (
                <div key={match.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span>{match.team1_name}</span>
                    <span className="font-bold">
                      {match.score || 'vs'}
                    </span>
                    <span>{match.team2_name}</span>
                  </div>
                  {!match.completed && (
                    <Button
                      onClick={() => onUpdateMatch(match)}
                      className="mt-2 w-full"
                      variant="outline"
                    >
                      Actualizar Resultado
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

