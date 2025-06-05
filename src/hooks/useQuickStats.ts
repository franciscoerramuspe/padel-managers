import { useState, useEffect } from 'react';
import { UsersIcon, CalendarDaysIcon, TrophyIcon, BanknotesIcon } from '@heroicons/react/24/outline';

interface Stats {
  totalUsers: number;
  totalSponsors: number;
  activeTournaments: number;
  monthlyIncome: number;
}

export const useQuickStats = (users: any[], tournaments: any[], sponsors: any[]) => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSponsors: 0,
    activeTournaments: 0,
    monthlyIncome: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const totalUsers = users?.filter(user => user.role === 'user').length || 0;
      const totalSponsors = sponsors?.length || 0;
      const activeTournaments = tournaments?.filter(tournament => tournament.status === 'upcoming').length || 0;

      setStats({
        totalUsers,
        totalSponsors,
        activeTournaments,
        monthlyIncome: 0
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    } finally {
      setLoading(false);
    }
  }, [users, tournaments, sponsors]);

  return { stats, loading };
}; 