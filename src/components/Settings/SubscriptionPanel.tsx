import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { CreditCardIcon, CalendarIcon, ChartBarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

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
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Suscripción
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Estado de tu membresía</p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/50 px-4 py-2 rounded-full">
            <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium">Activa</span>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/50 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <div className="flex gap-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Contrato Anual</h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Tu suscripción tiene un compromiso mínimo de 12 meses. Este período garantiza la continuidad 
                del servicio y el acceso a todas las funcionalidades de la plataforma.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CreditCardIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">Plan Premium</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">$99.99</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">por mes</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">Próximo cobro</h3>
            </div>
            <p className="text-gray-900 dark:text-white">15 de Mayo, 2024</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Visa terminada en 4242</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <ChartBarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">Uso actual</h3>
            </div>
            <p className="text-gray-900 dark:text-white">12 torneos activos</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">150 usuarios registrados</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Características incluidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subscriptionData.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}