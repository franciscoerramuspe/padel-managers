import React from 'react';
import Sidebar from '@/components/Sidebar';
import SettingsContent from '@/components/SettingsContent';

export default function SettingsPage() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <SettingsContent />
      </div>
    </div>
  );
}

