import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface ScheduleFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleFilter: React.FC<ScheduleFilterProps> = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedCourt, setSelectedCourt] = useState<string>('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleCourtChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourt(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Schedule View</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Court</label>
            <select
              value={selectedCourt}
              onChange={handleCourtChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Courts</option>
              <option value="court1">Court 1</option>
              <option value="court2">Court 2</option>
              <option value="court3">Court 3</option>
            </select>
          </div>
        </div>

        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Available Time Slots</h3>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>09:00 - 10:00</span>
              <button className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition duration-300">
                Book
              </button>
            </li>
            <li className="flex justify-between items-center">
              <span>10:00 - 11:00</span>
              <button className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition duration-300">
                Book
              </button>
            </li>
            {/* Add more time slots as needed */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScheduleFilter;

