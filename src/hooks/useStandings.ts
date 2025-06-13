import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export interface Standing {
  id: string;
  league_id: string;
  team_id: string;
  points: number;
  wins: number;
  losses: number;
  sets_won: number;
  sets_lost: number;
  games_played: number;
  sets_difference: number;
  team?: {
    player1: {
      first_name: string;
      last_name: string;
    };
    player2: {
      first_name: string;
      last_name: string;
    };
  };
}

export function useStandings() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getStandingsByLeague = useCallback(async (leagueId: string) => {
    try {
      setIsLoading(true);
      
      const { data: standingsData, error } = await supabase
        .from('league_standings')
        .select(`
          *,
          team:team_id (
            player1:player1_id (
              first_name,
              last_name
            ),
            player2:player2_id (
              first_name,
              last_name
            )
          )
        `)
        .eq('league_id', leagueId)
        .order('points', { ascending: false });

      if (error) throw error;

      setStandings(standingsData || []);
      return standingsData;
    } catch (error: any) {
      toast.error('Error al cargar la tabla de posiciones');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStandingById = useCallback(async (standingId: string) => {
    try {
      setIsLoading(true);
      const { data: standing, error } = await supabase
        .from('league_standings')
        .select(`
          *,
          team:team_id (
            player1:player1_id (
              first_name,
              last_name
            ),
            player2:player2_id (
              first_name,
              last_name
            )
          )
        `)
        .eq('id', standingId)
        .single();

      if (error) throw error;

      return standing;
    } catch (error: any) {
      toast.error('Error al cargar el standing específico');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    standings,
    isLoading,
    getStandingsByLeague,
    getStandingById
  };
} 