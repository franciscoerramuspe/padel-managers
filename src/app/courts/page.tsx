'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AddCourtModal from '@/components/AddCourtModal';
import EditCourtModal from '@/components/EditCourtModal';
import Image from 'next/image';
  
interface Court {
  id: number;
  name: string;
  availability: boolean;
  isCovered: boolean;
  availableTimeSlots: string[];
  type: string;
  image: string;
}

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([
    { id: 1, name: 'Cancha 1', availability: true, isCovered: false, availableTimeSlots: [], type: 'padel', image: '/assets/images.jpg' },
    { id: 2, name: 'Cancha 2', availability: false, isCovered: true, availableTimeSlots: [], type: 'padel', image: '/assets/images.jpg' },
    { id: 3, name: 'Cancha 3', availability: true, isCovered: false, availableTimeSlots: [], type: 'football', image: '/assets/images.jpg' },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  const handleDelete = (id: number) => {
    setCourts(courts.filter(court => court.id !== id));
  };

  const handleAddCourt = (newCourt: Omit<Court, 'id' | 'availability'>) => {
    const id = courts.length > 0 ? Math.max(...courts.map(c => c.id)) + 1 : 1;
    setCourts([...courts, { ...newCourt, id, availability: true }]);
  };

  const openEditModal = (court: Court) => {
    setEditingCourt(court);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Link 
              href="/dashboard" 
              className="text-blue-600 hover:text-blue-800 transition-colors mb-2 inline-block text-sm sm:text-base"
            >
              ← Volver al inicio
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-black">Gestión de canchas</h1>
          </div>
          
          <Link href="/add-court" passHref>
            <button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full transition duration-300 ease-in-out flex items-center justify-center sm:justify-start">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="whitespace-nowrap">Añadir nueva cancha</span>
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courts.map((court) => (
            <div key={court.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 sm:h-56">
                <Image
                  src={court.image}
                  alt={court.name}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl text-black font-semibold mb-2">{court.name}</h3>
                <p className={`text-sm font-medium ${court.availability ? 'text-green-600' : 'text-red-600'}`}>
                  {court.availability ? 'Disponible' : 'No disponible'}
                </p>
                <p className="text-sm text-gray-600">{court.isCovered ? 'Techada' : 'Abierta'}</p>
                <p className="text-sm text-gray-600">Tipo: {court.type}</p>
                <p className="text-sm text-gray-600 mb-4">Horarios disponibles:</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <button
                    onClick={() => openEditModal(court)}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(court.id)}
                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <AddCourtModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddCourt={handleAddCourt}
        />
        {editingCourt && (
          <EditCourtModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEditCourt={null}
            court={editingCourt}
          />
        )}
      </div>
    </div>
  );
}
