import { useEffect, useState } from 'react';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export function DateTime() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000); 
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <CalendarIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha actual</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {formatDate(date)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 p-3 rounded-xl">
              <ClockIcon className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Hora actual</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatTime(date)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 