'use client';

import { useParams, useRouter } from 'next/navigation';
import { TournamentPaymentsPanel } from '@/components/Tournaments/TournamentPaymentsPanel';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useTournaments } from '@/hooks/useTournaments';
import { ChevronLeft, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function TournamentPaymentsPage() {
  const params = useParams();
  const router = useRouter();
  const { tournament, teams, loading, mutate, categories } = useTournaments(params.id as string);

  if (loading) return <LoadingSpinner />;
  if (!tournament) return null;

  const handleMarkAsPaid = async (teamId: string, paymentMethod: string) => {
    try {
      const response = await fetch(`/api/tournaments/${params.id}/teams/${teamId}/mark-paid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          payment_reference: paymentMethod,
          payment_status: 'completed'
        }),
      });

      if (!response.ok) {
        throw new Error('Error al marcar el pago');
      }

      await mutate();

      toast({
        title: "Pago registrado",
        description: `El pago ha sido marcado como completado exitosamente mediante ${
          paymentMethod === 'en_persona' ? 'pago en persona' : 'Mercado Pago'
        }.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el pago. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentMethodChange = async (teamId: string, paymentMethod: string) => {
    try {
      await handleMarkAsPaid(teamId, paymentMethod);
    } catch (error) {
      console.error('Error al cambiar el método de pago:', error);
    }
  };

  const getCategoryName = (categoryId: string, categories: any[]) => {
    const category = categories?.find(cat => cat.id === categoryId);
    return category?.name || 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push(`/payments`)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Volver a Inscripciones
          </Button>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
              <p className="text-gray-500">
                Administra los pagos de inscripción para {tournament.name}
              </p>
            </div>
          </div>
        </div>

        <TournamentPaymentsPanel
          teams={teams}
          inscriptionCost={tournament.tournament_info?.[0]?.inscription_cost || 0}
          category={getCategoryName(tournament.category_id, categories)}
          onMarkAsPaid={handleMarkAsPaid}
          handlePaymentMethodChange={handlePaymentMethodChange}
        />
      </div>
    </div>
  );
} 