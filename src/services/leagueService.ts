import { LeagueMatch } from '@/types/league';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllLeagues = async (page = 1, pageSize = 10) => {
  const response = await fetch(`${API_URL}/leagues/all?page=${page}&pageSize=${pageSize}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Error al obtener las ligas: ${errorData}`);
  }

  return response.json();
};

export const getLeagueById = async (id: string) => {
  const response = await fetch(`${API_URL}/leagues/byId/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Error al obtener la liga: ${errorData}`);
  }

  return response.json();
};

export const updateMatchResult = async (matchId: string, result: {
  team1_sets1_won: number;
  team2_sets1_won: number;
  team1_sets2_won: number;
  team2_sets2_won: number;
  team1_tie1_won?: number;
  team2_tie1_won?: number;
  team1_tie2_won?: number;
  team2_tie2_won?: number;
  team1_tie3_won?: number;
  team2_tie3_won?: number;
}) => {
  const response = await fetch(`${API_URL}/leagues/match/result/${matchId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    body: JSON.stringify(result)
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar el resultado del partido');
    } catch (e) {
      // Si no podemos parsear la respuesta como JSON, mostramos el texto completo
      const text = await response.text();
      throw new Error(`Error al actualizar el resultado del partido: ${text}`);
    }
  }

  return response.json();
};

export const getLeagueStandings = async (leagueId: string) => {
  const response = await fetch(`${API_URL}/leagues/standings/${leagueId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Error al obtener las clasificaciones: ${errorData}`);
  }

  return response.json();
};

export const updateMatchSchedule = async (matchId: string, schedule: {
  date: string;
  time: string;
  status?: string;
  court_id?: string;
}) => {
  const response = await fetch(`${API_URL}/leagues/matches/${matchId}/schedule`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    body: JSON.stringify(schedule)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el horario del partido');
  }

  return response.json();
};

export const getMatchesByUserId = async (userId: string, page = 1, pageSize = 10) => {
  const response = await fetch(`${API_URL}/leagues/matches/user/${userId}?page=${page}&pageSize=${pageSize}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Error al obtener los partidos: ${errorData}`);
  }

  return response.json();
}; 