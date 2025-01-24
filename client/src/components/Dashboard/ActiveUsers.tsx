'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Player {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_photo: string | null;
  role: string;
}

export default function ActiveUsers() {
  const [users, setUsers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.slice(0, 5)); // Only show first 5 users
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
                  src={user.profile_photo || '/assets/user.png'}
                  alt={`${user.first_name} ${user.last_name}`}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{`${user.first_name} ${user.last_name}`}</p>
                <p className="text-sm text-gray-600">{user.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 