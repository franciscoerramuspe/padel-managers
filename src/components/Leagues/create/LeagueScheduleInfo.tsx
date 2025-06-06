import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryDayAssignment } from './CategoryDayAssignment';
import { Category } from '@/hooks/useCategories';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useCourts } from '@/hooks/useCourts';

const FREQUENCIES = ['Semanal', 'Quincenal', 'Mensual'];

interface LeagueScheduleInfoProps {
  formData: {
    start_date: string;
    end_date: string;
    frequency: string;
    days_of_week: string[];
    categories: string[];
  };
  setFormData: (data: any) => void;
  onSubmit: (data: any) => void;
  onBack: () => void;
  categories: Category[];
}

function LabelWithTooltip({ htmlFor, label, tooltip }: { htmlFor?: string; label: string; tooltip: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Label htmlFor={htmlFor} className="text-foreground dark:text-foreground">
        {label}
      </Label>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function LeagueScheduleInfo({
  formData,
  setFormData,
  onSubmit,
  onBack,
  categories,
}: LeagueScheduleInfoProps) {
  const { courts, isLoading: isLoadingCourts, fetchCourts } = useCourts();

  useEffect(() => {
    fetchCourts();
  }, []);

  const handleDaysAssigned = (categoryDays: Record<string, string[]>) => {
    const allDays = new Set<string>();
    Object.values(categoryDays).forEach((days) => {
      days.forEach((day) => allDays.add(day));
    });

    setFormData({
      ...formData,
      days_of_week: Array.from(allDays),
      category_days: categoryDays,
    });
  };

  return (
    <TooltipProvider>
      <div className="p-6 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground dark:text-foreground">
            Configuración de Horarios
          </h2>
          <p className="text-muted-foreground">
            Define los días y horarios en los que se jugarán los partidos de la liga.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <LabelWithTooltip
                htmlFor="start_date"
                label="Fecha de Inicio"
                tooltip="Fecha en la que comenzará la liga"
              />
              <Input
                type="date"
                id="start_date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="bg-transparent dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary"
              />
            </div>

            <div>
              <LabelWithTooltip
                htmlFor="end_date"
                label="Fecha de Fin"
                tooltip="Fecha en la que terminará la liga"
              />
              <Input
                type="date"
                id="end_date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="bg-transparent dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <LabelWithTooltip
              htmlFor="frequency"
              label="Frecuencia"
              tooltip="Con qué frecuencia se jugarán los partidos"
            />
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData({ ...formData, frequency: value })}
            >
              <SelectTrigger
                id="frequency"
                className="bg-transparent dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary"
              >
                <SelectValue placeholder="Selecciona la frecuencia" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                {FREQUENCIES.map((freq) => (
                  <SelectItem key={freq} value={freq} className="dark:hover:bg-slate-700">
                    {freq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <LabelWithTooltip
              label="Asignación de Días por Categoría"
              tooltip="Arrastra los días a cada categoría para definir cuándo se jugarán los partidos"
            />
            <CategoryDayAssignment
              selectedCategories={formData.categories}
              categories={categories}
              onDaysAssigned={handleDaysAssigned}
            />
          </div>

          <div>
            <LabelWithTooltip
              label="Canchas Disponibles"
              tooltip="Cantidad de canchas disponibles para jugar simultáneamente"
            />
            <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              {isLoadingCourts ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Cargando canchas...</p>
                </div>
              ) : courts && courts.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Total de canchas disponibles:</span>
                    <span className="text-sm text-foreground">{courts.length}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {courts.map(court => court.name).join(', ')}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-destructive">No hay canchas disponibles</p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center border-border"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <Button onClick={() => onSubmit(formData)} className="bg-primary hover:bg-primary/90">
            Continuar
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
} 