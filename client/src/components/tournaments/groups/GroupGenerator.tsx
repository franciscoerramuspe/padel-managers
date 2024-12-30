import React, { useState, useEffect } from 'react';
import { GroupMatches } from './GroupMatches';
import { MatchResultModal } from '../matches/MatchResultModal';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { GroupStatusBar } from './GroupStatusBar';

interface Team {
  id: string;
  name: string;
}

interface Match {
  id: string;
  tournament_id: string;
  round: number;
  position: number;
  team1_id: string;
  team2_id: string;
  winner_id: string | null;
  team1_score: {
    sets: { games: number; tiebreak: number | null }[];
  } | null;
  team2_score: {
    sets: { games: number; tiebreak: number | null }[];
  } | null;
  status: 'pending' | 'completed';
  group: string;
  team1: Team;
  team2: Team;
}

interface Group {
  name: string;
  teams: Array<{
    id: string;
    name: string;
    seed: number;
  }>;
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
  const [numberOfGroups, setNumberGroups] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Record<string, Group>>({});
  const [groupStatus, setGroupStatus] = useState<{
    total: number;
    completed: number;
    isComplete: boolean;
  }>({ total: 0, completed: 0, isComplete: false });
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const groupMatches = matches.filter(match => match.round === 1);
  const completedMatches = groupMatches.filter(match => 
    match.status === 'completed' && 
    match.team1_score && 
    match.team2_score && 
    match.winner_id
  );

  const isGroupPhaseComplete = groupMatches.length > 0 && 
    completedMatches.length === groupMatches.length;

  useEffect(() => {
    fetchExistingGroups();
    fetchGroupStatus();
  }, [tournamentId]);

  const fetchExistingGroups = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/${tournamentId}/groups`);
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

  const fetchGroupStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/${tournamentId}/group-status`
      );
      if (!response.ok) throw new Error('Failed to fetch group status');
      const status = await response.json();
      setGroupStatus(status);
    } catch (err) {
      console.error('Error fetching group status:', err);
    }
  };

  const generateGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/${tournamentId}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numberOfGroups })
      });

      if (!response.ok) throw new Error('Failed to generate groups');
      
      const data = await response.json();
      setGroups(data.groups);
      
    } catch (err) {
      setError('Could not generate groups');
    } finally {
      setIsLoading(false);
    }
  };

  const generateKnockoutPhase = async () => {
    if (!groupStatus.isComplete) {
      setError('Todos los partidos de grupo deben estar completados');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/${tournamentId}/knockout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            teamsPerGroup: 2 // Top 2 teams from each group advance
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Knockout generation error:', errorData);
        throw new Error(errorData.message || 'Error al generar la fase eliminatoria');
      }

      const data = await response.json();
      console.log('Knockout phase generated:', data);

      // Redirect directly to the draw page to show the knockout bracket
      window.location.href = `/tournaments/${tournamentId}/draw`;
    } catch (error) {
      console.error('Error generating knockout phase:', error);
      setError(error instanceof Error ? error.message : 'No se pudo generar la fase eliminatoria');
    }
  };

  const handleUpdateResult = async (matchId: string, data: any) => {
    try {
      const team1 = data.teams[0];
      const team2 = data.teams[1];

      const scoreData = {
        team1_score: team1.score,
        team2_score: team2.score,
        winner_id: data.winner_id
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/matches/${matchId}/score`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.error || 'Error al actualizar el resultado');
      }
      
      await onMatchesUpdate();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating match result:', error);
      setError('No se pudo actualizar el resultado del partido');
    }
  };

  const maxGroups = Math.floor(totalTeams / 2);

  if (isLoading) {
    return <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />;
  }
  console.log(groupStatus)
  return (
    <div className="space-y-4">
      {Object.keys(groups).length === 0 ? (
        <div className="flex items-center gap-4">
          <Label htmlFor="groupSelect" className="text-sm font-medium">
            Número de Grupos:
          </Label>
          <Select
            id="groupSelect"
            value={numberOfGroups.toString()}
            onValueChange={(value) => setNumberGroups(Number(value))}
          >
            {Array.from({length: maxGroups - 1}, (_, i) => i + 2).map(num => (
              <Select.Option key={num} value={num.toString()}>
                {num} grupos ({Math.ceil(totalTeams / num)} equipos por grupo)
              </Select.Option>
            ))}
          </Select>
          
          <Button
            onClick={generateGroups}
            disabled={isLoading}
          >
            {isLoading ? 'Generando...' : 'Generar Grupos'}
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groups).map(([groupKey, group]) => (
              <div key={groupKey} className="bg-gray-50 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">{group.name}</h3>
                <ul className="space-y-3">
                  {group.teams.map((team) => (
                    <li 
                      key={team.id} 
                      className="flex justify-between items-center p-2 bg-white rounded shadow-sm"
                    >
                      <span>{team.name}</span>
                      <span className="text-sm text-gray-500">Seed: {team.seed}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <GroupMatches 
            matches={matches}
            onUpdateResult={(match) => {
              setSelectedMatch(match);
              setIsModalOpen(true);
            }}
          />
          
          <GroupStatusBar 
            total={groupMatches.length}
            completed={completedMatches.length}
          />

          <div className="flex justify-end">
            {isGroupPhaseComplete ? (
              <Button
                onClick={generateKnockoutPhase}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Generar Fase Eliminatoria
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
        </>
      )}

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
          team1Name={selectedMatch.team1.name}
          team2Name={selectedMatch.team2.name}
          onSubmit={handleUpdateResult}
        />
      )}
    </div>
  );
}

