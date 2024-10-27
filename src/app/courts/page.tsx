'use client';

import React, { useState, useEffect } from 'react';
import CourtModal from '@/components/CourtModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Link from 'next/link';

interface Court {
  id: string;
  name: string;
  type: 'padel' | 'football';
  availability: boolean;
  iscovered: boolean;
}

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courtToDelete, setCourtToDelete] = useState<Court | null>(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await fetch('/api/courts');
      if (!response.ok) {
        throw new Error('Failed to fetch courts');
      }
      const data = await response.json();
      setCourts(data);
    } catch (error) {
      console.error('Error fetching courts:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/courts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete court');
      }
      setCourts(courts.filter(court => court.id !== id));
      setIsDeleteModalOpen(false);
      setCourtToDelete(null);
    } catch (error) {
      console.error('Error deleting court:', error);
    }
  };

  const handleAddCourt = async (newCourt: Omit<Court, 'id'>) => {
    try {
      const response = await fetch('/api/courts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourt),
      });

      if (!response.ok) {
        throw new Error('Failed to add court');
      }

      const addedCourt = await response.json();
      setCourts(prevCourts => [...prevCourts, addedCourt]);
      setIsCourtModalOpen(false);
    } catch (error) {
      console.error('Error adding court:', error);
    }
  };

  const handleEditCourt = async (updatedCourt: Court) => {
    try {
      const response = await fetch(`/api/courts/${updatedCourt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCourt),
      });

      if (!response.ok) {
        throw new Error('Failed to update court');
      }

      setCourts(courts.map(court => court.id === updatedCourt.id ? updatedCourt : court));
      setIsCourtModalOpen(false);
      setEditingCourt(null);
    } catch (error) {
      console.error('Error updating court:', error);
    }
  };

  const openEditModal = (court: Court) => {
    setEditingCourt(court);
    setIsCourtModalOpen(true);
  };

  const openDeleteModal = (court: Court) => {
    setCourtToDelete(court);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/dashboard" className="text-white hover:text-purple-200 transition-colors mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-white">Courts Management</h1>
          </div>
          <button
            onClick={() => setIsCourtModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Court
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <div key={court.id} className="bg-white rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 border border-gray-200 shadow-lg hover:shadow-xl">
              <div className="p-6 border-l-4 border-blue-500">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{court.name}</h2>
                <p className={`text-lg mb-2 ${court.availability ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {court.availability ? 'Available' : 'Not Available'}
                </p>
                <p className="text-sm mb-2 text-gray-600">{court.iscovered ? 'Covered' : 'Open'}</p>
                <p className="text-sm mb-2 text-gray-600">Type: {court.type}</p>
                <div className="flex justify-between">
                  <button
                    onClick={() => openEditModal(court)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(court)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CourtModal
        isOpen={isCourtModalOpen}
        onClose={() => {
          setIsCourtModalOpen(false);
          setEditingCourt(null);
        }}
        onSubmit={editingCourt ? handleEditCourt : handleAddCourt}
        court={editingCourt}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => courtToDelete && handleDelete(courtToDelete.id)}
        courtName={courtToDelete?.name || ''}
      />
    </div>
  );
}
