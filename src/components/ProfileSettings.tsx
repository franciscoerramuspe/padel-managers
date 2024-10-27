import React from 'react';
import Image from 'next/image';

export default function ProfileSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Your Profile</h2>
      <p className="text-gray-600">Please update your profile settings here</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              slothui.com/
            </span>
            <input
              type="text"
              id="username"
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              placeholder="X-AE-A-19"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              <Image src="/path-to-uk-flag.png" alt="UK" width={20} height={15} className="mr-2" />
              +44
            </span>
            <input
              type="tel"
              id="phone"
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              placeholder="(158) 008-9987"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <div className="mt-1 flex items-center space-x-4">
            <Image src="/path-to-profile-picture.jpg" alt="Profile" width={64} height={64} className="rounded-full" />
            <button className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Edit
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Delete
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Biography
          </label>
          <div className="mt-1">
            <textarea
              id="bio"
              rows={4}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Hi there! 👋 I'm X-AE-A-19, an AI enthusiast and fitness aficionado. When I'm not crunching numbers or optimizing algorithms, you can find me hitting the gym."
            ></textarea>
          </div>
          <p className="mt-2 text-sm text-gray-500">325 characters remaining</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notifications</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                id="email-notification"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="email-notification" className="ml-2 block text-sm text-gray-700">
                Email Notification
              </label>
            </div>
            <p className="text-xs text-gray-500 ml-6">You will be notified when a new email arrives.</p>
            <div className="flex items-center">
              <input
                id="sound-notification"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked
              />
              <label htmlFor="sound-notification" className="ml-2 block text-sm text-gray-700">
                Sound Notification
              </label>
            </div>
            <p className="text-xs text-gray-500 ml-6">You will be notified with sound when someone messages you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
