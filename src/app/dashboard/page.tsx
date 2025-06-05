'use client';

import React, { useState } from 'react';
import { HomeIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import { DateTime } from '@/components/Dashboard/DateTime';
import { LeagueStatsCard } from '@/components/Dashboard/LeagueStatsCard';
import { LeagueScheduleCard } from '@/components/Dashboard/LeagueScheduleCard';
import { CategoryStandings } from '@/components/Dashboard/CategoryStandings';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockStats } from '@/mocks/statsData';
import { mockUpcomingMatches } from '@/mocks/matchesData';
import { mockStandings } from '@/mocks/standingsData';
import { useUsers } from '@/hooks/useUsers';
import { useLeagues } from '@/hooks/useLeagues';

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState('4ta');
  const { users, isLoading: isLoadingUsers } = useUsers();
  const { leagues, isLoading: isLoadingLeagues } = useLeagues();
  
  // Calculamos el total de usuarios con rol 'user'
  const totalUsers = users?.filter(user => user.role === 'user').length || 0;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="flex flex-col space-y-6">
          {/* Header y Fecha */}
          <div className="flex flex-col space-y-6">
            <Header 
              title="Panel de Control"
              description="Gestión y visualización de ligas de pádel."
              icon={<HomeIcon className="w-6 h-6 text-gray-900 dark:text-gray-100" />}
            />
            <DateTime />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6">
            <LeagueStatsCard 
              title="Ligas Activas"
              value={isLoadingLeagues ? 0 : leagues.length}
              type="active"
            />
            <LeagueStatsCard 
              title="Total Jugadores"
              value={isLoadingUsers ? 0 : totalUsers}
              type="teams"
            />
            <LeagueStatsCard 
              title="Partidos Totales"
              value={mockStats.totalMatches}
              type="matches"
            />
            <LeagueStatsCard 
              title="Partidos Completados"
              value={mockStats.completedMatches}
              type="completed"
            />
          </div>

          {/* Próximos Partidos */}
          <div className="w-full">
            <LeagueScheduleCard matches={mockUpcomingMatches} />
          </div>

          {/* Tabla de Posiciones con Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Tabla de Posiciones
              </h2>
              <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                <TabsList className="mb-6">
                  {Object.keys(mockStandings).map((category) => (
                    <TabsTrigger key={category} value={category}>
                      Categoría {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <CategoryStandings 
                  category={selectedCategory}
                  standings={mockStandings[selectedCategory as keyof typeof mockStandings]}
                />
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
