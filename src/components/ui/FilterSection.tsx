'use client';

import { Search } from 'lucide-react';

interface FilterSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (status: string) => void;
  categories: Array<{ id: string; name: string }>;
  searchPlaceholder?: string;
}

export function FilterSection({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  filterStatus,
  onStatusChange,
  categories,
  searchPlaceholder = "Buscar por nombre o club..."
}: FilterSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6 overflow-hidden">
      <div className="p-4 md:p-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-6">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                       rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                       focus:border-blue-500 dark:focus:border-blue-400 transition-colors
                       text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="min-w-[200px]">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-700 
                       border border-gray-200 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                       focus:border-blue-500 dark:focus:border-blue-400 transition-colors
                       text-gray-900 dark:text-gray-100"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 bg-gray-50 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => onStatusChange('all')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              filterStatus === 'all' 
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => onStatusChange('upcoming')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              filterStatus === 'upcoming' 
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            Próximos
          </button>
          <button
            onClick={() => onStatusChange('in_progress')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              filterStatus === 'in_progress' 
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            En Curso
          </button>
        </div>
      </div>
    </div>
  );
} 