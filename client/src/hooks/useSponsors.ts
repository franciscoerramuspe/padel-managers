import { useState, useEffect } from 'react';

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}

export const useSponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSponsors = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sponsors`);
      if (!response.ok) throw new Error('Error al cargar los patrocinadores');
      const data = await response.json();
      setSponsors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching sponsors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createSponsor = async (formData: FormData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No estás autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sponsors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el patrocinador');
      }

      const data = await response.json();
      setSponsors(prev => [...prev, data.sponsor]);
      return data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  return {
    sponsors,
    isLoading,
    error,
    refreshSponsors: fetchSponsors,
    createSponsor
  };
}; 