import Image from 'next/image';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { Court } from '@/types/court';

interface ActiveCourtsProps {
  courts: Court[];
}

export function ActiveCourts({ courts }: ActiveCourtsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Canchas
        </h2>
        <Link 
          href="/courts"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          Ver todas
        </Link>
      </div>

      <div className="space-y-4">
        {courts.map((court) => (
          <div 
            key={court.id}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
              {court.image ? (
                <Image
                  src={court.image}
                  alt={court.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {court.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {court.status === 'available' ? 'Disponible' : 'En uso'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 