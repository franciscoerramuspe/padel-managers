'use client';

import { useEffect } from 'react';
import { TableIcon } from 'lucide-react';
import Header from '@/components/Header';
import { LeagueBasicInfo } from '@/components/Leagues/create/LeagueBasicInfo';
import { LeagueScheduleInfo } from '@/components/Leagues/create/LeagueScheduleInfo';
import { LeagueScoringInfo } from '@/components/Leagues/create/LeagueScoringInfo';
import { useCategories } from '@/hooks/useCategories';
import { Progress } from '@/components/ui/progress';
import { useLeagueForm } from '@/hooks/useLeagueForm';

export default function CreateLeaguePage() {
  const { categories, isLoading: isLoadingCategories, fetchCategories } = useCategories();
  const {
    step,
    formData,
    setFormData,
    isSubmitting,
    handleFirstStep,
    handleSecondStep,
    handleBack,
    handleCreateLeague
  } = useLeagueForm();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (isLoadingCategories) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <Header 
          title="Crear Nueva Liga"
          icon={<TableIcon className="w-6 h-6 text-foreground dark:text-foreground" />}
          description="Configure los detalles de su nueva liga."
        />
        
        <div className="mt-8">
          <div className="mb-8">
            <div className="flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Paso {step} de 3</span>
              <span>{Math.round((step / 3) * 100)}%</span>
            </div>
            <Progress 
              value={(step / 3) * 100} 
              className="h-2 bg-slate-200 dark:bg-slate-800" 
              indicatorClassName="bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700"
            />
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700">
            {step === 1 ? (
              <LeagueBasicInfo
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                onSubmit={handleFirstStep}
              />
            ) : step === 2 ? (
              <LeagueScheduleInfo
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSecondStep}
                onBack={handleBack}
                categories={categories}
              />
            ) : (
              <LeagueScoringInfo
                formData={formData}
                onSubmit={handleCreateLeague}
                onBack={handleBack}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}