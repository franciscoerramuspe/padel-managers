import { Clock, Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface TournamentScheduleProps {
  tournament: any;
}

export function TournamentSchedule({ tournament }: TournamentScheduleProps) {
  const timeSlots = tournament.time_slots || [];
  
  // Agrupar horarios por día
  const groupedSlots = timeSlots.reduce((acc: any, [start, end]: number[], index: number) => {
    // Calculamos el día basado en el índice (cada 3 slots es un nuevo día)
    const dayIndex = Math.floor(index / 3);
    
    // Crear fecha con zona horaria de Uruguay (UTC-3)
    const startDate = new Date(tournament.start_date + 'T00:00:00-03:00');
    const currentDate = addDays(startDate, dayIndex);
    
    // Formatear el día con la configuración de Uruguay
    const day = format(currentDate, 'EEEE d', { locale: es });
    
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push({ start, end });
    return acc;
  }, {});

  // Función para dividir los slots en grupos de 3
  const chunkSlots = (slots: any[]) => {
    const chunks = [];
    for (let i = 0; i < slots.length; i += 3) {
      chunks.push(slots.slice(i, i + 3));
    }
    return chunks;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-50 rounded-full p-3">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Horarios del Torneo</h2>
            <p className="text-sm text-gray-500">Horarios disponibles por día</p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedSlots).map(([day, slots]: [string, any]) => (
            <div key={day} className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">{day}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {slots.map(({ start, end }: { start: number, end: number }, index: number) => (
                  <div 
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-700 font-medium">
                          {start.toString().padStart(2, '0')}:00 - {end.toString().padStart(2, '0')}:00
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 