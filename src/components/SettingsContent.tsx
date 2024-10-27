"use client";

import React, { useState } from 'react';
import SettingsTabs from '@/components/SettingsTabs';
import GeneralSettings from '@/components/GeneralSettings';
import PaymentSettings from '@/components/PaymentsSettings/PaymentSettings';
import SubscriptionSettings from '@/components/SubscriptionSettings';

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState('General');

  const renderContent = () => {
    switch (activeTab) {
      case 'General':
        return <GeneralSettings />;
      case 'Payment':
        return <PaymentSettings />;
      case 'Subscription':
        return <SubscriptionSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search settings..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
      <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
}
