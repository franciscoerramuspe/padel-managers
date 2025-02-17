import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface TournamentHeaderProps {
  tournament: any;
  onBack: () => void;
}

export function TournamentHeader({ tournament, onBack }: TournamentHeaderProps) {
  const tournamentInfo = tournament.tournament_info?.[0];

  return (
    <div className="relative bg-white border-b">
      {/* Banner/Imagen de fondo */}
      <div className="h-64 bg-gradient-to-r from-blue-600 to-blue-800">
        {tournamentInfo?.tournament_thumbnail && (
          <Image
            src={tournamentInfo.tournament_thumbnail}
            alt={tournament.name}
            fill
            className="object-cover opacity-30"
          />
        )}
      </div>

      {/* Contenido del header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 sm:-mt-32 pb-8">
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center text-sm text-white hover:text-blue-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a torneos
          </button>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {tournament.name}
                </h1>
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                    {tournament.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                    {tournament.status === 'upcoming' ? 'Próximo' : 
                     tournament.status === 'in_progress' ? 'En Curso' : 
                     'Finalizado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 