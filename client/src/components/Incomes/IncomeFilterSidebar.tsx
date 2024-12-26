import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa';

interface IncomeFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: IncomeFilters) => void;
}

interface IncomeFilters {
  dateRange: { start: string; end: string };
  courtType: string;
  minAmount: string;
  maxAmount: string;
  sortBy: string;
  paymentMethod: string;
}

export default function IncomeFilterSidebar({ isOpen, onClose, onApplyFilters }: IncomeFilterSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filters, setFilters] = useState<IncomeFilters>({
    dateRange: { start: '', end: '' },
    courtType: 'all',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date',
    paymentMethod: 'all'
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: { start: '', end: '' },
      courtType: 'all',
      minAmount: '',
      maxAmount: '',
      sortBy: 'date',
      paymentMethod: 'all'
    });
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-y-0 right-0 ${isCollapsed ? 'w-16' : 'w-80'} bg-white shadow-lg transform transition-all duration-300 ease-in-out z-50`}>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Rango de fechas</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 text-sm"
              />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de cancha</label>
              <select
                value={filters.courtType}
                onChange={(e) => setFilters({ ...filters, courtType: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Todas las canchas</option>
                <option value="padel">Padel</option>
                <option value="futbol">Fútbol</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rango de montos</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                  className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                  className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="date">Fecha</option>
                <option value="amount">Monto</option>
                <option value="court">Cancha</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Método de pago</label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Todos</option>
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="transfer">Transferencia</option>
              </select>
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

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-1/2 -left-3 bg-blue-500 text-white p-1 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
        >
          {isCollapsed ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>
    </div>
  );
}