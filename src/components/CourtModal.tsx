import React from 'react';

interface CourtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { startTime: Date; endTime: Date; courtId: number }) => void;
}

export default function CourtModal({ isOpen, onClose, onSubmit }: CourtModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Nueva Reserva</h2>
        {/* Add form content here */}
        <div className="flex justify-end gap-2 mt-4">
          <button 
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={() => onSubmit({ startTime: new Date(), endTime: new Date(), courtId: 1 })}
          >
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
}
