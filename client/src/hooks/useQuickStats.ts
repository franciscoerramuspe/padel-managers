import { useState, useEffect } from 'react';
import { CalendarIcon, UsersIcon, ChartBarIcon, ScaleIcon } from '@heroicons/react/24/outline';

interface QuickStat {
  title: string;
  value: string;
  icon: any;
  color: string;
  hover: string;
  iconBg: string;
  href: string;
}

export const useQuickStats = (users: any[]) => {
  const [stats, setStats] = useState<QuickStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const quickStats = [
        { 
          title: 'Reservas Hoy', 
          value: '12', 
          icon: CalendarIcon,
          color: 'bg-gradient-to-r from-blue-400 to-blue-600',
          hover: 'hover:from-blue-500 hover:to-blue-700',
          iconBg: 'bg-blue-400/30',
          href: '/bookings'
        },
        { 
          title: 'Usuarios Registrados', 
          value: users?.length.toString() || '0', 
          icon: UsersIcon,
          color: 'bg-gradient-to-r from-purple-400 to-purple-600',
          hover: 'hover:from-purple-500 hover:to-purple-700',
          iconBg: 'bg-purple-400/30',
          href: '/users'
        },
        { 
          title: 'Canchas Registradas', 
          value: '8', 
          icon: ScaleIcon,
          color: 'bg-gradient-to-r from-orange-400 to-orange-600',
          hover: 'hover:from-orange-500 hover:to-orange-700',
          iconBg: 'bg-orange-400/30',
          href: '/courts'
        },
        { 
          title: 'Ingresos del Día', 
          value: '$1,250', 
          icon: ChartBarIcon,
          color: 'bg-gradient-to-r from-green-400 to-green-600',
          hover: 'hover:from-green-500 hover:to-green-700',
          iconBg: 'bg-green-400/30',
          href: '/finances'
        }
      ];
      setStats(quickStats);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
    }
  }, [users]);

  return { stats, loading, error };
}; 