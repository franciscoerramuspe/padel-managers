import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeagueMatch } from '@/types/league';
import { LeagueMatchModal } from './LeagueMatchModal';

interface LeagueMatchResultsProps {
  matches: LeagueMatch[];
  onSaveResults: (results: LeagueMatch[]) => void;
}

export function LeagueMatchResults({ matches, onSaveResults }: LeagueMatchResultsProps) {
  const [selectedMatch, setSelectedMatch] = useState<LeagueMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMatchClick = (match: LeagueMatch) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  const handleSaveResult = async (matchId: string, result: any) => {
    try {
      const updatedMatches = matches.map(match => 
        match.id === matchId 
          ? { 
              ...match, 
              score: result.score,
              status: 'completed' as const,
              winner_id: result.winner_id 
            } 
          : match
      );
      onSaveResults(updatedMatches);
      handleModalClose();
    } catch (error) {
      console.error('Error al guardar el resultado:', error);
    }
  };

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div key={match.id} className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="grid grid-cols-7 gap-4 items-center">
            <div className="col-span-3">{match.team1}</div>
            <div className="col-span-1 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMatchClick(match)}
              >
                {match.status === 'completed' ? 'Ver Resultado' : 'Ingresar Resultado'}
              </Button>
            </div>
            <div className="col-span-3 text-right">{match.team2}</div>
          </div>
        </div>
      ))}

      {selectedMatch && (
        <LeagueMatchModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          match={selectedMatch}
          onSubmit={handleSaveResult}
        />
      )}
    </div>
  );
} 