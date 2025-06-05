import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

interface GroupMatchesProps {
  matches: Match[];
  onUpdateResult: (match: Match) => void;
}

function formatScore(score: { sets: { games: number; tiebreak: number | null }[] }) {
  return score.sets.map((set, index) => (
    <div key={index} className="text-yellow-400 font-mono text-xl">
      {set.games}
    </div>
  ));
}

export function GroupMatches({ matches, onUpdateResult }: GroupMatchesProps) {
  const groupedMatches = matches.reduce((acc, match) => {
    if (!match.group) return acc;
    if (!acc[match.group]) {
      acc[match.group] = [];
    }
    acc[match.group].push(match);
    return acc;
  }, {} as Record<string, Match[]>);
  console.log(matches)
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Partidos de Grupos</h2>
      <div className="space-y-8">
        {Object.entries(groupedMatches).map(([groupName, groupMatches]) => (
          <Card key={groupName} className="p-6">
            <h3 className="text-xl font-bold mb-4">
              {groupName.replace('grupo', 'Grupo ')}
            </h3>
            <div className="space-y-4">
              {groupMatches
                .sort((a, b) => a.position - b.position)
                .map(match => (
                  <div 
                    key={match.id} 
                    className="flex items-center justify-between w-full"
                  >
                    {match.status === 'completed' && match.team1_score && match.team2_score ? (
                      <div className="flex items-center justify-between w-full bg-gray-900 rounded-lg">
                        <div className="flex items-center justify-between w-full px-6 py-4">
                          <div className={`flex-1 text-right ${match.winner_id === match.team1.id ? 'font-bold' : ''} text-white`}>
                            {match.team1.name}
                          </div>
                          <div className="flex items-center justify-center gap-4 mx-8">
                            {match.team1_score.sets.map((set, idx) => (
                              <div key={idx} className="text-yellow-400 font-mono text-xl">
                                {`${set.games}-${match.team2_score!.sets[idx].games}`}
                              </div>
                            ))}
                          </div>
                          <div className={`flex-1 text-left ${match.winner_id === match.team2.id ? 'font-bold' : ''} text-white`}>
                            {match.team2.name}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full px-6 py-4">
                        <div className="flex-1 text-right">
                          {match.team1.name}
                        </div>
                        <Button
                          onClick={() => onUpdateResult(match)}
                          variant="outline"
                          size="sm"
                          className="mx-8"
                        >
                          Actualizar Resultado
                        </Button>
                        <div className="flex-1 text-left">
                          {match.team2.name}
                        </div>
                      </div>
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

