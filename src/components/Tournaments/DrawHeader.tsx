import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DrawHeaderProps {
  tournamentName: string;
  tournamentId: string;
  canGenerateBracket: boolean;
  onGenerateBracket: () => void;
}

export function DrawHeader({ 
  tournamentName, 
  tournamentId, 
  canGenerateBracket, 
  onGenerateBracket 
}: DrawHeaderProps) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <Link 
              href={`/tournaments/${tournamentId}`}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al torneo
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {tournamentName}
            </h1>
            <p className="text-gray-500">Bracket del Torneo</p>
          </div>

          {canGenerateBracket && (
            <Button 
              onClick={onGenerateBracket}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Generar Bracket
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 