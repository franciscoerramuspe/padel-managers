import React from 'react';
import SettingsContent from '../../components/Settings/SettingsContent';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header 
          title="Configuraciones"
          description="Administra las configuraciones de la aplicación."
          icon={<Cog6ToothIcon className="w-6 h-6 text-gray-900 dark:text-gray-100" />}
        />

        <SettingsContent />
      </div>
    </div>
  );
}
