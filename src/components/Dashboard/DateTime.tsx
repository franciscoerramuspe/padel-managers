import { useEffect, useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Fecha actual
        </h2>
      </div>
      <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
        {format(date, "EEEE, d 'De' MMMM 'De' yyyy", { locale: es })}
      </p>
    </div>
  );
} 