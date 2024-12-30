'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { DashboardUser } from '../../types/user';
export default function ActiveUsers() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        // Fetch users from auth.users
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        if (authError) throw authError;

        // Fetch user roles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');
        if (rolesError) throw rolesError;

        // Combine user data with roles
        const combinedUsers = authUsers.users.map(user => {
          const userRole = userRoles.find(role => role.user_id === user.id);
          return {
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
            role: userRole?.role || 'user',
            avatar: user.user_metadata?.avatar_url || '/assets/user.png'
          };
        });

        setUsers(combinedUsers.slice(0, 5)); // Only show first 5 users
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 h-64 rounded-xl"></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Usuarios</h2>
        <Link href="/users" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
          Ver todos
        </Link>
      </div>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="relative w-10 h-10 mr-3">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">{user.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 