'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useTournaments } from '@/hooks/useTournaments';
import { usePayments } from '@/hooks/usePayments';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function TournamentTeamsPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.tournamentId as string;

  const { tournaments, loading: tournamentsLoading } = useTournaments();
  const { 
    payments, 
    isLoading: paymentsLoading, 
    error: paymentsError,
    fetchTournamentPayments 
  } = usePayments();

  // Encontrar el torneo actual
  const currentTournament = tournaments?.find(t => t.id === tournamentId);

  useEffect(() => {
    if (tournamentId) {
      fetchTournamentPayments(tournamentId);
    }
  }, [tournamentId, fetchTournamentPayments]);

  if (tournamentsLoading || paymentsLoading) return <LoadingSpinner />;
  if (paymentsError) return <ErrorMessage message={paymentsError} />;

  return (
    
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push(`/tournaments/${tournamentId}`)}
            className="mb-4 flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver al torneo
          </Button>
        </div>

        <Header 
          title={`Equipos - ${currentTournament?.name}`}
          icon={<UsersIcon className="w-6 h-6 text-gray-900 dark:text-gray-100" />}
          description="Lista de parejas inscritas en el torneo."
        />

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total de Equipos</div>
            <div className="text-2xl font-bold">{payments.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Pagos Pendientes</div>
            <div className="text-2xl font-bold text-yellow-600">
              {payments.filter(p => p.payment_status === 'pending').length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Pagos Completados</div>
            <div className="text-2xl font-bold text-green-600">
              {payments.filter(p => p.payment_status === 'paid').length}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pareja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado de Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Inscripción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {payments.map((payment) => (
                  <tr key={payment.team_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {`${payment.teams.player1?.first_name} ${payment.teams.player1?.last_name} / 
                          ${payment.teams.player2?.first_name} ${payment.teams.player2?.last_name}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.payment_status === 'paid' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {payment.payment_status === 'paid' ? 'Inscripcion pagada' : 'Inscripcion pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 