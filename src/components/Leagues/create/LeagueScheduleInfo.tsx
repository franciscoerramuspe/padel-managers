import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

interface LeagueScheduleInfoProps {
  formData: any;
  setFormData: (data: any) => void;
  days: string[];
  onSubmit: () => void;
  onBack: () => void;
}

export function LeagueScheduleInfo({ 
  formData, 
  setFormData, 
  days, 
  onSubmit, 
  onBack 
}: LeagueScheduleInfoProps) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-6 text-foreground dark:text-foreground">Configuración de Horarios</h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="frequency" className="text-foreground dark:text-foreground">Frecuencia</Label>
          <Select
            value={formData.frequency}
            onValueChange={(value) => setFormData({ ...formData, frequency: value })}
          >
            <SelectTrigger className="bg-background dark:bg-background border-border">
              <SelectValue placeholder="Selecciona la frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semanal">Semanal</SelectItem>
              <SelectItem value="Quincenal">Quincenal</SelectItem>
              <SelectItem value="Mensual">Mensual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-foreground dark:text-foreground">Días de Juego</Label>
          <div className="mt-2 space-y-2">
            {days.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={day}
                  checked={formData.days_of_week.includes(day)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({
                        ...formData,
                        days_of_week: [...formData.days_of_week, day]
                      });
                    } else {
                      setFormData({
                        ...formData,
                        days_of_week: formData.days_of_week.filter((d: string) => d !== day)
                      });
                    }
                  }}
                />
                <label
                  htmlFor={day}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground dark:text-foreground"
                >
                  {day}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="duration" className="text-foreground dark:text-foreground">Duración (meses)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            max="12"
            value={formData.duration_months}
            onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) })}
            className="bg-background dark:bg-background border-border"
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
          <Button onClick={onSubmit} className="bg-primary hover:bg-primary/90">
            Crear Liga
          </Button>
        </div>
      </div>
    </div>
  );
} 