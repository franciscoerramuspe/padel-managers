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
      <h2 className="text-lg font-semibold mb-6">Configuración de Horarios</h2>
      
      <div className="space-y-6">
        <div>
          <Label className="text-base">Días de Juego</Label>
          <p className="text-sm text-gray-500 mb-3">
            Selecciona los días en que se jugará esta categoría
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {day}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="schedule">Horario de Juego</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-500">Hora inicio</Label>
              <Select
                value="22:30"
                onValueChange={(value) => {
                  const timeSlots = formData.time_slots;
                  timeSlots[0] = value;
                  setFormData({ ...formData, time_slots: timeSlots });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hora inicio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="22:30">22:30</SelectItem>
                  <SelectItem value="23:00">23:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Hora fin</Label>
              <Select
                value="00:00"
                onValueChange={(value) => {
                  const timeSlots = formData.time_slots;
                  timeSlots[timeSlots.length - 1] = value;
                  setFormData({ ...formData, time_slots: timeSlots });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hora fin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="23:30">23:30</SelectItem>
                  <SelectItem value="00:00">00:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="frequency">Frecuencia</Label>
          <Select
            value={formData.frequency}
            onValueChange={(value) => setFormData({ ...formData, frequency: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona la frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semanal">Semanal</SelectItem>
              <SelectItem value="Quincenal">Quincenal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duration">Duración (meses)</Label>
          <Input
            id="duration"
            type="number"
            min={1}
            max={6}
            value={formData.duration_months}
            onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) })}
          />
          <p className="text-sm text-gray-500 mt-1">
            Duración estimada de la liga (entre 3 y 4 meses recomendado)
          </p>
        </div>

        <div className="pt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button onClick={onSubmit}>
            Crear Liga
          </Button>
        </div>
      </div>
    </div>
  );
} 