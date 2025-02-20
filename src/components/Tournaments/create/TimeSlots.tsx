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
    const daySlots = timeSlots.filter(slot => slot.day === day)
    const previousSlot = daySlots[currentIndex - 1]
    
    if (previousSlot) {
      return hours.filter(hour => hour > previousSlot.end)
    }
    
    return hours
  }

  const getAvailableEndHours = (day: string, startTime: string, currentIndex: number) => {
    const daySlots = timeSlots.filter(slot => slot.day === day)
    const nextSlot = daySlots[currentIndex + 1]
    
    return hours.filter(hour => {
      const isAfterStart = hour > startTime
      const beforeNextSlot = nextSlot ? hour < nextSlot.start : true
      return isAfterStart && beforeNextSlot
    })
  }

  const handleAddSlot = (dayInfo: { id: string, label: string }) => {
    const daySlots = timeSlots.filter(slot => slot.day === dayInfo.id);
    if (daySlots.length >= 3) return;

    const newSlot = {
      start: "08:00",
      end: "12:00",
      day: dayInfo.id,
      date: dayInfo.id,
      error: undefined
    };

    const newTimeSlots = [...timeSlots, newSlot];
    handleChange(newTimeSlots);
  };

  const getNextHour = (time: string) => {
    const hour = parseInt(time.split(':')[0])
    const nextHour = (hour + 4) % 24 // Sugerimos bloques de 4 horas por defecto
    return nextHour.toString().padStart(2, '0') + ":00"
  }

  const handleChangeTime = (index: number, type: 'start' | 'end', value: string) => {
    const newSlots = [...timeSlots];
    const slot = newSlots[index];
    
    // Actualizar el valor
    if (type === 'start') {
      slot.start = value;
      // Si la hora de fin es menor que la de inicio, ajustarla
      if (slot.end <= value) {
        slot.end = getNextHour(value);
      }
    } else {
      slot.end = value;
    }

    // Validar el slot
    delete slot.error;
    const overlappingSlot = newSlots.find((s, i) => 
      i !== index && 
      s.day === slot.day && 
      ((s.start <= slot.start && s.end > slot.start) ||
       (s.start < slot.end && s.end >= slot.end))
    );

    if (overlappingSlot) {
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
                            <SelectTrigger>
                              <SelectValue placeholder="Hora inicio" />
                            </SelectTrigger>
                            <SelectContent>
                              {hours.map((hour) => (
                                <SelectItem key={hour} value={hour}>
                                  {hour}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Select
                            value={slot.end}
                            onValueChange={(value) => handleChangeTime(index, 'end', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Hora fin" />
                            </SelectTrigger>
                            <SelectContent>
                              {hours.map((hour) => (
                                <SelectItem key={hour} value={hour}>
                                  {hour}
                                </SelectItem>
                              ))}
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
