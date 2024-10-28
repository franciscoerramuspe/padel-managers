import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function ProfileSettings() {
  const [userEmail, setUserEmail] = useState<string>('');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        // Aquí obtendrías los datos adicionales del usuario desde tu base de datos
      }
    }
    getUserData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Perfil</h2>
      <p className="text-gray-600">Actualiza tus datos personales y configuraciones de cuenta</p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="firstName"
              value={userData.firstName}
              onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              id="lastName"
              value={userData.lastName}
              onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            value={userEmail}
            disabled
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed"
          />
          <p className="mt-1 text-sm text-gray-500">El correo electrónico no se puede modificar ya que está vinculado a tu cuenta de Google.</p>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
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
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              placeholder="99 123 456"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Foto de perfil</label>
          <div className="mt-1 flex items-center space-x-4">
            <Image src="/assets/user.png" alt="Profile" width={64} height={64} className="rounded-full" />
            <button className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Editar
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
