'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Calendar, Users, DollarSign, Tag, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  teams_limit: number;
  category: string;
  price: number;
  start_date: string;
  end_date: string;
  sign_up_limit_date: string;
}

export default function CreateTournamentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    teams_limit: 2,
    category: '',
    price: 0,
    start_date: '',
    end_date: '',
    sign_up_limit_date: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      //Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      //Redirect to success page
      router.push('/tournaments');

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Crear Nuevo Torneo</h1>
        <p className="text-gray-600 mt-2">Complete los detalles del torneo</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-lg flex items-center">
          <AlertCircle className="mr-3" size={24} />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Nombre del Torneo
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8AFF] focus:border-transparent transition-all duration-300"
              placeholder="Ingrese el nombre del torneo"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                <Users className="mr-2" size={20} />
                Límite de Equipos
              </label>
              <input
                type="number"
                name="teams_limit"
                required
                min="2"
                value={formData.teams_limit}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8AFF] focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                <Tag className="mr-2" size={20} />
                Categoría
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8AFF] focus:border-transparent transition-all duration-300"
              >
                <option value="">Seleccionar categoría</option>
                <option value="1st">Primera</option>
                <option value="2nd">Segunda</option>
                <option value="3rd">Tercera</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
              <DollarSign className="mr-2" size={20} />
              Precio
            </label>
            <input
              type="number"
              name="price"
              required
              min="0"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8AFF] focus:border-transparent transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="mr-2" size={20} />
                Fecha de Inicio
              </label>
              <input
                type="date"
                name="start_date"
                required
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8AFF] focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="mr-2" size={20} />
                Fecha de Fin
              </label>
              <input
                type="date"
                name="end_date"
                required
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8AFF] focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="mr-2" size={20} />
              Fecha Límite de Inscripción
            </label>
            <input
              type="date"
              name="sign_up_limit_date"
              required
              value={formData.sign_up_limit_date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8AFF] focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#6B8AFF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5A75E6] transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Torneo'}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

