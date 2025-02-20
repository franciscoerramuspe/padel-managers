import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"

interface TimeSlot {
  start: string;
  end: string;
  day: string;
  date: string;
  error?: string;
}

interface TimeSlotsProps {
  timeSlots: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
  startDate: string;
  endDate: string;
}

export function TimeSlots({ timeSlots = [], onChange, startDate, endDate }: TimeSlotsProps) {
  if (!startDate || !endDate) {
    return (
      <div className="text-center p-4 border border-dashed rounded-lg">
        <p className="text-muted-foreground text-sm">
          Por favor, selecciona las fechas de inicio y fin del torneo primero
        </p>
      </div>
    );
  }

  const hours = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0') + ":00"
  )

  const getDaysBetweenDates = () => {
    const start = new Date(startDate + 'T00:00:00')
    const end = new Date(endDate + 'T00:00:00')
    const days = []
    let current = start

    while (current <= end) {
      days.push({
        id: format(current, 'yyyy-MM-dd'),
        label: format(current, 'EEEE d', { locale: es }),
        date: format(current, 'yyyy-MM-dd')
      })
      current = addDays(current, 1)
    }

    return days
  }

  const days = getDaysBetweenDates()

  const getAvailableStartHours = (day: string, currentIndex: number) => {
    const daySlots = timeSlots.filter(slot => slot.day === day);
    const previousSlot = daySlots[currentIndex - 1];
    
    if (previousSlot) {
      // Convertir la hora de fin del slot anterior a número
      const prevEndHour = parseInt(previousSlot.end.split(':')[0]);
      // El siguiente slot debe empezar al menos 1 hora después
      const minStartHour = prevEndHour + 1;
      
      return hours.filter(hour => {
        const hourNum = parseInt(hour.split(':')[0]);
        return hourNum >= minStartHour;
      });
    }
    
    return hours;
  };

  const getAvailableEndHours = (day: string, startTime: string, currentIndex: number) => {
    const daySlots = timeSlots.filter(slot => slot.day === day);
    const nextSlot = daySlots[currentIndex + 1];
    const startHour = parseInt(startTime.split(':')[0]);
    
    return hours.filter(hour => {
      const hourNum = parseInt(hour.split(':')[0]);
      const isAfterStart = hourNum > startHour;
      
      if (nextSlot) {
        const nextStartHour = parseInt(nextSlot.start.split(':')[0]);
        // Debe terminar al menos 1 hora antes del siguiente slot
        return isAfterStart && hourNum < (nextStartHour - 1);
      }
      
      return isAfterStart;
    });
  };

  const handleAddSlot = (dayInfo: { id: string, label: string }) => {
    const daySlots = timeSlots.filter(slot => slot.day === dayInfo.id);
    if (daySlots.length >= 3) return;

    // Encontrar el último slot del día para sugerir el siguiente horario
    const lastSlot = daySlots[daySlots.length - 1];
    let suggestedStart = "08:00";
    let suggestedEnd = "12:00";

    if (lastSlot) {
      const lastEndHour = parseInt(lastSlot.end.split(':')[0]);
      suggestedStart = `${(lastEndHour + 1).toString().padStart(2, '0')}:00`;
      suggestedEnd = `${(lastEndHour + 5).toString().padStart(2, '0')}:00`;
    }

    const newSlot = {
      start: suggestedStart,
      end: suggestedEnd,
      day: dayInfo.id,
      date: dayInfo.id,
      error: undefined
    };

    const newTimeSlots = [...timeSlots, newSlot];
    onChange(newTimeSlots);
  };

  const getNextHour = (time: string) => {
    const hour = parseInt(time.split(':')[0])
    const nextHour = (hour + 4) % 24 // Sugerimos bloques de 4 horas por defecto
    return nextHour.toString().padStart(2, '0') + ":00"
  }

  const handleChangeTime = (index: number, type: 'start' | 'end', value: string) => {
    const newSlots = [...timeSlots];
    const slot = newSlots[index];
    
    // Obtener todos los slots del mismo día
    const daySlots = newSlots.filter(s => s.day === slot.day);
    const dayIndex = daySlots.findIndex(s => s === slot);
    
    if (type === 'start') {
      slot.start = value;
      // Ajustar automáticamente la hora de fin
      const startHour = parseInt(value.split(':')[0]);
      const endHour = startHour + 4; // Por defecto 4 horas después
      slot.end = endHour.toString().padStart(2, '0') + ":00";
    } else {
      slot.end = value;
    }

    // Validar el slot actual
    delete slot.error;
    
    // Validar que no haya solapamiento con otros slots del mismo día
    const otherDaySlots = daySlots.filter((_, i) => i !== dayIndex);
    const hasOverlap = otherDaySlots.some(otherSlot => {
      const otherStart = parseInt(otherSlot.start.split(':')[0]);
      const otherEnd = parseInt(otherSlot.end.split(':')[0]);
      const currentStart = parseInt(slot.start.split(':')[0]);
      const currentEnd = parseInt(slot.end.split(':')[0]);
      
      return (currentStart >= otherStart && currentStart < otherEnd) ||
             (currentEnd > otherStart && currentEnd <= otherEnd);
    });

    if (hasOverlap) {
      slot.error = "Los horarios no pueden solaparse";
    }

    onChange(newSlots);
  };

  const handleRemoveSlot = (index: number) => {
    const newSlots = timeSlots.filter((_, i) => i !== index)
    onChange(newSlots)
  }

  const getSlotsByDay = (day: string) => {
    return timeSlots.filter(slot => slot.day === day)
  }

  const handleChange = (slots: TimeSlot[]) => {
    onChange(slots.map(slot => ({
      ...slot,
      start: slot.start.toString(),
      end: slot.end.toString()
    })))
  }

  const isHourAvailable = (hour: string, dayId: string, currentSlotIndex: number, type: 'start' | 'end') => {
    const daySlots = timeSlots.filter(slot => slot.day === dayId);
    const currentSlot = daySlots[currentSlotIndex];
    
    return !daySlots.some((slot, index) => {
      if (index === currentSlotIndex) return false;
      
      const slotStart = parseInt(slot.start);
      const slotEnd = parseInt(slot.end);
      const currentHour = parseInt(hour);
      
      if (type === 'start') {
        return currentHour >= slotStart && currentHour <= slotEnd;
      } else {
        // Para hora de fin, permitir seleccionar después del inicio actual
        const currentStart = parseInt(currentSlot.start);
        return currentHour <= slotEnd && currentHour > currentStart;
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {days.map((day) => {
          const daySlots = getSlotsByDay(day.id)
          return (
            <Card key={day.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">{day.label}</Label>
                  {daySlots.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSlot(day)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar Horario
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {daySlots.length > 0 ? (
                  <div className="space-y-4">
                    {daySlots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                          <Select
                            value={slot.start}
                            onValueChange={(value) => handleChangeTime(index, 'start', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Hora inicio" />
                            </SelectTrigger>
                            <SelectContent>
                              {hours.map((hour) => {
                                const isDisabled = !isHourAvailable(hour, day.id, index, 'start');
                                return (
                                  <SelectItem 
                                    key={hour} 
                                    value={hour}
                                    disabled={isDisabled}
                                    className={cn(
                                      isDisabled && "text-gray-400 cursor-not-allowed"
                                    )}
                                  >
                                    {hour}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Select
                            value={slot.end}
                            onValueChange={(value) => handleChangeTime(index, 'end', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Hora fin" />
                            </SelectTrigger>
                            <SelectContent>
                              {hours.map((hour) => {
                                const isDisabled = !isHourAvailable(hour, day.id, index, 'end');
                                return (
                                  <SelectItem 
                                    key={hour} 
                                    value={hour}
                                    disabled={isDisabled}
                                    className={cn(
                                      isDisabled && "text-gray-400 cursor-not-allowed"
                                    )}
                                  >
                                    {hour}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSlot(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 border border-dashed rounded-lg">
                    <p className="text-muted-foreground text-sm">
                      No hay horarios configurados para {day.label.toLowerCase()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 
