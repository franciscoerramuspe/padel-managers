import Image from 'next/image';
import { FaPlus } from 'react-icons/fa';

const integrations = [
  {
    id: 'google',
    name: 'Google',
    description: 'Conecta con tu cuenta de Google',
    icon: '/assets/google.png',
    connected: true
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Connecta con tu cuenta de WhatsApp Business',
    icon: '/assets/whatsapp_logo.png',
    connected: true
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    description: 'Procesa pagos con Mercado Pago',
    icon: '/assets/mercado-pago.png',
    connected: false
  },
];

export default function IntegrationsPanel() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Integraciones</h2>
          <p className="text-gray-600">Conecta tus aplicaciones y servicios favoritos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FaPlus className="w-4 h-4" />
          Añadir nueva
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 relative">
                  <Image
                    src={integration.icon}
                    alt={integration.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{integration.name}</h3>
                  <p className="text-sm text-gray-500">{integration.description}</p>
                </div>
              </div>
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  integration.connected
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {integration.connected ? 'Conectado' : 'Conectar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}