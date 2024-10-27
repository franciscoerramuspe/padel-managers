import React from 'react';

const SubscriptionSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Subscription Settings</h2>
      <div>
        <p className="text-lg font-medium">Current Plan: <span className="text-blue-600">Pro</span></p>
        <p className="text-sm text-gray-600">Your plan renews on July 1, 2024</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Available Plans:</h3>
        <div className="flex space-x-4">
          <button className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition-colors">
            Basic
          </button>
          <button className="border border-blue-500 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-colors">
            Pro (Current)
          </button>
          <button className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition-colors">
            Enterprise
          </button>
        </div>
      </div>
      <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
        Cancel Subscription
      </button>
    </div>
  );
};

export default SubscriptionSettings;

