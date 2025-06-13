'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HomeIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import { DateTime } from '@/components/Dashboard/DateTime';
import { LeagueStatsCard } from '@/components/Dashboard/LeagueStatsCard';
import { LeagueScheduleCard } from '@/components/Dashboard/LeagueScheduleCard';
import { CategoryStandings } from '@/components/Dashboard/CategoryStandings';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUpcomingMatches } from '@/mocks/matchesData';
import { useUsers } from '@/hooks/useUsers';
import { useLeagues } from '@/hooks/useLeagues';
import { useCategories } from '@/hooks/useCategories';
import { useStandings } from '@/hooks/useStandings';

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  
  const { users, isLoading: isLoadingUsers } = useUsers();
  const { leagues, isLoading: isLoadingLeagues } = useLeagues();
  const { categories } = useCategories();
  const { standings, isLoading: isLoadingStandings, getStandingsByLeague } = useStandings();
  
  // Memoizar el total de usuarios para evitar recálculos innecesarios
  const totalUsers = useMemo(() => 
    users?.filter(user => user.role === 'user').length || 0,
    [users]
  );

  // Memoizar las ligas por categoría
  const leaguesByCategory = useMemo(() => {
    if (!leagues.length || !selectedCategory) return [];
    
    return leagues
      .filter(l => l.category_id === selectedCategory)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [leagues, selectedCategory]);

  // Callback para cambio de categoría
  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  // Efecto para cargar la primera categoría por defecto
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // Efecto para encontrar la liga correspondiente a la categoría seleccionada
  useEffect(() => {
    if (leaguesByCategory.length > 0) {
      const activeLeague = leaguesByCategory.find(l => l.status === 'Activa') || leaguesByCategory[0];
      setSelectedLeague(activeLeague?.id || null);
    }
  }, [leaguesByCategory]);

  // Efecto para cargar los standings cuando cambia la liga seleccionada
  useEffect(() => {
    if (selectedLeague) {
      getStandingsByLeague(selectedLeague);
    }
  }, [selectedLeague, getStandingsByLeague]);

  // Memoizar el nombre de la categoría seleccionada
  const selectedCategoryName = useMemo(() => 
    categories.find(cat => cat.id === selectedCategory)?.name || '',
    [categories, selectedCategory]
  );

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
              title="Categorías activas"
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
              value={0}
              type="matches"
            />
            <LeagueStatsCard 
              title="Partidos Completados"
              value={0}
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
              <Tabs 
                defaultValue={selectedCategory || ''} 
                value={selectedCategory || ''} 
                onValueChange={handleCategoryChange}
                className="w-full"
              >
                <TabsList className="mb-6">
                  {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <CategoryStandings 
                  category={selectedCategoryName}
                  standings={standings}
                  isLoading={isLoadingStandings}
                />
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
