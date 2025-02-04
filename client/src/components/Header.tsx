import React from 'react';

interface HeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  button?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, description, icon, button }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex items-center justify-between">
      <div className="flex items-center">
        {icon && <div className="mr-4 text-blue-600">{icon}</div>}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>
      {button && <div>{button}</div>}
    </div>
  );
};

export default Header; 