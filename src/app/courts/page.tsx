'use client';

import { useState } from 'react';
import Link from 'next/link';
import AddCourtModal from '@/components/AddCourtModal';

interface Court {
  id: number;
  name: string;
  availability: boolean;
  isCovered: boolean;
  availableTimeSlots: string[];
}

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([
    { id: 1, name: 'Court 1', availability: true, isCovered: false, availableTimeSlots: [] },
    { id: 2, name: 'Court 2', availability: false, isCovered: true, availableTimeSlots: [] },
    { id: 3, name: 'Court 3', availability: true, isCovered: false, availableTimeSlots: [] },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    setCourts(courts.filter(court => court.id !== id));
  };

  const handleAddCourt = (newCourt: Omit<Court, 'id' | 'availability'>) => {
    const id = courts.length > 0 ? Math.max(...courts.map(c => c.id)) + 1 : 1;
    setCourts([...courts, { ...newCourt, id, availability: true }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 animate-fade-in-down">Courts Availability</h1>
        
        <div className="mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add New Court
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <div key={court.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">{court.name}</h2>
                <p className={`text-lg mb-2 ${court.availability ? 'text-green-600' : 'text-red-600'}`}>
                  {court.availability ? 'Available' : 'Not Available'}
                </p>
                <p className="text-sm mb-2">{court.isCovered ? 'Covered' : 'Open'}</p>
                <p className="text-sm mb-4">Time Slots: {court.availableTimeSlots.join(', ')}</p>
                <div className="flex justify-between">
                  <Link href={`/edit-court/${court.id}`} passHref>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(court.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddCourtModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCourt={handleAddCourt}
      />
    </div>
  );
}
