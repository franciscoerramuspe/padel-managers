import { FileText } from 'lucide-react';

interface TournamentRulesProps {
  tournament: any; // TODO: Add proper type
}

export function TournamentRules({ tournament }: TournamentRulesProps) {
  const tournamentInfo = tournament.tournament_info?.[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reglamento</h2>
        </div>

        <div className="prose max-w-none dark:prose-invert">
          {tournamentInfo?.rules ? (
            <div className="space-y-4">
              {tournamentInfo.rules.split('\n').map((rule: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{rule}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No hay reglas especificadas para este torneo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 