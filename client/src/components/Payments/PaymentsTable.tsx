'use client';

import { useRouter } from 'next/navigation';
import { Tournament } from '@/types/tournament';
import { Category } from '@/types/category';

interface PaymentsTableProps {
  tournaments: Tournament[];
  categories: Category[];
}

export function PaymentsTable({ tournaments, categories }: PaymentsTableProps) {
  const router = useRouter();

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'N/A';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Torneo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Costo de Inscripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tournaments.map((tournament) => (
              <tr key={tournament.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{tournament.name}</div>
                  <div className="text-sm text-gray-500">{tournament.tournament_info[0]?.tournament_club_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {getCategoryName(tournament.category_id)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    ${tournament.tournament_info[0]?.inscription_cost}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${tournament.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' : 
                      tournament.status === 'in_progress' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {tournament.status === 'upcoming' ? 'Próximo' : 
                     tournament.status === 'in_progress' ? 'En Curso' : 'Finalizado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => router.push(`/tournaments/${tournament.id}/payments`)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Ver Pagos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 