import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface SidebarFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({ isOpen, onClose }) => {
  const [courtType, setCourtType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleApplyFilter = () => {
    // Implement filter logic here
    console.log('Applying filter:', { courtType, dateRange });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-y-0 right-0 ${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg p-6 transform transition-all duration-300 ease-in-out`}>
      <div className={`flex justify-between items-center mb-6 ${isCollapsed ? 'flex-col' : ''}`}>
        <h2 className={`text-2xl font-bold ${isCollapsed ? 'hidden' : ''}`}>Filters</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>

      <div className={`space-y-4 ${isCollapsed ? 'hidden' : ''}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Court Type</label>
          <select
            value={courtType}
            onChange={(e) => setCourtType(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">All Courts</option>
            <option value="padel">Padel</option>
            <option value="tennis">Futbol</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      <button
        onClick={handleApplyFilter}
        className={`mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ${isCollapsed ? 'hidden' : ''}`}
      >
        Apply Filters
      </button>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-1/2 -left-3 bg-blue-500 text-white p-1 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
      >
        {isCollapsed ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
    </div>
  );
};

export default SidebarFilter;
