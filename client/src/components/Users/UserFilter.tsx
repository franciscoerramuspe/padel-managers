import React from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  onOpenFilter: () => void;
}

export default function UserFilters({
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  selectedStatus,
  setSelectedStatus,
  onOpenFilter
}: UserFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-2 border border-gray-300 text-sm text-black rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-700 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={onOpenFilter}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaFilter />
            Filtros avanzados
          </button>
        </div>
      </div>
    </div>
  );
}
