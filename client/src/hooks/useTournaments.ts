import { useState, useCallback, useEffect } from 'react';
import { Tournament } from '@/types/tournament';

interface TournamentData {
  tournament: Tournament | null;
  teams: any[];
  matches: any[];
  tournaments: Tournament[];
}

export const useTournaments = (tournamentId?: string) => {
  const [data, setData] = useState<TournamentData>({
    tournament: null,
    teams: [],
    matches: [],
    tournaments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          tournaments: tournamentsData
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
      const [tournamentResponse, teamsResponse, matchesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournamentId}?include=category`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournamentId}/teams`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournamentId}/matches`)
      ]);

      if (!tournamentResponse.ok || !teamsResponse.ok || !matchesResponse.ok) {
        throw new Error('Error al cargar los datos del torneo');
      }

      const [tournamentData, teamsData, matchesData] = await Promise.all([
        tournamentResponse.json(),
        teamsResponse.json(),
        matchesResponse.json()
      ]);

      setData({
        tournament: tournamentData,
        teams: teamsData.teams || [],
        matches: matchesData.matches || [],
        tournaments: data.tournaments
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
    loading,
    error,
    refetch: fetchTournamentData,
    generateBracket
  };
};