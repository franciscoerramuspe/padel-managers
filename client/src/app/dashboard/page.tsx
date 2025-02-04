'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useUsers } from '@/hooks/useUsers';
import { useQuickStats } from '@/hooks/useQuickStats';
import { useUpcomingReservations } from '@/hooks/useUpcomingReservations';
import { useTournaments } from '@/hooks/useTournaments';
import { DashboardStats } from '@/components/Dashboard/DashboardStats';
import { UpcomingTournaments } from '@/components/Dashboard/UpcomingTournaments';
import { UpcomingReservations } from '@/components/Dashboard/UpcomingReservations';
import { DateTime } from '@/components/Dashboard/DateTime';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { HomeIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';

const ActiveUsers = dynamic(() => import('../../components/Dashboard/ActiveUsers'), {
  loading: () => <div className="animate-pulse bg-gray-100 h-64 rounded-xl"></div>,
  ssr: false
});

export default function Dashboard() {
  const { users, isLoading: usersLoading } = useUsers();
  const { stats, loading: statsLoading } = useQuickStats(users);
  const { reservations, loading: reservationsLoading } = useUpcomingReservations();
  const { tournaments: upcomingTournaments, loading: tournamentsLoading } = useTournaments();

  if (usersLoading || statsLoading || reservationsLoading || tournamentsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        <Header 
          title="Inicio"
          description="Visualiza las estadísticas y la información general."
          icon={<HomeIcon className="w-6 h-6" />}
        />
        
        <DateTime />
        <DashboardStats stats={stats} />
        <UpcomingTournaments tournaments={upcomingTournaments} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
          <UpcomingReservations reservations={reservations} />
          <ActiveUsers />
        </div>
      </div>
    </div>
  );
}
