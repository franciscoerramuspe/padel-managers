import Image from 'next/image';

interface EmptyStandingsProps {
  message?: string;
}

export function EmptyStandings({ message = "No hay posiciones disponibles en este momento." }: EmptyStandingsProps) {
  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
      <div className="flex flex-col items-center justify-center py-6 px-4">
        <div className="relative w-48 h-48 mb-4">
          <Image
            src="/assets/nostandings.png"
            alt="No hay posiciones disponibles"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-base font-semibold text-gray-700 dark:text-gray-300 text-center mb-1">
          Sin posiciones disponibles.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
          {message}
        </p>
      </div>
    </div>
  );
} 