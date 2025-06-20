import Image from 'next/image';

interface EmptyScheduleProps {
  message?: string;
}

export function EmptySchedule({ message = "No hay partidos programados" }: EmptyScheduleProps) {
  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700/50">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Próximos Partidos
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="relative w-48 h-48 mb-6">
          <Image
            src="/assets/court_padel.png"
            alt="Cancha de pádel vacía"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 text-center mb-2">
          Sin partidos por ahora
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
          {message}
        </p>
      </div>
    </div>
  );
} 