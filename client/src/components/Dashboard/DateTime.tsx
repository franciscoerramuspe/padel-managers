import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';

export const DateTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = format(time, 'HH');
  const minutes = format(time, 'mm');
  const dayName = format(time, 'EEEE', { locale: es });
  const day = format(time, 'dd');
  const month = format(time, 'MMM', { locale: es });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Digital Clock Display */}
        <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="bg-gray-900 text-white px-6 py-4 rounded-xl">
                <span className="text-4xl font-mono font-bold">{hours}</span>
              </div>
              <span className="text-4xl font-bold text-gray-400 animate-pulse">:</span>
              <div className="bg-gray-900 text-white px-6 py-4 rounded-xl">
                <span className="text-4xl font-mono font-bold">{minutes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Display */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
              {dayName}
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold text-gray-900">{day}</span>
              <span className="text-xl font-medium text-gray-500 uppercase mt-1">
                {month}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 