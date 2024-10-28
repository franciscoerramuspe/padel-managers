import React, { useState, useEffect, useRef } from 'react';
import { FaSun, FaCloudSun, FaMoon, FaPhone, FaChevronDown, FaEdit, FaClock } from 'react-icons/fa';

interface PadelBooking {
  courtName: string;
  type: 'padel';
  date: string;
  time: string;
  reserveeName: string;
  contactPhone: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface FootballBooking {
  courtName: string;
  type: 'football';
  date: string;
  time: string;
  reserveeName: string;
  contactPhone: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

type Booking = PadelBooking | FootballBooking;

interface BookingsTableProps {
  bookings: Booking[];
}

const BookingsTable: React.FC<BookingsTableProps> = ({ bookings }) => {
  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return <FaSun className="text-yellow-500 mr-2" />;
    if (hour >= 12 && hour < 18) return <FaCloudSun className="text-orange-500 mr-2" />;
    return <FaMoon className="text-blue-500 mr-2" />;
  };

  const getTimeStyle = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return 'bg-yellow-100 text-yellow-800';
    if (hour >= 12 && hour < 18) return 'bg-orange-100 text-orange-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return '';
    }
  };

  const BookingStatus: React.FC<{ status: string; onStatusChange: (newStatus: string) => void }> = ({ 
    status, 
    onStatusChange 
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const getStatusText = (status: string) => {
      switch (status) {
        case 'confirmed':
          return 'Confirmada';
        case 'cancelled':
          return 'Cancelada';
        default:
          return 'Pendiente';
      }
    };

    return (
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(status)}`}>
            {getStatusText(status)}
          </span>
          <FaChevronDown className="ml-2 h-4 w-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1" role="menu">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  onStatusChange('confirmed');
                  setIsOpen(false);
                }}
                role="menuitem"
              >
                Confirmar reserva
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  onStatusChange('cancelled');
                  setIsOpen(false);
                }}
                role="menuitem"
              >
                Cancelar reserva
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBookingCard = (booking: Booking) => {
    const handleStatusChange = (newStatus: string) => {
      console.log(`Updating booking status to: ${newStatus}`);
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">{booking.courtName}</h3>
            <span className="text-sm text-gray-600">{booking.date}</span>
          </div>
          
          <div className={`flex items-center justify-center px-3 py-2 rounded-full ${getTimeStyle(booking.time)}`}>
            {getTimeIcon(booking.time)}
            <span>{booking.time}</span>
          </div>

          <div className="flex items-center bg-blue-50 p-2 rounded-lg">
            <FaPhone className="text-blue-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Contacto</p>
              <p className="text-sm font-medium text-gray-700">{booking.contactPhone}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="text-sm text-gray-600">Reservado por:</div>
            <div className="bg-blue-100 text-gray-700 p-2 rounded">
              {booking.reserveeName}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Estado:</span>
            <BookingStatus 
              status={booking.status} 
              onStatusChange={handleStatusChange}
            />
          </div>

          <div className="flex justify-end space-x-2 mt-2">
            <button className="text-blue-600 hover:text-blue-800">
              <FaEdit className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTableRow = (booking: Booking) => {
    const handleStatusChange = (newStatus: string) => {
      console.log(`Updating booking status to: ${newStatus}`);
    };

    return (
      <tr key={`${booking.courtName}-${booking.date}-${booking.time}`}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{booking.courtName}</div>
          <div className="text-sm text-gray-500">{booking.type}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{booking.date}</div>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTimeStyle(booking.time)}`}>
            {booking.time}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{booking.reserveeName}</div>
          <div className="text-sm text-gray-500">{booking.contactPhone}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <BookingStatus status={booking.status} onStatusChange={handleStatusChange} />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button className="text-blue-600 hover:text-blue-900">
            <FaEdit className="h-5 w-5" />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div>
      {/* Mobile y Tablet View */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bookings.map((booking, index) => (
          <div key={index}>{renderBookingCard(booking)}</div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cancha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reservado Por
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map(renderTableRow)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTable;
