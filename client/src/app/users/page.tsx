'use client';

import React, { useState } from 'react';
import UsersTable from '../../components/Users/UsersTable';
import UserFilters from '../../components/Users/UserFilter';
import UserFilterSidebar from '../../components/Users/UserFilterSidebar';
import { FaPlus } from 'react-icons/fa';
import AddUserModal from '../../components/Users/AddUserModal';
import EditUserModal from '../../components/Users/EditUserModal';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  avatar: string;
}

export default function UsersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  
  const [users] = useState<User[]>([
    {
      id: 'USR123458',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-03-15',
      avatar: '/assets/user.png'
    },
    {
        id: 'USR123456',
        name: 'Richard Ramirez',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-03-15',
        avatar: '/assets/user.png'
      },
      {
        id: 'USR123457',
        name: 'Luis Pérez',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-03-15',
        avatar: '/assets/user.png'
      },
      {
        id: 'USR123451',
        name: 'Marcos Pérez',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-03-15',
        avatar: '/assets/user.png'
      },
      {
        id: 'USR123453',
        name: 'Brian Pérez',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-03-15',
        avatar: '/assets/user.png'
      },
      {
        id: 'USR123443',
        name: 'Facundo Pérez',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-03-15',
        avatar: '/assets/user.png'
      },
      {
        id: 'USR123243',
        name: 'Mateo Pérez',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-03-15',
        avatar: '/assets/user.png'
      },
      
    // Add more mock users...
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 text-sm py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus />
            Añadir usuario
          </button>
        </div>

        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          onOpenFilter={() => setIsFilterOpen(true)}
        />

        <div className="mt-8">
          <UsersTable users={filteredUsers} onEditUser={handleEditUser} />
        </div>

        {isAddModalOpen && (
          <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        )}

        {isEditModalOpen && selectedUser && (
          <EditUserModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            user={selectedUser}
          />
        )}

        <UserFilterSidebar 
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
      </div>
    </div>
  );
}
