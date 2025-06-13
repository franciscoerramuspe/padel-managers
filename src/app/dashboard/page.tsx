'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HomeIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import { DateTime } from '@/components/Dashboard/DateTime';
import { LeagueStatsCard } from '@/components/Dashboard/LeagueStatsCard';
import { LeagueScheduleCard } from '@/components/Dashboard/LeagueScheduleCard';
import { CategoryStandings } from '@/components/Dashboard/CategoryStandings';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUsers } from '@/hooks/useUsers';
import { useLeagues } from '@/hooks/useLeagues';
import { useCategories } from '@/hooks/useCategories';
import { useStandings } from '@/hooks/useStandings';

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { users, isLoading: isLoadingUsers } = useUsers();
  const { leagues, isLoading: isLoadingLeagues } = useLeagues();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { standings, isLoading: isLoadingStandings } = useStandings(selectedCategory);

  const totalUsers = useMemo(() => {
    if (!users) return 0;
    return users.length;
  }, [users]);

  useEffect(() => {
    if (!isLoadingCategories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, isLoadingCategories, selectedCategory]);

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
            <LeagueScheduleCard />
          </div>

          {/* Tabla de Posiciones con Tabs */}
          <div className="w-full bg-white dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Tabla de Posiciones
              </h2>
            </div>
            <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="mb-4">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="text-sm"
                  >
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
  );
}
