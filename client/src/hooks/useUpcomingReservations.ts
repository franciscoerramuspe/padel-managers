import { useState, useEffect } from 'react';

export const useUpcomingReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Aquí iría la llamada a la API real
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations/upcoming`);
        if (!response.ok) throw new Error('Error al cargar las reservas');
        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return { reservations, loading, error };
}; 