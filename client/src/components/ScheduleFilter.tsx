import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface ScheduleFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterData) => void;
}

interface FilterData {
  date: string;
  court: string;
  timeRange: string;
}

const ScheduleFilter: React.FC<ScheduleFilterProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedCourt, setSelectedCourt] = useState<string>('');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleCourtChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourt(e.target.value);
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimeRange(e.target.value);
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      date: selectedDate,
      court: selectedCourt,
      timeRange: selectedTimeRange,
    });
    onClose();
  };

  const timeSlots = [
    '08:00 - 09:30', '09:30 - 11:00', '11:00 - 12:30', '12:30 - 14:00',
    '14:00 - 15:30', '15:30 - 17:00', '17:00 - 18:30', '18:30 - 20:00',
    '20:00 - 21:30', '21:30 - 23:00'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-black font-bold">Calendario</h2>
          <button onClick={onClose} className="text-black hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar fecha</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full border border-gray-300 text-sm text-black rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar rango horario</label>
            <select
              value={selectedTimeRange}
              onChange={handleTimeRangeChange}
              className="w-full border border-gray-300 text-sm text-black rounded-md px-3 py-2"
            >
              <option value="">Todos los horarios</option>
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar cancha</label>
            <select
              value={selectedCourt}
              onChange={handleCourtChange}
              className="w-full border border-gray-300 text-sm text-black rounded-md px-3 py-2"
            >
              <option value="">Todas las canchas</option>
              <option value="court1">Cancha 1</option>
              <option value="court2">Cancha 2</option>
              <option value="court3">Cancha 3</option>
            </select>
          </div>

          <button
            onClick={handleApplyFilters}
            className="w-full bg-green-600 font-semibold text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleFilter;
