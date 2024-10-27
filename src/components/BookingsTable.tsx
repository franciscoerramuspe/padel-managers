import React from 'react';
import { FaSun, FaCloudSun, FaMoon } from 'react-icons/fa';

interface PadelBooking {
  courtName: string;
  type: 'padel';
  date: string;
  time: string;
  players: string[];
  category: string;
}

interface FootballBooking {
  courtName: string;
  type: 'football';
  date: string;
  time: string;
  team: string;
}

type Booking = PadelBooking | FootballBooking;

interface BookingsTableProps {
  bookings: Booking[];
}

const BookingsTable: React.FC<BookingsTableProps> = ({ bookings }) => {
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
        return 'bg-blue-100 text-blue-800';
      case 'afternoon':
        return 'bg-orange-100 text-orange-800';
      case 'night':
        return 'bg-indigo-900 text-white';
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-black mb-4">Canchas de Padel</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-blue-500 text-white uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center">Court</th>
                <th className="py-3 px-6 text-center">Date</th>
                <th className="py-3 px-6 text-center">Time</th>
                <th className="py-3 px-6 text-center">Players</th>
                <th className="py-3 px-6 text-center">Category</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {padelBookings.map((booking, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-center">{booking.courtName}</td>
                  <td className="py-3 px-6 text-center">{booking.date}</td>
                  <td className="py-3 px-6 text-center">
                    <span className={`flex items-center justify-center px-2 py-1 rounded-full ${getTimeStyle(booking.time)}`}>
                      {getTimeIcon(booking.time)}
                      {booking.time}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center">
                      <span>{booking.players.slice(0, 2).join(', ')}</span>
                      <span className="mx-2 font-bold">vs</span>
                      <span>{booking.players.slice(2, 4).join(', ')}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">{booking.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-black mb-4">Canchas de Futbol</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-green-500 text-white uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center">Court</th>
                <th className="py-3 px-6 text-center">Date</th>
                <th className="py-3 px-6 text-center">Time</th>
                <th className="py-3 px-6 text-center">Team</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {footballBookings.map((booking, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-center">{booking.courtName}</td>
                  <td className="py-3 px-6 text-center">{booking.date}</td>
                  <td className="py-3 px-6 text-center">
                    <span className={`flex items-center justify-center px-2 py-1 rounded-full ${getTimeStyle(booking.time)}`}>
                      {getTimeIcon(booking.time)}
                      {booking.time}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">{booking.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsTable;
