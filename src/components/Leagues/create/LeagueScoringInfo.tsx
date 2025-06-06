import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { LeagueFormData } from '@/hooks/useLeagueForm';

interface LeagueScoringInfoProps {
  formData: LeagueFormData;
  onSubmit: (data: LeagueFormData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

function InfoItem({ label, value, tooltip }: { label: string; value: string | number; tooltip: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <span className="text-lg font-semibold text-foreground">{value}</span>
      </div>
    </div>
  );
}

export function LeagueScoringInfo({ formData, onSubmit, onBack, isSubmitting }: LeagueScoringInfoProps) {
  return (
    <TooltipProvider>
      <div className="p-6 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            Configuración de Puntuación
          </h2>
          <p className="text-muted-foreground">
            Sistema de puntuación establecido para la liga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem
            label="Puntos por Victoria"
            value={formData.points_for_win}
            tooltip="Puntos otorgados por ganar un partido"
          />
          <InfoItem
            label="Puntos por Derrota con Set"
            value={formData.points_for_loss_with_set}
            tooltip="Puntos otorgados por perder ganando un set"
          />
          <InfoItem
            label="Puntos por Derrota"
            value={formData.points_for_loss}
            tooltip="Puntos otorgados por perder un partido"
          />
          <InfoItem
            label="Puntos por W.O."
            value={formData.points_for_walkover}
            tooltip="Puntos otorgados al equipo presente cuando el rival no se presenta"
          />
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
          <Button 
            onClick={() => onSubmit(formData)} 
            className="bg-primary hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando Liga...' : 'Crear Liga'}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
} 