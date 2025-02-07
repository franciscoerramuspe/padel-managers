import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

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

  const deleteSponsor = async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No estás autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sponsors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar el patrocinador');
      }

      setSponsors(prev => prev.filter(sponsor => sponsor.id !== id));
      toast({
        title: "Éxito",
        description: "Patrocinador eliminado correctamente",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Error al eliminar el patrocinador",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateSponsor = async (id: string, formData: FormData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No estás autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sponsors/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar el patrocinador');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      throw err;
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
    deleteSponsor,
    updateSponsor,
    createSponsor
  };
}; 