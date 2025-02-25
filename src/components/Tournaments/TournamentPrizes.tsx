import { Trophy } from 'lucide-react';

interface TournamentPrizesProps {
  tournament: any; // TODO: Add proper type
}

export function TournamentPrizes({ tournament }: TournamentPrizesProps) {
  const tournamentInfo = tournament.tournament_info?.[0];

  return (   
    <>
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-7 w-7 text-yellow-500 dark:text-yellow-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Premios</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Primer Lugar */}
        <div className="relative bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-700">
          <div className="absolute top-0 right-0 w-20 h-20 text-yellow-200 dark:text-yellow-700 opacity-20">
            <Trophy className="w-full h-full" />
          </div>
          <div className="relative">
            <span className="inline-block px-3 py-1 bg-yellow-200 dark:bg-yellow-700/50 text-yellow-700 dark:text-yellow-200 rounded-full text-sm font-semibold mb-3">
              1° Lugar
            </span>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${tournamentInfo?.first_place_prize || '0'}
            </p>
            <p className="text-yellow-700 dark:text-yellow-300 font-medium mt-1">Premio Principal</p>
          </div>
        </div>

        {/* Segundo Lugar */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="absolute top-0 right-0 w-20 h-20 text-gray-200 dark:text-gray-600 opacity-20">
            <Trophy className="w-full h-full" />
          </div>
          <div className="relative">
            <span className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-sm font-semibold mb-3">
              2° Lugar
            </span>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${tournamentInfo?.second_place_prize || '0'}
            </p>
            <p className="text-gray-700 dark:text-gray-300 font-medium mt-1">Segundo Premio</p>
          </div>
        </div>

        {/* Tercer Lugar */}
        <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
          <div className="absolute top-0 right-0 w-20 h-20 text-orange-200 dark:text-orange-700 opacity-20">
            <Trophy className="w-full h-full" />
          </div>
          <div className="relative">
            <span className="inline-block px-3 py-1 bg-orange-200 dark:bg-orange-700/50 text-orange-700 dark:text-orange-200 rounded-full text-sm font-semibold mb-3">
              3° Lugar
            </span>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${tournamentInfo?.third_place_prize || '0'}
            </p>
            <p className="text-orange-700 dark:text-orange-300 font-medium mt-1">Tercer Premio</p>
          </div>
        </div>
      </div>
    </>
  );
} 