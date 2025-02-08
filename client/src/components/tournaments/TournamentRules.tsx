import { FileText, Download } from 'lucide-react';
import { Button } from '../ui/button';

interface TournamentRulesProps {
  tournament: any; // TODO: Add proper type
}

export function TournamentRules({ tournament }: TournamentRulesProps) {
  const tournamentInfo = tournament.tournament_info?.[0];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-7 w-7 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Reglamento</h2>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Descargar PDF
          </Button>
        </div>

        <div className="prose max-w-none">
          {tournamentInfo?.rules ? (
            <div className="space-y-4">
              {tournamentInfo.rules.split('\n').map((rule: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{rule}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay reglas especificadas para este torneo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 