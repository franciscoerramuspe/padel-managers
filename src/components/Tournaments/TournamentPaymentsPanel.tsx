'use client';

import { useState } from 'react';
import { Player } from '@/types/player';

interface TournamentPaymentsPanelProps {
  teams: Array<{
    teams: {
      id: string;
      player1_id: string;
      player2_id: string;
      player1?: Player;
      player2?: Player;
    };
    team_id: string;
    payment_status: 'pending' | 'paid' | 'completed';
    payment_date?: string;
    payment_reference?: string;
  }>;
  inscriptionCost: number;
  category?: string;
  onMarkAsPaid: (teamId: string, paymentMethod: string) => Promise<void>;
  handlePaymentMethodChange: (teamId: string, payment_reference: string) => void;
}

export function TournamentPaymentsPanel({ 
  teams, 
  inscriptionCost,
  category,
  onMarkAsPaid,
  handlePaymentMethodChange
}: TournamentPaymentsPanelProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleMarkAsPaid = async (teamId: string) => {
    setIsProcessing(teamId);
    try {
      await onMarkAsPaid(teamId, 'en_persona');
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Estado de Pagos</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gestiona los pagos de inscripción de las parejas
            </p>
          </div>
          <div>
            {category && (
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 text-right">
                Categoría: <span className="font-medium">{category}</span>
              </div>
            )}
            <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">Costo de inscripción:</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">${inscriptionCost}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pareja
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método de Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {teams.map((teamEntry) => (
              <tr key={teamEntry.team_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {`${teamEntry.teams.player1?.first_name} ${teamEntry.teams.player1?.last_name} / 
                      ${teamEntry.teams.player2?.first_name} ${teamEntry.teams.player2?.last_name}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    teamEntry.payment_status === 'paid' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {teamEntry.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {teamEntry.payment_date || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {teamEntry.payment_status === 'paid' ? (
                    <span className="text-gray-900 dark:text-gray-100">
                      {teamEntry.payment_reference === 'en_persona' ? 'En persona' : 'Mercado Pago'}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {teamEntry.payment_status !== 'paid' && (
                    <button
                      onClick={() => handleMarkAsPaid(teamEntry.team_id)}
                      disabled={isProcessing === teamEntry.team_id}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 
                               disabled:opacity-50 transition-colors"
                    >
                      {isProcessing === teamEntry.team_id ? 'Procesando...' : 'Marcar como pagado'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}