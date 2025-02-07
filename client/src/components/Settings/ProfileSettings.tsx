import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';

export default function ProfileSettings() {
  const [userEmail, setUserEmail] = useState<string>('');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    }
    getUserData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      // Aquí iría la lógica para guardar en la base de datos
      console.log('Guardando cambios:', userData);
      setHasChanges(false);
      
      // Mostrar notificación de éxito (puedes usar una librería de notificaciones)
      alert('Cambios guardados correctamente');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Error al guardar los cambios');
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Perfil</h2>
        <p className="text-gray-600">Actualiza tus datos personales y configuraciones de cuenta</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="firstName"
                value={userData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa tu nombre"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                id="lastName"
                value={userData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa tu apellido"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={userEmail}
              disabled
              className="w-full px-3 py-2 text-base rounded-md border border-gray-300 bg-gray-50 text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              El correo electrónico no se puede modificar ya que está vinculado a tu cuenta de Google.
            </p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                <Image 
                  src="/assets/uruguay-flag.png" 
                  alt="Uruguay" 
                  width={20} 
                  height={15} 
                  className="mr-2" 
                />
                +598
              </span>
              <input
                type="tel"
                id="phone"
                value={userData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 text-base rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="99 123 456"
              />
            </div>
          </div>
        </div>
        
        {hasChanges && (
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
              Confirmar cambios
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
