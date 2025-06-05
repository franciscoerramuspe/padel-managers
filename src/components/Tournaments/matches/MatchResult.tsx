import React from 'react';

interface MatchScore {
  id: string;
  team1_id: string;
  team2_id: string;
  winner_id: string;
  team1_score: {
    sets: { games: number; tiebreak: number | null }[];
  };
  team2_score: {
    sets: { games: number; tiebreak: number | null }[];
  };
  status: string;
  round: number;
  position: number;
  group: string;
  team1: { id: string; name: string };
  team2: { id: string; name: string };
}

interface MatchResultProps {
  matchScore: MatchScore;
}

export function MatchResult({ matchScore }: MatchResultProps) {
  console.log(matchScore)
  const { team1, team2, team1_score, team2_score, winner_id } = matchScore;

  const renderSet = (set: { games: number; tiebreak: number | null }) => {
    if (set.tiebreak !== null) {
      return `${set.games}-${set.tiebreak}`;
    }
    return set.games;
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <span className={winner_id === team1.id ? 'font-bold' : ''}>{team1.name}</span>
      <span className="text-gray-500">vs</span>
      <span className={winner_id === team2.id ? 'font-bold' : ''}>{team2.name}</span>
      <span className="text-gray-500">
        ({team1_score.sets.map(renderSet).join(', ')}) - ({team2_score.sets.map(renderSet).join(', ')})
      </span>
    </div>
  );
}

