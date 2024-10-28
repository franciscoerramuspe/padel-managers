import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaLaptop, FaMobile, FaTablet } from 'react-icons/fa';

interface Device {
  id: string;
  name: string;
  type: 'laptop' | 'mobile' | 'tablet';
  lastActive: string;
}

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const devices: Device[] = [
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'laptop',
      lastActive: 'Activo ahora'
    },
    {
      id: '2',
      name: 'iPhone 13',
      type: 'mobile',
      lastActive: 'Última vez: hace 2 horas'
    },
    {
      id: '3',
      name: 'iPad Pro',
      type: 'tablet',
      lastActive: 'Última vez: hace 5 días'
    }
  ];

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'laptop':
        return <FaLaptop className="w-5 h-5" />;
      case 'mobile':
        return <FaMobile className="w-5 h-5" />;
      case 'tablet':
        return <FaTablet className="w-5 h-5" />;
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de cambio de contraseña
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Seguridad</h2>
        <p className="text-gray-600">Administra tu contraseña y dispositivos conectados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cambio de contraseña */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cambiar Contraseña</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña actual</label>
              <div className="relative mt-1">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
              <div className="relative mt-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Cambiar Contraseña
            </button>
          </form>
        </div>

        {/* Dispositivos conectados */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tus Dispositivos</h3>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-600">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{device.name}</p>
                    <p className="text-sm text-gray-500">{device.lastActive}</p>
                  </div>
                </div>
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Revocar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}