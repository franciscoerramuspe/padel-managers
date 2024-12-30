import React, { useState } from 'react';
import { FaEdit, FaTrash, FaEnvelope } from 'react-icons/fa';

interface UserActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onInvite: () => void;
  isInvited?: boolean;
}

export default function UserActionMenu({ onEdit, onDelete, onInvite, isInvited }: UserActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50" style={{ transform: 'translateX(-50%)' }}>
          <div className="py-1">
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaEdit className="mr-3" />
              Editar
            </button>
            
            <button
              onClick={() => {
                onInvite();
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                isInvited 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              disabled={isInvited}
            >
              <FaEnvelope className="mr-3" />
              {isInvited ? 'Usuario invitado' : 'Invitar usuario'}
            </button>

            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <FaTrash className="mr-3" />
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
