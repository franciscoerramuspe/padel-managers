import { useEffect, useState } from 'react';
import { toast } from "@/components/ui/use-toast";

interface AdminData {
  first_name: string;
  last_name: string;
  email: string;
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('No se encontró token');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Error al cargar el perfil');
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el perfil');
        toast({
          title: "❌ Error",
          description: err instanceof Error ? err.message : 'Error al cargar el perfil',
          variant: "destructive",
        });
      }
    }

    loadProfile();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          Perfil
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Información personal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700">
            {profile.first_name}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Apellido
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700">
            {profile.last_name}
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700">
            {profile.email}
          </div>
        </div>
      </div>
    </div>
  );
}
