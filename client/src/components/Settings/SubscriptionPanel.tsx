import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { CreditCardIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const subscriptionData = {
  status: 'active',
  plan: 'Premium',
  amount: 99.99,
  nextBilling: '2024-05-15',
  paymentMethod: '**** **** **** 4242',
  features: [
    'Gestión ilimitada de torneos',
    'Soporte prioritario 24/7',
    'Análisis avanzado de estadísticas',
    'Personalización completa',
    'Backup automático',
  ],
  usageStats: {
    tournamentsCreated: 12,
    activeUsers: 150,
    storageUsed: '75%',
  }
};

export default function SubscriptionPanel() {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Plan Premium</h2>
            <p className="text-gray-600">Estado de tu suscripción</p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <span className="text-green-700 font-medium">Activa</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
            <CreditCardIcon className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Próximo pago</p>
              <p className="font-semibold text-gray-800">${subscriptionData.amount}/mes</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Fecha de renovación</p>
              <p className="font-semibold text-gray-800">15 de Mayo, 2024</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
            <ChartBarIcon className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Uso del plan</p>
              <p className="font-semibold text-gray-800">{subscriptionData.usageStats.storageUsed}</p>
            </div>
          </div>
        </div>

        {/* Features and Usage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Features List */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Características incluidas</h3>
            <ul className="space-y-3">
              {subscriptionData.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Usage Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Uso actual</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Torneos creados</span>
                  <span className="text-sm font-medium text-gray-800">12/15</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Usuarios activos</span>
                  <span className="text-sm font-medium text-gray-800">150/200</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Método de pago</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <CreditCardIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Visa terminada en 4242</p>
                <p className="text-sm text-gray-600">Expira 12/2025</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}