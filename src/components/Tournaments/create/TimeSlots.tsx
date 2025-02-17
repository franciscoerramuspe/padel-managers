import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock } from "lucide-react"

interface TimeSlot {
  start: string
  end: string
}

interface TimeSlotsProps {
  timeSlots: TimeSlot[]
  onChange: (slots: TimeSlot[]) => void
}

export function TimeSlots({ timeSlots, onChange }: TimeSlotsProps) {
  const hours = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0') + ":00"
  )

  const handleAddSlot = () => {
    onChange([...timeSlots, { start: "09:00", end: "10:00" }])
  }

  const handleRemoveSlot = (index: number) => {
    const newSlots = timeSlots.filter((_, i) => i !== index)
    onChange(newSlots)
  }

  const handleChangeTime = (index: number, type: 'start' | 'end', value: string) => {
    const newSlots = [...timeSlots]
    newSlots[index] = {
      ...newSlots[index],
      [type]: value
    }
    onChange(newSlots)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Horarios Disponibles</Label>
        {timeSlots.length < 3 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSlot}
          >
            Agregar Horario
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {timeSlots.map((slot, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2 flex-1">
                  <Select
                    value={slot.start}
                    onValueChange={(value) => handleChangeTime(index, 'start', value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Inicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
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
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Fin" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 