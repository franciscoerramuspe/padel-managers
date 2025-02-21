import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CalendarDays, Clock } from 'lucide-react';

interface LeagueRoundsProps {
  leagueId: string;
  totalRounds: number;
  onSelectRound: (round: number) => void;
}

export function LeagueRounds({ leagueId, totalRounds, onSelectRound }: LeagueRoundsProps) {
  const [selectedRound, setSelectedRound] = useState(1);

  const handleRoundSelect = (round: number) => {
    setSelectedRound(round);
    onSelectRound(round);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-6">
        {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => (
          <Button
            key={round}
            variant={selectedRound === round ? "default" : "outline"}
            onClick={() => handleRoundSelect(round)}
          >
            Fecha {round}
          </Button>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">Próxima fecha: 15 de Abril, 2025</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">22:30 - 00:00</span>
        </div>
      </Card>
    </div>
  );
} 