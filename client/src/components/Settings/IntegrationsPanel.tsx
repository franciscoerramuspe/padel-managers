import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaWhatsapp, FaEdit } from 'react-icons/fa';
import WhatsAppConfigModal from '../Modals/WhatsAppConfigModal';
import { toast } from "@/components/ui/use-toast";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  phoneNumber?: string;
}

interface IntegrationPanelState {
  whatsappNumber: string;
  isWhatsAppModalOpen: boolean;
}

const integrations: Integration[] = [
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
    description: 'Conecta con tu cuenta de WhatsApp Business',
    icon: '/assets/whatsapp_logo.png',
    connected: false,
    phoneNumber: ''
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
  const [state, setState] = useState<IntegrationPanelState>({
    whatsappNumber: '',
    isWhatsAppModalOpen: false
  });

  useEffect(() => {
    const fetchWhatsAppNumber = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/whatsapp`);
        const data = await response.json();
        if (data.whatsappNumber) {
          setState(prev => ({ ...prev, whatsappNumber: data.whatsappNumber }));
        }
      } catch (error) {
      }
    };

    fetchWhatsAppNumber();
  }, []);

  const handleOpenWhatsAppModal = () => {
    setState(prev => ({ ...prev, isWhatsAppModalOpen: true }));
  };

  const handleCloseWhatsAppModal = () => {
    setState(prev => ({ ...prev, isWhatsAppModalOpen: false }));
  };

  const handleSaveWhatsApp = async (phoneNumber: string) => {
    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ whatsappNumber: phoneNumber })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Error al guardar el número');
      }

      setState(prev => ({ 
        ...prev, 
        whatsappNumber: phoneNumber,
        isWhatsAppModalOpen: false 
      }));

      toast({
        title: "✅ WhatsApp configurado",
        description: "El número de WhatsApp Business se ha actualizado correctamente.",
        variant: "default",
        className: "border-l-4 border-l-green-500"
      });

    } catch (error) {
      toast({
        title: "❌ Error",
        description: error instanceof Error ? error.message : 'Error al guardar el número de WhatsApp',
        variant: "destructive",
        className: "border-l-4 border-l-red-500"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Integraciones</h2>
            <p className="text-gray-600">Conecta tus aplicaciones y servicios favoritos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {integrations.map((integration) => (
            <div 
              key={integration.id} 
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white w-full"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 relative flex-shrink-0">
                    <Image
                      src={integration.icon}
                      alt={integration.name}
                      fill
                      priority
                      sizes="128px"
                      className="object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{integration.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{integration.description}</p>
                  </div>
                </div>
                <button
                  onClick={integration.id === 'whatsapp' ? handleOpenWhatsAppModal : undefined}
                  className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                    integration.id === 'whatsapp' && state.whatsappNumber
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {integration.id === 'whatsapp' && state.whatsappNumber ? 'Configurado' : 'Conectar'}
                </button>
              </div>
              {integration.id === 'whatsapp' && state.whatsappNumber && (
                <div className="w-full mt-4 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaWhatsapp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Número configurado:
                      </span>
                      <span className="text-sm text-gray-600">
                        +598 {state.whatsappNumber}
                      </span>
                    </div>
                    <button
                      onClick={handleOpenWhatsAppModal}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <FaEdit className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {state.isWhatsAppModalOpen && (
        <WhatsAppConfigModal
          isOpen={state.isWhatsAppModalOpen}
          onClose={handleCloseWhatsAppModal}
          onSave={handleSaveWhatsApp}
          initialPhoneNumber={state.whatsappNumber}
        />
      )}
    </div>
  );
}
