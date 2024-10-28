'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AddCourtModal from '@/components/AddCourtModal';
import EditCourtModal from '@/components/EditCourtModal';
import Image from 'next/image';
import CourtModal from '@/components/CourtModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
  
interface Court {
  id: string;
  name: string;
  type: string;
  availability: string | string[];
  image: string;
  court_size: string;
  hourly_rate: number;
}

const DEFAULT_COURT_IMAGE = '/assets/default-court.jpg';

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add' as 'add' | 'edit',
    selectedCourt: null as Court | null
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    court: null as Court | null
  });

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await fetch('/api/courts');
      const data = await response.json();
      setCourts(data);
    } catch (error) {
      console.error('Error fetching courts:', error);
    }
  };

  const openEditModal = (court: Court) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      selectedCourt: court
    });
  };

  const handleSubmit = async (courtData: Partial<Court>) => {
    try {
      if (modalState.mode === 'add') {
        const response = await fetch('/api/courts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courtData),
        });

        if (!response.ok) throw new Error('Failed to create court');
        
        const newCourt = await response.json();
        setCourts([...courts, newCourt]);
      } else {
        const response = await fetch(`/api/courts/${modalState.selectedCourt?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courtData),
        });

        if (!response.ok) throw new Error('Failed to update court');

        const updatedCourt = await response.json();
        setCourts(courts.map(c => 
          c.id === modalState.selectedCourt?.id 
            ? updatedCourt
            : c
        ));
      }
      setModalState({ isOpen: false, mode: 'add', selectedCourt: null });
    } catch (error) {
      console.error('Error submitting court:', error);
    }
  };

  const handleDelete = async () => {
    if (deleteModal.court) {
      try {
        const response = await fetch(`/api/courts/${deleteModal.court.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete court');

        setCourts(courts.filter(c => c.id !== deleteModal.court?.id));
        setDeleteModal({ isOpen: false, court: null });
      } catch (error) {
        console.error('Error deleting court:', error);
      }
    }
  };

  // Add this new function to open the delete modal
  const openDeleteModal = (court: Court) => {
    setDeleteModal({
      isOpen: true,
      court: court
    });
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
                  src={court.image || DEFAULT_COURT_IMAGE}
                  alt={court.name || 'Court image'}
                  fill
                  className="w-full h-full object-cover"
                  priority={true}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl text-black font-semibold mb-2">{court.name}</h3>
                <p className={`text-sm font-medium ${court.availability?.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {court.availability?.length > 0 ? 'Disponible' : 'No disponible'}
                </p>
                <p className="text-sm text-gray-600">Tipo: {court.type}</p>
                <p className="text-sm text-gray-600 mb-2">Horarios disponibles:</p>
                <div className="grid grid-cols-2 gap-1">
                  {(() => {
                    try {
                      const slots = Array.isArray(court.availability) 
                        ? court.availability 
                        : JSON.parse(court.availability || '[]');
                      return slots.map((slot: string) => (
                        <span key={slot} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {slot}
                        </span>
                      ));
                    } catch (error) {
                      console.error('Error parsing availability:', error);
                      return null;
                    }
                  })()}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => openEditModal(court)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm flex items-center"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-1" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={() => openDeleteModal(court)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm flex items-center"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-1" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <CourtModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ isOpen: false, mode: 'add', selectedCourt: null })}
          onSubmit={handleSubmit}
          court={modalState.selectedCourt}
          mode={modalState.mode}
        />
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, court: null })}
          onConfirm={handleDelete}
          courtName={deleteModal.court?.name ?? ''}
        />
        {modalState.mode === 'edit' && modalState.selectedCourt && (
          <EditCourtModal
            isOpen={modalState.isOpen}
            onClose={() => setModalState({ isOpen: false, mode: 'add', selectedCourt: null })}
            onEditCourt={handleSubmit}
            court={modalState.selectedCourt}
          />
        )}
      </div>
    </div>
  );
}
