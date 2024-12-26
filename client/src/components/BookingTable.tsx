import React from 'react';
import { Table } from 'antd';
import { Booking } from '../types/booking';

interface BookingTableProps {
  padelBookings: Booking[];
  footballBookings: Booking[];
}

const BookingTable: React.FC<BookingTableProps> = ({ padelBookings, footballBookings }) => {
  const padelColumns = [
    { title: 'Cancha', dataIndex: 'court', key: 'court' },
    { title: 'Fecha', dataIndex: 'date', key: 'date' },
    { title: 'Horario', dataIndex: 'time', key: 'time' },
    { title: 'Jugadores', dataIndex: 'players', key: 'players' },
  ];

  const footballColumns = [
    { title: 'Cancha', dataIndex: 'court', key: 'court' },
    { title: 'Tipo', dataIndex: 'type', key: 'type' },
    { title: 'Fecha', dataIndex: 'date', key: 'date' },
    { title: 'Horario', dataIndex: 'time', key: 'time' },
    { title: 'Equipo', dataIndex: 'team', key: 'team' },
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
