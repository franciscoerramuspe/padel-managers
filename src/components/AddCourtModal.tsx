import React, { useState } from 'react';

interface AddCourtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourt: (court: { name: string; isCovered: boolean; availableTimeSlots: string[]; type: string }) => void;
}

const AddCourtModal: React.FC<AddCourtModalProps> = ({ isOpen, onClose, onAddCourt }) => {
  const [courtName, setCourtName] = useState('');
  const [isCovered, setIsCovered] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [courtType, setCourtType] = useState('padel');

  const timeSlots = [
    '08:00 - 09:30', '09:30 - 11:00', '11:00 - 12:30', '12:30 - 14:00',
    '14:00 - 15:30', '15:30 - 17:00', '17:00 - 18:30', '18:30 - 20:00',
    '20:00 - 21:30', '21:30 - 23:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourt = {
      name: courtName,
      isCovered,
      availableTimeSlots: selectedTimeSlots,
      type: courtType,
    };
    onAddCourt(newCourt);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-black">Add New Court</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="courtName" className="block text-sm font-medium text-gray-700">Court Name</label>
            <input
              type="text"
              id="courtName"
              value={courtName}
              onChange={(e) => setCourtName(e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Court Type</label>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="padel"
                  checked={courtType === 'padel'}
                  onChange={() => setCourtType('padel')}
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-black">Padel</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="football"
                  checked={courtType === 'football'}
                  onChange={() => setCourtType('football')}
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-black">Football</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isCovered}
                onChange={(e) => setIsCovered(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-black">Covered Court</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Available Time Slots</label>
            <div className="mt-2 space-y-2">
              {timeSlots.map((slot) => (
                <label key={slot} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    value={slot}
                    checked={selectedTimeSlots.includes(slot)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTimeSlots([...selectedTimeSlots, slot]);
                      } else {
                        setSelectedTimeSlots(selectedTimeSlots.filter(s => s !== slot));
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-black">{slot}</span>
                </label>
              ))}
            </div>
          </div>
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add Court
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourtModal;
