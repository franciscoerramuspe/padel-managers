import { TournamentInfo, TournamentBase, TournamentFormData } from '@/types/tournament';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createTournament(formData: TournamentFormData) {
  const response = await fetch(`${API_URL}/tournaments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: formData.name,
      category_id: formData.category_id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      courts_available: formData.courts_available,
      time_slots: formData.time_slots,
      status: 'upcoming',
      tournament_info: formData.tournament_info
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el torneo');
  }

  return response.json();
} 