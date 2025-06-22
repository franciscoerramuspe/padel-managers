import { useState, useEffect } from 'react';
import { League } from '@/types/league';

export function useLeague(leagueId: string) {
  const [league, setLeague] = useState<League | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeagueDetails = async () => {
      if (!leagueId) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leagues/byId/${leagueId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch league details. Status: ${response.status}`);
        }
        
        const data: League = await response.json();
        setLeague(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching league details:", error);
        setError(error instanceof Error ? error.message : 'Error fetching league details');
        setLeague(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeagueDetails();
  }, [leagueId]);

  return {
    league,
    isLoading,
    error,
  };
} 