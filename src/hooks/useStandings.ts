import { useState, useEffect } from 'react';
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

export function useStandings(categoryId?: string) {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStandings = async () => {
      if (!categoryId) {
        setStandings([]);
        return;
      }

      try {
        setIsLoading(true);
        
        // Primero obtenemos las ligas de la categoría
        const { data: leagues, error: leaguesError } = await supabase
          .from('leagues')
          .select('id')
          .eq('category_id', categoryId)
          .eq('status', 'Activa');

        if (leaguesError) throw leaguesError;
        if (!leagues?.length) {
          setStandings([]);
          return;
        }

        // Luego obtenemos los standings de todas esas ligas
        const leagueIds = leagues.map(l => l.id);
        const { data: standingsData, error: standingsError } = await supabase
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
          .in('league_id', leagueIds)
          .order('points', { ascending: false });

        if (standingsError) throw standingsError;
        setStandings(standingsData || []);
      } catch (error: any) {
        console.error('Error fetching standings:', error);
        toast.error('Error al cargar la tabla de posiciones');
        setStandings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStandings();
  }, [categoryId]);

  return {
    standings,
    isLoading
  };
} 