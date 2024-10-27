import React from 'react';

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = ['General', 'Payment', 'Subscription'];

export default function SettingsTabs({ activeTab, setActiveTab }: SettingsTabsProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === 'Account' && (
              <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                12
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
