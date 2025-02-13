import { FileText, Download, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { RulesGenerator } from './RulesGenerator';
import { TournamentInfo } from '@/types/tournament';
import { Tournament } from '@/types/tournament';

interface RulesDownloaderProps {
  tournament: Tournament;
  tournamentInfo: TournamentInfo;
}

export function RulesDownloader({ tournament, tournamentInfo }: RulesDownloaderProps) {
  return (
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Descarga del Reglamento</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">¿Qué es esto?</h3>
              <p className="text-sm text-blue-600">
                Descarga el reglamento oficial del torneo en formato PDF para 
                consultar todas las reglas y normativas.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">El documento incluye:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4 text-green-500" />
                  Reglamento completo del torneo
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Info className="h-4 w-4 text-blue-500" />
                  Formato oficial
                </li>
              </ul>
            </div>
          </div>

          <div>
            <RulesGenerator 
              tournament={tournament}
              tournamentInfo={tournamentInfo}
            />
          </div>
        </div>
      </div>
    </Card>
  );
} 