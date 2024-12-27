'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ScheduleData {
  court_id: string;
  start_time: string;
  end_time: string;
}

interface ScheduleMatchModalProps {
  isOpen: boolean;
  matchId: string | null;
  onClose: () => void;
  onSchedule: (matchId: string, scheduleData: ScheduleData) => Promise<void>;
}

export function ScheduleMatchModal({ isOpen, matchId, onClose, onSchedule }: ScheduleMatchModalProps) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
  const [courts, setCourts] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch courts when modal opens
  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:3001/api/courts')
        .then(res => res.json())
        .then(data => setCourts(data))
        .catch(error => {
          console.error('Error fetching courts:', error);
          toast({
            title: "Error",
            description: "No se pudieron cargar las canchas",
            variant: "destructive",
          });
        });
    }
  }, [isOpen]);

  // Fetch availability when court and date are selected
  useEffect(() => {
    if (selectedCourt && selectedDate) {
      setIsLoading(true);
      fetch(`http://localhost:3001/api/courts/${selectedCourt}/availability?date=${selectedDate}`)
        .then(res => res.json())
        .then(data => {
          // Format the slots properly
          const formattedSlots = data.availableSlots.map((slot: any) => ({
            start: slot.start,
            end: slot.end,
            label: `${slot.start} - ${slot.end}` // For display
          }));
          setAvailableSlots(formattedSlots);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching availability:', error);
          toast({
            title: "Error",
            description: "No se pudo cargar la disponibilidad",
            variant: "destructive",
          });
          setIsLoading(false);
        });
    }
  }, [selectedCourt, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchId || !selectedSlot) return;

    setIsLoading(true);
    try {
      // Format the times properly
      const startHour = selectedSlot.start.split(':')[0].padStart(2, '0');
      const endHour = selectedSlot.end.split(':')[0].padStart(2, '0');

      const startTime = `${selectedDate}T${startHour}:00:00`;
      const endTime = `${selectedDate}T${endHour}:00:00`;

      console.log('Submitting times:', { startTime, endTime }); // Debug log

      await onSchedule(matchId, {
        court_id: selectedCourt,
        start_time: startTime,
        end_time: endTime
      });

      toast({
        title: "Éxito",
        description: "Partido programado correctamente",
      });
      onClose();
    } catch (error) {
      console.error('Schedule error:', error);
      toast({
        title: "Error",
        description: "No se pudo programar el partido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Programar Partido</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Fecha</label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 pl-10 border rounded"
                min={format(new Date(), 'yyyy-MM-dd')}
                required
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          {/* Court Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Cancha</label>
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona una cancha</option>
              {courts.map(court => (
                <option key={court.id} value={court.id}>{court.name}</option>
              ))}
            </select>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Hora</label>
            <select
              value={selectedSlot ? selectedSlot.start : ''}
              onChange={(e) => setSelectedSlot({ start: e.target.value, end: selectedSlot?.end || '' })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona una hora</option>
              {availableSlots.map(slot => (
                <option key={slot.start} value={slot.start}>{slot.start} - {slot.end}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Scheduling..." : "Schedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
