'use client';

import React, { useState, useEffect } from 'react';
import UsersTable from '../../components/Users/UsersTable';
import UserFilters from '../../components/Users/UserFilter';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  lastLogin: string;
  avatar: string;
  phone: string;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        const transformedUsers = data.map((user: any) => ({
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role === 'user' ? 'Jugador' : user.role,
          status: 'active', 
          lastLogin: new Date().toISOString().split('T')[0], 
          avatar: user.profile_photo || '/assets/user.png',
          phone: user.phone || 'No disponible'
        }));
        setUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    // Convertimos el término de búsqueda a minúsculas y eliminamos espacios extra
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    // Buscamos en nombre, email y teléfono
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.phone.toLowerCase().includes(searchTermLower);
    
    // Verificamos el rol
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse bg-gray-100 h-64 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
        </div>

        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />

        <div className="mt-8">
          <UsersTable users={filteredUsers} />
        </div>
      </div>
    </div>
  );
}
