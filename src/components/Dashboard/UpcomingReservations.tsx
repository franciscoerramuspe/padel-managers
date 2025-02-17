import { Clock, Users } from 'lucide-react';

interface Reservation {
  id: number;
  court: string;
  time: string;
  players: string[];
  type: string;
}

interface UpcomingReservationsProps {
  reservations: Reservation[];
}

export const UpcomingReservations = ({ reservations }: UpcomingReservationsProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Próximas Reservas</h2>
      
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div 
            key={reservation.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h3 className="font-medium text-gray-900">{reservation.court}</h3>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {reservation.time}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Users className="h-4 w-4 mr-1" />
                  {reservation.players.length} jugadores
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              reservation.type === 'padel' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {reservation.type === 'padel' ? 'Pádel' : 'Fútbol'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}; 