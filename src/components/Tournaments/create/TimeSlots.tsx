import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeSlot {
  start: string
  end: string
  day: 'friday' | 'saturday' | 'sunday'
  error?: string
}

interface TimeSlotsProps {
  timeSlots: TimeSlot[]
  onChange: (slots: TimeSlot[]) => void
}

export function TimeSlots({ timeSlots, onChange }: TimeSlotsProps) {
  const hours = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0') + ":00"
  )

  const days = [
    { id: 'friday', label: 'Viernes' },
    { id: 'saturday', label: 'Sábado' },
    { id: 'sunday', label: 'Domingo' }
  ]

  const getAvailableStartHours = (day: string, currentIndex: number) => {
    const daySlots = timeSlots.filter(slot => slot.day === day)
    const previousSlot = daySlots[currentIndex - 1]
    
    if (previousSlot) {
      // Si hay un slot anterior, solo permitir horas después del final del slot anterior
      return hours.filter(hour => hour >= previousSlot.end)
    }
    
    return hours
  }

  const getAvailableEndHours = (day: string, startTime: string, currentIndex: number) => {
    const daySlots = timeSlots.filter(slot => slot.day === day)
    const nextSlot = daySlots[currentIndex + 1]
    
    return hours.filter(hour => {
      // La hora de fin debe ser mayor que la hora de inicio
      const isAfterStart = hour > startTime
      // Si hay un siguiente slot, la hora de fin debe ser menor o igual a su hora de inicio
      const beforeNextSlot = nextSlot ? hour <= nextSlot.start : true
      return isAfterStart && beforeNextSlot
    })
  }

  const handleAddSlot = (day: 'friday' | 'saturday' | 'sunday') => {
    const daySlots = timeSlots.filter(slot => slot.day === day)
    if (daySlots.length >= 3) return

    const lastSlot = daySlots[daySlots.length - 1]
    const newStartTime = lastSlot ? lastSlot.end : "08:00"
    const newEndTime = getNextHour(newStartTime)

    onChange([
      ...timeSlots,
      { start: newStartTime, end: newEndTime, day }
    ])
  }

  const getNextHour = (time: string) => {
    const hour = parseInt(time.split(':')[0])
    const nextHour = (hour + 4) % 24 // Sugerimos bloques de 4 horas por defecto
    return nextHour.toString().padStart(2, '0') + ":00"
  }

  const handleChangeTime = (index: number, type: 'start' | 'end', value: string) => {
    const newSlots = [...timeSlots]
    const slot = newSlots[index]
    const daySlots = newSlots.filter(s => s.day === slot.day)
    const dayIndex = daySlots.findIndex(s => s === slot)

    // Limpiar error previo
    delete newSlots[index].error

    if (type === 'start') {
      if (value >= slot.end) {
        newSlots[index].error = "La hora de inicio debe ser menor que la hora de fin"
        onChange(newSlots)
        return
      }
      const prevSlot = daySlots[dayIndex - 1]
      if (prevSlot && value < prevSlot.end) {
        newSlots[index].error = "La hora de inicio debe ser posterior al horario anterior"
        onChange(newSlots)
        return
      }
    } else {
      if (value <= slot.start) {
        newSlots[index].error = "La hora de fin debe ser mayor que la hora de inicio"
        onChange(newSlots)
        return
      }
      const nextSlot = daySlots[dayIndex + 1]
      if (nextSlot && value > nextSlot.start) {
        newSlots[index].error = "La hora de fin debe ser anterior al siguiente horario"
        onChange(newSlots)
        return
      }
    }

    newSlots[index] = {
      ...slot,
      [type]: value
    }
    onChange(newSlots)
  }

  const handleRemoveSlot = (index: number) => {
    const newSlots = timeSlots.filter((_, i) => i !== index)
    onChange(newSlots)
  }

  const getSlotsByDay = (day: string) => {
    return timeSlots.filter(slot => slot.day === day)
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
                      onClick={() => handleAddSlot(day.id as 'friday' | 'saturday' | 'sunday')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar Horario
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {daySlots.length > 0 ? (
                  <div className="space-y-3">
                    {daySlots.map((slot, slotIndex) => {
                      const index = timeSlots.findIndex(s => s === slot)
                      return (
                        <div key={slotIndex} className="space-y-2">
                          <div className={cn(
                            "flex items-center gap-2 p-2 rounded-md",
                            slot.error ? "bg-red-50" : "bg-slate-50"
                          )}>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Select
                              value={slot.start}
                              onValueChange={(value) => handleChangeTime(index, 'start', value)}
                            >
                              <SelectTrigger className={cn(
                                "w-[120px]",
                                slot.error && "border-red-500"
                              )}>
                                <SelectValue placeholder="Inicio" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableStartHours(day.id, slotIndex).map((hour) => (
                                  <SelectItem key={hour} value={hour}>
                                    {hour}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <span className="text-muted-foreground">hasta</span>

                            <Select
                              value={slot.end}
                              onValueChange={(value) => handleChangeTime(index, 'end', value)}
                            >
                              <SelectTrigger className={cn(
                                "w-[120px]",
                                slot.error && "border-red-500"
                              )}>
                                <SelectValue placeholder="Fin" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableEndHours(day.id, slot.start, slotIndex).map((hour) => (
                                  <SelectItem key={hour} value={hour}>
                                    {hour}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSlot(index)}
                            >
                              Eliminar
                            </Button>
                          </div>
                          {slot.error && (
                            <p className="text-sm text-red-500 pl-6">
                              {slot.error}
                            </p>
                          )}
                        </div>
                      )
                    })}
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