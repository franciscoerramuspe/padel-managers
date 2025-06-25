'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HomeIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import { DateTime } from '@/components/Dashboard/DateTime';
import { LeagueStatsCard } from '@/components/Dashboard/LeagueStatsCard';
import { LeagueScheduleCard } from '@/components/Dashboard/LeagueScheduleCard';
import { CategoryStandings } from '@/components/Dashboard/CategoryStandings';
import { LeagueRegistrationProgress } from '@/components/Dashboard/LeagueRegistrationProgress';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useLeagues } from '@/hooks/useLeagues';
import { useCategories } from '@/hooks/useCategories';
import { useStandings } from '@/hooks/useStandings';

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isStatsOpen, setIsStatsOpen] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(true);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isStandingsOpen, setIsStandingsOpen] = useState(true);
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
          <Collapsible.Root
            open={isStatsOpen}
            onOpenChange={setIsStatsOpen}
            className="w-full"
          >
            <Card className="w-full bg-white dark:bg-[#0E1629] border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <Collapsible.Trigger asChild>
                <CardHeader className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${isStatsOpen ? 'border-b border-gray-200 dark:border-gray-700/50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                      Estadísticas Generales
                    </CardTitle>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isStatsOpen ? 'transform rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <CardContent className="p-6">
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
                </CardContent>
              </Collapsible.Content>
            </Card>
          </Collapsible.Root>

          {/* Próximos Partidos */}
          <Collapsible.Root
            open={isScheduleOpen}
            onOpenChange={setIsScheduleOpen}
            className="w-full"
          >
            <Card className="w-full bg-white dark:bg-[#0E1629] border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <Collapsible.Trigger asChild>
                <CardHeader className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${isScheduleOpen ? 'border-b border-gray-200 dark:border-gray-700/50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                      Próximos Partidos
                    </CardTitle>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isScheduleOpen ? 'transform rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <CardContent className="p-0">
                  <LeagueScheduleCard />
                </CardContent>
              </Collapsible.Content>
            </Card>
          </Collapsible.Root>

          {/* Progreso de Inscripciones */}
          <Collapsible.Root
            open={isRegistrationOpen}
            onOpenChange={setIsRegistrationOpen}
            className="w-full"
          >
            <Card className="w-full bg-white dark:bg-[#0E1629] border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <Collapsible.Trigger asChild>
                <CardHeader className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${isRegistrationOpen ? 'border-b border-gray-200 dark:border-gray-700/50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                      Progreso de Inscripciones
                    </CardTitle>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isRegistrationOpen ? 'transform rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <CardContent className="p-6">
                  <LeagueRegistrationProgress
                    leagues={leagues}
                    categories={categories}
                  />
                </CardContent>
              </Collapsible.Content>
            </Card>
          </Collapsible.Root>

          {/* Tabla de Posiciones */}
          <Collapsible.Root
            open={isStandingsOpen}
            onOpenChange={setIsStandingsOpen}
            className="w-full"
          >
            <Card className="w-full bg-white dark:bg-[#0E1629] border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <Collapsible.Trigger asChild>
                <CardHeader className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${isStandingsOpen ? 'border-b border-gray-200 dark:border-gray-700/50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                      Tabla de Posiciones
                    </CardTitle>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isStandingsOpen ? 'transform rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <CardContent className="p-6">
                  <CategoryStandings
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    standings={standings}
                    isLoading={isLoadingStandings}
                  />
                </CardContent>
              </Collapsible.Content>
            </Card>
          </Collapsible.Root>
        </div>
      </div>
    </div>
  );
}
