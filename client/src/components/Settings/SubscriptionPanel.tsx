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
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Suscripción</h2>
            <p className="text-gray-600">Estado de tu membresía</p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <span className="text-green-700 font-medium">Activa</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex gap-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Contrato Anual</h3>
              <p className="text-sm text-blue-600">
                Tu suscripción tiene un compromiso mínimo de 12 meses. Este período garantiza la continuidad 
                del servicio y el acceso a todas las funcionalidades de la plataforma.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Próximo pago</p>
                <p className="font-semibold text-gray-800">$99.99</p>
                <p className="text-sm text-gray-500">15 de Abril, 2024</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Vencimiento</p>
                <p className="font-semibold text-gray-800">15 de Mayo, 2024</p>
                <p className="text-sm text-gray-500">Renovación automática</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}