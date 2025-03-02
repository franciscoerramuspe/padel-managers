import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Player } from '@/types/player';

// Definimos la interfaz correcta que coincida con la respuesta del backend
export interface TeamPayment {
  team_id: string;
  payment_status: 'pending' | 'paid' | 'completed';
  payment_date?: string;
  payment_reference?: string;
  created_at: string;
  teams: {
    id: string;
    player1_id: string;
    player2_id: string;
    player1?: {
      first_name: string;
      last_name: string;
    };
    player2?: {
      first_name: string;
      last_name: string;
    };
  };
}

export function usePayments() {
  const [payments, setPayments] = useState<TeamPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTournamentPayments = async (tournamentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No estás autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/tournament-payment-status/${tournamentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los pagos');
      }

      const { data } = await response.json();
      setPayments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar los pagos';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePaymentStatus = async (tournamentId: string, teamId: string, paymentStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No estás autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/set-payment-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tournament_id: tournamentId,
          team_id: teamId,
          payment_status: paymentStatus
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del pago');
      }

      // Actualizar el estado local
      setPayments(prev => prev.map(payment => 
        payment.team_id === teamId 
          ? { ...payment, payment_status: paymentStatus as 'pending' | 'paid' | 'completed' }
          : payment
      ));

      toast({
        title: "Éxito",
        description: "Estado de pago actualizado correctamente",
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar el pago';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    payments,
    isLoading,
    error,
    fetchTournamentPayments,
    updatePaymentStatus
  };
} 