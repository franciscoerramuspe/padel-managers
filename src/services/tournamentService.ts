import { TimeSlot } from '@/types/tournament';

export const createTournament = async (tournamentData: {
  name: string;
  category_id: string;
  start_date: string;
  end_date: string;
  status: string;
  courts_available: number;
  time_slots: [number, number][];
}) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  console.log('URL de la petición:', `${API_URL}/tournaments/create`);
  console.log('Datos enviados al endpoint:', tournamentData);
  
  const response = await fetch(`${API_URL}/tournaments/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    body: JSON.stringify(tournamentData),
  });

  console.log('Status de la respuesta:', response.status);
  if (!response.ok) {
    const errorData = await response.text();
    console.error('Error detallado:', errorData);
    throw new Error(`Error al crear el torneo: ${errorData}`);
  }

  return response.json();
};

export const setTournamentRequiredInfo = async (
  tournamentId: string,
  tournamentInfo: {
    description: string;
    rules: string;
    tournament_location: string;
    tournament_address: string;
    tournament_club_name: string;
    signup_limit_date: string;
    inscription_cost: number;
    first_place_prize: string;
    second_place_prize?: string;
    third_place_prize?: string;
    tournament_thumbnail?: string;
    sponsors?: string[];
    time_slots?: TimeSlot[];
  }
) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/tournaments/${tournamentId}/required-info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    body: JSON.stringify(tournamentInfo),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Error al guardar la información adicional: ${errorData}`);
  }

  return response.json();
}; 