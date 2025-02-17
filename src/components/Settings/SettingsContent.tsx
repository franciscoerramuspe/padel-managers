"use client";

import React, { useState } from 'react';
import ProfileSettings from '@/components/Settings/ProfileSettings';
import IntegrationsPanel from '@/components/Settings/IntegrationsPanel';
import SubscriptionPanel from '@/components/Settings/SubscriptionPanel';
import { 
  UserIcon, 
  Square3Stack3DIcon, 
  CreditCardIcon 
} from '@heroicons/react/24/outline';

const tabs = [
  { id: 'profile', label: 'Perfil', icon: UserIcon },
  { id: 'integrations', label: 'Integraciones', icon: Square3Stack3DIcon },
  { id: 'subscription', label: 'Suscripción', icon: CreditCardIcon },
];

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div className="flex overflow-x-auto md:overflow-visible bg-white rounded-lg shadow-sm p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-gray-50">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'integrations' && <IntegrationsPanel />}
          {activeTab === 'subscription' && <SubscriptionPanel />}
        </div>
      </div>
    </div>
  );
}
