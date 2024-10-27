import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa';

interface UserFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterValues) => void;
}

interface FilterValues {
  role: string;
  status: string;
  dateRange: { start: string; end: string };
  verificationStatus: string;
  loginStatus: string;
  sortBy: string;
}

const UserFilterSidebar: React.FC<UserFilterSidebarProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    role: 'all',
    status: 'all',
    dateRange: { start: '', end: '' },
    verificationStatus: 'all',
    loginStatus: 'all',
    sortBy: 'name'
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    setFilters({
      role: 'all',
      status: 'all',
      dateRange: { start: '', end: '' },
      verificationStatus: 'all',
      loginStatus: 'all',
      sortBy: 'name'
    });
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-y-0 right-0 ${isCollapsed ? 'w-16' : 'w-80'} bg-white shadow-lg transform transition-all duration-300 ease-in-out`}>
      <div className="h-full flex flex-col">
        <div className="p-6">
          <div className={`flex justify-between items-center mb-6 ${isCollapsed ? 'flex-col' : ''}`}>
            <div className="flex items-center">
              <FaFilter className="text-blue-500 mr-2" />
              <h2 className={`text-xl font-bold text-gray-900 ${isCollapsed ? 'hidden' : ''}`}>
                Filtros
              </h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <div className={`space-y-6 ${isCollapsed ? 'hidden' : ''}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full border border-gray-300 text-sm text-gray-600 rounded-md px-3 py-2 text-sm"
              >
                <option value="name">Nombre</option>
                <option value="lastLogin">Último acceso</option>
                <option value="role">Rol</option>
                <option value="status">Estado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol de usuario</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="w-full border border-gray-300 text-sm text-gray-600 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Todos los roles</option>
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
                <option value="manager">Encargado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full border text-sm text-gray-600 border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado de verificación</label>
              <select
                value={filters.verificationStatus}
                onChange={(e) => setFilters({ ...filters, verificationStatus: e.target.value })}
                className="w-full border text-sm text-gray-600 border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Todos</option>
                <option value="verified">Verificado</option>
                <option value="unverified">No verificado</option>
                <option value="pending">Pendiente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado de conexión</label>
              <select
                value={filters.loginStatus}
                onChange={(e) => setFilters({ ...filters, loginStatus: e.target.value })}
                className="w-full border text-sm text-gray-600 border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Todos</option>
                <option value="online">En línea</option>
                <option value="offline">Desconectado</option>
                <option value="away">Ausente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rango de fechas</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  dateRange: { ...filters.dateRange, start: e.target.value } 
                })}
                className="w-full border text-sm text-gray-600 border-gray-300 rounded-md px-3 py-2 text-sm mb-2"
              />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  dateRange: { ...filters.dateRange, end: e.target.value } 
                })}
                className="w-full border text-sm text-gray-600 border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className={`mt-auto p-6 border-t ${isCollapsed ? 'hidden' : ''}`}>
          <button
            onClick={handleApplyFilters}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mb-2"
          >
            Aplicar filtros
          </button>
          <button
            onClick={handleResetFilters}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            Resetear filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFilterSidebar;
