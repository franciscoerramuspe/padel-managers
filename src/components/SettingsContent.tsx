"use client";

import React, { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import { FaUser, FaPlug,  FaShieldAlt, } from 'react-icons/fa';
import IntegrationsPanel from './IntegrationsPanel';
import SecuritySettings from './SecuritySettings';

const tabs = [
  { id: 'profile', label: 'Perfil', icon: FaUser },
  { id: 'integrations', label: 'Integraciones', icon: FaPlug },
  { id: 'security', label: 'Seguridad', icon: FaShieldAlt },
];

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Tabs Container */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuraciones</h1>
          <div className="flex space-x-1 bg-white rounded-lg shadow-sm p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'integrations' && <IntegrationsPanel />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}
