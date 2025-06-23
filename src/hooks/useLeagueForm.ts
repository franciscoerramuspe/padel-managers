import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export interface LeagueFormData {
  name: string;
  categories: string[];
  description: string;
  inscription_cost: number;
  start_date: string;
  end_date: string;
  frequency: string;
  days_of_week: string[];
  category_days: Record<string, string[]>;
  courts_available: number;
  points_for_win: number;
  points_for_loss_with_set: number;
  points_for_loss: number;
  points_for_walkover: number;
  status: string;
  team_size: number;
}

const INITIAL_FORM_DATA: LeagueFormData = {
  name: '',
  categories: [],
  description: '',
  inscription_cost: 0,
  start_date: '',
  end_date: '',
  frequency: 'Quincenal',
  days_of_week: [],
  category_days: {},
  courts_available: 2,
  points_for_win: 2,
  points_for_loss_with_set: 1,
  points_for_loss: 0,
  points_for_walkover: 2,
  status: 'Inscribiendo',
  team_size: 8
};

export function useLeagueForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<LeagueFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFirstStep = (data: LeagueFormData) => {
    if (!Array.isArray(data.categories)) {
      toast({
        title: "Error de validación",
        description: "Las categorías deben ser un array",
        variant: "destructive"
      });
      return false;
    }

    if (data.categories.length < 3) {
      toast({
        title: "Error de validación",
        description: "Debes seleccionar al menos 3 categorías",
        variant: "destructive"
      });
      return false;
    }

    if (!data.name.trim()) {
      toast({
        title: "Error de validación",
        description: "El nombre de la liga es requerido",
        variant: "destructive"
      });
      return false;
    }

    if (data.inscription_cost <= 0) {
      toast({
        title: "Error de validación",
        description: "El costo de inscripción debe ser mayor a 0",
        variant: "destructive"
      });
      return false;
    }

    if (data.team_size < 4 || data.team_size > 16) {
      toast({
        title: "Error de validación",
        description: "El número de equipos debe estar entre 4 y 16",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const validateSecondStep = (data: LeagueFormData) => {
    if (!data.start_date || !data.end_date) {
      toast({
        title: "Error de validación",
        description: "Las fechas de inicio y fin son requeridas",
        variant: "destructive"
      });
      return false;
    }

    if (data.days_of_week.length === 0) {
      toast({
        title: "Error de validación",
        description: "Debes seleccionar al menos un día de juego",
        variant: "destructive"
      });
      return false;
    }

    if (!data.courts_available || data.courts_available < 1) {
      toast({
        title: "Error de validación",
        description: "Debe haber al menos una cancha disponible",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleFirstStep = (data: LeagueFormData) => {
    if (validateFirstStep(data)) {
      setFormData(data);
      setStep(2);
    }
  };

  const handleSecondStep = (data: LeagueFormData) => {
    if (validateSecondStep(data)) {
      setFormData(data);
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCreateLeague = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }

      // Usando horas enteras: 22:00 a 24:00 (medianoche)
      const dataToSend = {
        ...formData,
        time_slots: [[22, 24]], // Usando números enteros como requiere el backend
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leagues/createLeague`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la liga');
      }

      await response.json();
      toast({
        title: "Liga creada exitosamente",
        description: "Se han creado las ligas para todas las categorías seleccionadas",
      });
      router.push('/leagues');
    } catch (error) {
      console.error('Error creating league:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error al crear la liga',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    formData,
    setFormData,
    isSubmitting,
    handleFirstStep,
    handleSecondStep,
    handleBack,
    handleCreateLeague
  };
} 