import React from 'react';

interface HeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  button?: React.ReactNode;
}

export default function Header({ title, description, icon, button }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      {button && (
        <div className="flex-shrink-0">
          {button}
        </div>
      )}
    </div>
  );
} 