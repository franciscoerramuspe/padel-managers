import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
}

export default function UserFilters({
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm">
      {/* Búsqueda por nombre */}
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Filtro por rol */}
      <div className="w-full md:w-48">
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full text-gray-500 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option  value="all">Todos los roles</option>
          <option value="Jugador">Jugador</option>
          <option  value="admin">Administrador</option>
        </select>
      </div>
    </div>
  );
}
