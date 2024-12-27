'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Match {
  id: string;
  round: number;
  position: number;
  team1: { id: string; name: string };
  team2: { id: string; name: string };
  winner?: { id: string; name: string };
}

interface TournamentBracketProps {
  tournamentId: string;
  format: 'single_elimination' | 'round_robin';
}

const TournamentBracket = ({ tournamentId, format }: TournamentBracketProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesByRound, setMatchesByRound] = useState<{[key: number]: Match[]}>({});

  useEffect(() => {
    const fetchDraw = async () => {
      try {
        const response = await fetch(`/api/tournaments/${tournamentId}/draw`);
        const data = await response.json();
        setMatches(data.matches);

        // Group matches by round
        const grouped = data.matches.reduce((acc: any, match: Match) => {
          if (!acc[match.round]) acc[match.round] = [];
          acc[match.round].push(match);
          return acc;
        }, {});
        setMatchesByRound(grouped);
      } catch (error) {
        console.error('Error fetching draw:', error);
      }
    };

    fetchDraw();
  }, [tournamentId]);

  const renderSingleElimination = () => (
    <div className="tournament-bracket">
      {Object.entries(matchesByRound).map(([round, roundMatches]) => (
        <div key={round} className="round">
          <h3>Round {round}</h3>
          {roundMatches.map((match: Match) => (
            <Card key={match.id} className="match">
              <div className={`team ${match.winner?.id === match.team1.id ? 'winner' : ''}`}>
                {match.team1?.name || 'TBD'}
              </div>
              <div className={`team ${match.winner?.id === match.team2.id ? 'winner' : ''}`}>
                {match.team2?.name || 'TBD'}
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );

  const renderRoundRobin = () => (
    <div className="round-robin">
      {Object.entries(matchesByRound).map(([round, roundMatches]) => (
        <div key={round} className="round">
          <h3>Round {round}</h3>
          {roundMatches.map((match: Match) => (
            <Card key={match.id} className="match">
              <Space direction="vertical">
                <div>{match.team1?.name} vs {match.team2?.name}</div>
                {match.winner && (
                  <div className="winner">Winner: {match.winner.name}</div>
                )}
              </Space>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {format === 'single_elimination' ? renderSingleElimination() : renderRoundRobin()}
    </div>
  );
};

export default TournamentBracket; 