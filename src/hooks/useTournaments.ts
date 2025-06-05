import { useState, useCallback, useEffect } from 'react';
import { TimeSlot, Tournament } from '@/types/tournament';
import useSWR from 'swr';
import { Team } from '@/types/team';
import { Player } from '@/types/player';

interface TournamentData {
  tournament: Tournament | null;
  teams: any[];
  matches: any[];
  tournaments: Tournament[];
  categories: any[];
  time_slots: TimeSlot[];
}

interface TournamentTeam {
  teams: {
    id: string;
    player1_id: string;
    player2_id: string;
    player1?: Player;
    player2?: Player;
    created_at: string;
    updated_at: string;
  };
  team_id: string;
  payment_status?: 'pending' | 'completed';
  payment_date?: string;
  payment_reference?: string;
}

export const useTournaments = (tournamentId?: string) => {
  const [data, setData] = useState<TournamentData>({
    tournament: null,
    teams: [],
    matches: [],
    tournaments: [],
    categories: [],
    time_slots: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: swrData, error: swrError, isLoading: swrLoading, mutate } = useSWR(
    tournamentId ? `/api/tournaments/${tournamentId}` : '/api/tournaments'
  );

  const fetchTournamentData = useCallback(async () => {
    if (!tournamentId) {
      // Si no hay ID, obtener todos los torneos
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments`);
        if (!response.ok) throw new Error('Error al cargar los torneos');
        
        const tournamentsData = await response.json();
        setData({
          tournament: null,
          teams: [],
          matches: [],
          tournaments: tournamentsData,
          categories: [],
          time_slots: []
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching tournaments:', err);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const [tournamentResponse, teamsResponse, matchesResponse, categoriesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournamentId}?include=category`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournamentId}/teams`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournamentId}/matches`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      ]);

      if (!tournamentResponse.ok || !teamsResponse.ok || !matchesResponse.ok || !categoriesResponse.ok) {
        throw new Error('Error al cargar los datos del torneo');
      }

      const [tournamentData, teamsData, matchesData, categoriesData] = await Promise.all([
        tournamentResponse.json(),
        teamsResponse.json(),
        matchesResponse.json(),
        categoriesResponse.json()
      ]);

      // Obtener los IDs únicos de todos los jugadores
      const playerIds = new Set(
        tournamentData.tournament_teams.flatMap((team: any) => [
          team.teams.player1_id,
          team.teams.player2_id
        ])
      );

      // Obtener la información de todos los jugadores
      const playersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players?ids=${Array.from(playerIds).join(',')}`);
      const playersData = await playersResponse.json();

      // Crear un mapa de jugadores para fácil acceso
      const playersMap = new Map(playersData.map((player: Player) => [player.id, player]));

      // Agregar la información de los jugadores a los equipos
      const teamsWithPlayers = tournamentData.tournament_teams.map((team: any) => ({
        ...team,
        teams: {
          ...team.teams,
          player1: playersMap.get(team.teams.player1_id),
          player2: playersMap.get(team.teams.player2_id)
        }
      }));

      setData({
        tournament: tournamentData,
        teams: teamsWithPlayers,
        matches: matchesData.matches || [],
        tournaments: data.tournaments,
        categories: categoriesData,
        time_slots: tournamentData.time_slots || []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching tournament data:', err);
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  const generateBracket = useCallback(async () => {
    if (!tournamentId) return;
    
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('No tienes permisos de administrador');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournamentId}/generate-bracket`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al generar el bracket');
      }

      const result = await response.json();
      setData(prev => ({
        ...prev,
        matches: result.scheduledMatches
      }));

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchTournamentData();
  }, [fetchTournamentData]);

  return {
    tournament: data.tournament,
    teams: data.teams,
    matches: data.matches,
    tournaments: data.tournaments,
    categories: data.categories,
    time_slots: data.time_slots,
    loading,
    error,
    refetch: fetchTournamentData,
    generateBracket,
    mutate
  };
};