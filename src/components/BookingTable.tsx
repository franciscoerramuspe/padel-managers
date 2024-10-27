import React from 'react';
import { Table } from 'antd';
import { Booking } from '../types/booking';

interface BookingTableProps {
  padelBookings: Booking[];
  footballBookings: Booking[];
}

const BookingTable: React.FC<BookingTableProps> = ({ padelBookings, footballBookings }) => {
  const padelColumns = [
    { title: 'Court', dataIndex: 'court', key: 'court' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Time', dataIndex: 'time', key: 'time' },
    { title: 'Players', dataIndex: 'players', key: 'players' },
  ];

  const footballColumns = [
    { title: 'Court', dataIndex: 'court', key: 'court' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Time', dataIndex: 'time', key: 'time' },
    { title: 'Team', dataIndex: 'team', key: 'team' },
  ];

  return (
    <div>
      <h2>Reservas de Pádel</h2>
      <Table dataSource={padelBookings} columns={padelColumns} rowKey="id" />
      
      <h2>Reservas de Fútbol</h2>
      <Table dataSource={footballBookings} columns={footballColumns} rowKey="id" />
    </div>
  );
};

export default BookingTable;
