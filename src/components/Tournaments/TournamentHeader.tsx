import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface TournamentHeaderProps {
  tournament: any;
  onBack: () => void;
}

export function TournamentHeader({ tournament, onBack }: TournamentHeaderProps) {
  const tournamentInfo = tournament.tournament_info?.[0];

  return (
    <div className="relative">
      {/* Banner/Imagen de fondo */}
      <div className="relative h-[400px]">
        {tournamentInfo?.tournament_thumbnail ? (
          <Image
            src={tournamentInfo.tournament_thumbnail}
            alt={tournament.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full bg-gradient-to-r from-blue-600 to-blue-800" />
        )}
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Contenido del header */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a torneos
          </button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              {tournament.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-100 text-sm font-medium border border-blue-400/20">
                {tournament.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-100 text-sm font-medium border border-green-400/20">
                {tournament.status === 'upcoming' ? 'Próximo' : 
                 tournament.status === 'in_progress' ? 'En Curso' : 
                 'Finalizado'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 