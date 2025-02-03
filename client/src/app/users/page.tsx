'use client';

import React, { useState, useEffect } from 'react';
import UsersTable from '../../components/Users/UsersTable';
import UserFilters from '../../components/Users/UserFilter';
import UserFilterSidebar from '../../components/Users/UserFilterSidebar';
import { FaPlus } from 'react-icons/fa';
import AddUserModal from '../../components/Users/AddUserModal';
import EditUserModal from '../../components/Users/EditUserModal';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_photo: string | null;
  role: string;
  status?: 'active' | 'inactive';
  lastLogin?: string;
  phone?: string;
}

export default function UsersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
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
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          onOpenFilter={() => setIsFilterOpen(true)}
        />

        <div className="mt-8">
          <UsersTable users={filteredUsers} onEditUser={handleEditUser} />
        </div>

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
          onApplyFilters={() => {
          }}
        />
      </div>
    </div>
  );
}
