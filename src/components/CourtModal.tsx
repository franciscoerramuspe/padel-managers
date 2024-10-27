import React, { useState, useEffect } from 'react';

interface Court {
  id: string;
  name: string;
  type: 'Padel' | 'Football';
  availability: boolean;
  iscovered: boolean;
  availableTimeSlots: string[];
}

interface CourtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (court: Omit<Court, 'id'> | Court) => void;
  court?: Court;
}

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour < 24; hour += 1.5) {
    const startHour = Math.floor(hour);
    const startMinute = hour % 1 === 0 ? '00' : '30';
    const endHour = Math.floor((hour + 1.5) % 24);
    const endMinute = (hour + 1.5) % 1 === 0 ? '00' : '30';
    
    const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute}`;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute}`;
    
    slots.push(`${startTime} - ${endTime}`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const CourtModal: React.FC<CourtModalProps> = ({ isOpen, onClose, onSubmit, court }) => {
  const [courtName, setCourtName] = useState('');
  const [courtType, setCourtType] = useState<'Padel' | 'Football'>('Padel');
  const [isCovered, setIsCovered] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [courtNameError, setCourtNameError] = useState('');
  const [timeSlotsError, setTimeSlotsError] = useState('');

  useEffect(() => {
    if (court) {
      setCourtName(court.name);
      setCourtType(court.type);
      setIsCovered(court.iscovered);
      setSelectedTimeSlots(court.availableTimeSlots || []);
    } else {
      setCourtName('');
      setCourtType('Padel');
      setIsCovered(false);
      setSelectedTimeSlots([]);
    }
  }, [court, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCourtNameError('');
    setTimeSlotsError('');

    if (!courtName.trim()) {
      setCourtNameError('Court name is required');
      return;
    }

    if (selectedTimeSlots.length === 0) {
      setTimeSlotsError('Please select at least one time slot');
      return;
    }

    const courtData = {
      name: courtName,
      type: courtType,
      availability: true,
      iscovered: isCovered,
      availableTimeSlots: selectedTimeSlots,
    };

    if (court) {
      onSubmit({ ...courtData, id: court.id });
    } else {
      onSubmit(courtData);
    }

    onClose();
  };

  const handleTimeSlotToggle = (slot: string) => {
    setSelectedTimeSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl border-4 border-gradient-to-r from-blue-500 to-purple-600">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {court ? 'Edit Court' : 'Add New Court'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Court Name Input */}
          <div className="border-2 border-blue-300 rounded-lg p-4">
            <label htmlFor="courtName" className="block text-sm font-semibold text-gray-700 mb-1">Court Name</label>
            <input
              type="text"
              id="courtName"
              value={courtName}
              onChange={(e) => setCourtName(e.target.value)}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {courtNameError && <p className="text-red-500 text-sm font-semibold mt-1">{courtNameError}</p>}
          </div>

          {/* Court Type Selection */}
          <div className="border-2 border-purple-300 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Court Type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Padel"
                  checked={courtType === 'Padel'}
                  onChange={() => setCourtType('Padel')}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-gray-700">🎾 Padel</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Football"
                  checked={courtType === 'Football'}
                  onChange={() => setCourtType('Football')}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-gray-700">⚽ Football</span>
              </label>
            </div>
          </div>

          {/* Covered Court Checkbox */}
          <div className="border-2 border-green-300 rounded-lg p-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isCovered}
                onChange={(e) => setIsCovered(e.target.checked)}
                className="form-checkbox text-blue-600"
              />
              <span className="ml-2 text-gray-700">Covered Court</span>
            </label>
          </div>

          {/* Time Slots Selection */}
          <div className="border-2 border-yellow-300 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Available Time Slots</label>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {timeSlots.map(slot => (
                <label key={slot} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTimeSlots.includes(slot)}
                    onChange={() => handleTimeSlotToggle(slot)}
                    className="form-checkbox text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 text-sm">{slot}</span>
                </label>
              ))}
            </div>
            {timeSlotsError && <p className="text-red-500 text-sm font-semibold mt-1">{timeSlotsError}</p>}
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {court ? 'Update Court' : 'Add Court'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourtModal;
