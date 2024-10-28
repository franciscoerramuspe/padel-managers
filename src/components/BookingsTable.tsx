import React, { useState } from 'react';
import { FaSun, FaCloudSun, FaMoon, FaChevronLeft, FaChevronRight, FaPhone } from 'react-icons/fa';

interface PadelBooking {
  courtName: string;
  type: 'padel';
  date: string;
  time: string;
  reserveeName: string; 
  category: string;
  contactPhone: string;
}

interface FootballBooking {
  courtName: string;
  type: 'football';
  date: string;
  time: string;
  reserveeName: string;
  contactPhone: string;
}

type Booking = PadelBooking | FootballBooking;

interface BookingsTableProps {
  bookings: Booking[];
}

const BookingsTable: React.FC<BookingsTableProps> = ({ bookings }) => {
  const [currentPadelSlide, setCurrentPadelSlide] = useState(0);
  const [currentFootballSlide, setCurrentFootballSlide] = useState(0);

  const padelBookings = bookings.filter((booking): booking is PadelBooking => booking.type === 'padel');
  const footballBookings = bookings.filter((booking): booking is FootballBooking => booking.type === 'football');

  const getTimeOfDay = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'night';
  };

  const getTimeStyle = (time: string) => {
    const timeOfDay = getTimeOfDay(time);
    switch (timeOfDay) {
      case 'morning':
        return 'bg-gradient-to-r from-blue-200 to-white relative overflow-hidden shadow-inner text-blue-800 border border-blue-100';
      case 'afternoon':
        return 'bg-gradient-to-r from-orange-200 to-white relative overflow-hidden shadow-inner text-orange-800 border border-orange-100';
      case 'night':
        return 'bg-gradient-to-r from-indigo-900 to-indigo-700 relative overflow-hidden shadow-inner text-white border border-indigo-500';
      default:
        return '';
    }
  };

  const getTimeIcon = (time: string) => {
    const timeOfDay = getTimeOfDay(time);
    switch (timeOfDay) {
      case 'morning':
        return <FaSun className="mr-2" />;
      case 'afternoon':
        return <FaCloudSun className="mr-2" />;
      case 'night':
        return <FaMoon className="mr-2" />;
      default:
        return null;
    }
  };

  const renderBookingCard = (booking: Booking) => {
    if (booking.type === 'padel') {
      return (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">{booking.courtName}</h3>
              <span className="text-sm text-gray-600">{booking.date}</span>
            </div>
            
            <div className={`flex items-center justify-center px-3 py-2 rounded-full ${getTimeStyle(booking.time)}`}>
              {getTimeIcon(booking.time)}
              <span className="relative z-10">{booking.time}</span>
              {getTimeOfDay(booking.time) === 'morning' && (
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-300 rounded-full" />
                  <div className="absolute top-3 right-2 w-1 h-1 bg-yellow-300 rounded-full" />
                </div>
              )}
              {getTimeOfDay(booking.time) === 'afternoon' && (
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 right-2 w-4 h-4 bg-yellow-500 rounded-full blur-sm" />
                </div>
              )}
              {getTimeOfDay(booking.time) === 'night' && (
                <div className="absolute inset-0">
                  <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full opacity-50" />
                  <div className="absolute top-3 right-3 w-1 h-1 bg-white rounded-full opacity-70" />
                  <div className="absolute bottom-2 left-4 w-0.5 h-0.5 bg-white rounded-full opacity-60" />
                  <div className="absolute top-2 right-4 w-0.5 h-0.5 bg-white rounded-full opacity-40" />
                </div>
              )}
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
              <span className="text-sm font-medium text-gray-600">Categoría:</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                {booking.category}
              </span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">{booking.courtName}</h3>
              <span className="text-sm text-gray-600">{booking.date}</span>
            </div>
            <div className={`flex items-center justify-center px-3 py-2 rounded-full ${getTimeStyle(booking.time)}`}>
              {getTimeIcon(booking.time)}
              <span className="relative z-10">{booking.time}</span>
              {getTimeOfDay(booking.time) === 'morning' && (
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-300 rounded-full" />
                  <div className="absolute top-3 right-2 w-1 h-1 bg-yellow-300 rounded-full" />
                </div>
              )}
              {getTimeOfDay(booking.time) === 'afternoon' && (
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 right-2 w-4 h-4 bg-yellow-500 rounded-full blur-sm" />
                </div>
              )}
              {getTimeOfDay(booking.time) === 'night' && (
                <div className="absolute inset-0">
                  <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full opacity-50" />
                  <div className="absolute top-3 right-3 w-1 h-1 bg-white rounded-full opacity-70" />
                  <div className="absolute bottom-2 left-4 w-0.5 h-0.5 bg-white rounded-full opacity-60" />
                  <div className="absolute top-2 right-4 w-0.5 h-0.5 bg-white rounded-full opacity-40" />
                </div>
              )}
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
          </div>
        </div>
      );
    }
  };

  const renderSlider = (bookings: Booking[], currentSlide: number, setCurrentSlide: (slide: number) => void) => {
    return (
      <>
        {/* Mobile y Tablet View */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bookings.map((booking, index) => (
            <div key={index}>{renderBookingCard(booking)}</div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block relative">
          {bookings.length > 3 ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                {bookings
                  .slice(currentSlide * 3, (currentSlide + 1) * 3)
                  .map((booking, index) => (
                    <div key={index}>{renderBookingCard(booking)}</div>
                  ))}
              </div>

              {currentSlide > 0 && (
                <button
                  onClick={() => setCurrentSlide(currentSlide - 1)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <FaChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}

              {currentSlide < Math.ceil(bookings.length / 3) - 1 && (
                <button
                  onClick={() => setCurrentSlide(currentSlide + 1)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <FaChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              )}

              <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: Math.ceil(bookings.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {bookings.map((booking, index) => (
                <div key={index}>{renderBookingCard(booking)}</div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-black mb-4">Canchas de Padel</h2>
        {renderSlider(padelBookings, currentPadelSlide, setCurrentPadelSlide)}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-black mb-4">Canchas de Futbol</h2>
        {renderSlider(footballBookings, currentFootballSlide, setCurrentFootballSlide)}
      </div>
    </div>
  );
};

export default BookingsTable;
