import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Image from 'next/image';

interface WhatsAppConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (phoneNumber: string) => void;
  initialPhoneNumber?: string;
}

export default function WhatsAppConfigModal({ isOpen, onClose, onSave, initialPhoneNumber = '' }: WhatsAppConfigModalProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    
    // Eliminar cualquier caracter que no sea número
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    
    // Validar que el número tenga 8 o 9 dígitos
    if (cleanNumber.length < 8 || cleanNumber.length > 9) {
      alert('El número debe tener 8 o 9 dígitos');
      return;
    }
    
    onSave(cleanNumber);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Image src="/assets/whatsapp_logo.png" alt="WhatsApp" width={24} height={24} className="mr-2" />
            Configurar WhatsApp
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">¿Para qué sirve esto?</h4>
          <p className="text-sm text-gray-600">
            Este número de WhatsApp Business aparecerá en el portal de jugadores, 
            permitiéndoles contactarte directamente para consultas sobre reservas, 
            torneos o cualquier otra información del club.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de WhatsApp Business
          </label>
          <div className="flex rounded-md mb-4">
            <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500 sm:text-sm">
              +598 🇺🇾
            </span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="92033831"
              className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-md border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Ingresa el número sin el código de país
          </p>

          <div className="flex flex-col space-y-3 mt-4">
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300"
            >
              <Image src="/assets/whatsapp_logo.png" alt="WhatsApp" width={20} height={20} className="mr-2" />
              Guardar número
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300"
            >
              Cancelar
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0 h-10 w-10 relative">
              <Image
                src="/assets/whatsapp_logo.png"
                alt="WhatsApp Business"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xs text-gray-500">
              Asegúrate de usar un número de WhatsApp Business verificado para 
              una mejor experiencia de comunicación con tus jugadores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 