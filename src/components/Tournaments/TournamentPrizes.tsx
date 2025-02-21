import { Trophy } from 'lucide-react';

interface TournamentPrizesProps {
  tournament: any; // TODO: Add proper type
}

export function TournamentPrizes({ tournament }: TournamentPrizesProps) {
  const tournamentInfo = tournament.tournament_info?.[0];

  return (   
    <>
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-7 w-7 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-900">Premios</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Primer Lugar */}
        <div className="relative bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="absolute top-0 right-0 w-20 h-20 text-yellow-200 opacity-20">
            <Trophy className="w-full h-full" />
          </div>
          <div className="relative">
            <span className="inline-block px-3 py-1 bg-yellow-200 text-yellow-700 rounded-full text-sm font-semibold mb-3">
              1° Lugar
            </span>
            <p className="text-3xl font-bold text-gray-900">
              ${tournamentInfo?.first_place_prize || '0'}
            </p>
            <p className="text-yellow-700 font-medium mt-1">Premio Principal</p>
          </div>
        </div>

        {/* Segundo Lugar */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <div className="absolute top-0 right-0 w-20 h-20 text-gray-200 opacity-20">
            <Trophy className="w-full h-full" />
          </div>
          <div className="relative">
            <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold mb-3">
              2° Lugar
            </span>
            <p className="text-3xl font-bold text-gray-900">
              ${tournamentInfo?.second_place_prize || '0'}
            </p>
            <p className="text-gray-700 font-medium mt-1">Segundo Premio</p>
          </div>
        </div>

        {/* Tercer Lugar */}
        <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="absolute top-0 right-0 w-20 h-20 text-orange-200 opacity-20">
            <Trophy className="w-full h-full" />
          </div>
          <div className="relative">
            <span className="inline-block px-3 py-1 bg-orange-200 text-orange-700 rounded-full text-sm font-semibold mb-3">
              3° Lugar
            </span>
            <p className="text-3xl font-bold text-gray-900">
              ${tournamentInfo?.third_place_prize || '0'}
            </p>
            <p className="text-orange-700 font-medium mt-1">Tercer Premio</p>
          </div>
        </div>
      </div>
    </>
  );
} 