import { Dialog } from '@headlessui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Tournament } from '../app/tournaments/[id]/page'
import { X, Calendar, Users, DollarSign, Trophy, MapPin, Layout, Activity } from 'lucide-react'

type Props = {
  tournament: Tournament
  isOpen: boolean
  onClose: () => void
}

export function TournamentEditForm({ tournament, isOpen, onClose }: Props) {
  const [formData, setFormData] = useState({
    name: tournament.name,
    startDate: tournament.start_date?.split('T')[0] || '',
    endDate: tournament.end_date?.split('T')[0] || '',
    maxParticipants: tournament.teams_limit,
    entryFee: tournament.price || 0,
    prizePool: tournament.prize_pool || 0,
    location: tournament.location || '',
    format: tournament.format || 'single_elimination',
    status: tournament.status || 'draft',
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const apiData = {
        name: data.name,
        start_date: data.startDate,
        end_date: data.endDate,
        teams_limit: data.maxParticipants,
        price: data.entryFee,
        location: data.location,
        format: data.format,
        status: data.status,
        prize_pool: data.prizePool,
        category: tournament.category,
        sign_up_limit_date: tournament.sign_up_limit_date
      };

      console.log('Sending update data:', apiData); // Debug log

      const response = await fetch(`/api/tournaments/${tournament.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        throw new Error(errorData.error || 'Failed to update tournament');
      }

      const updatedTournament = await response.json();
      console.log('Update successful:', updatedTournament);
      return updatedTournament;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament', tournament.id] });
      onClose();
      window.location.reload();
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      // Optionally add error handling here
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <Dialog.Title className="text-2xl font-bold text-black">
              Editar Detalles del Torneo
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6B8AFF] focus:border-[#6B8AFF] focus:outline-none text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Ubicación</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900" size={18} />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6B8AFF] focus:border-[#6B8AFF] focus:outline-none text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Fecha de Inicio</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900" size={18} />
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6B8AFF] focus:border-[#6B8AFF] focus:outline-none text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Fecha de Fin</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900" size={18} />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6B8AFF] focus:border-[#6B8AFF] focus:outline-none text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Máximo de Participantes</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6B8AFF] focus:border-[#6B8AFF] focus:outline-none text-black"
                    min="2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Cuota de Entrada</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    value={formData.entryFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, entryFee: parseFloat(e.target.value) }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6B8AFF] focus:border-[#6B8AFF] focus:outline-none text-black"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Premio Total</label>
                <div className="relative">
                  <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    value={formData.prizePool}
                    onChange={(e) => setFormData(prev => ({ ...prev, prizePool: parseFloat(e.target.value) }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6B8AFF] focus:border-[#6B8AFF] focus:outline-none text-black"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Formato</label>
                <div className="relative">
                  <Layout className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6B8AFF] focus:border-[#6B8AFF] focus:outline-none appearance-none text-black"
                  >
                    <option value="single_elimination">Eliminación Simple</option>
                    <option value="round_robin">Todos contra Todos</option>
                    <option value="group_stage">Fase de Grupos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Estado</label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6B8AFF] focus:border-[#6B8AFF] focus:outline-none appearance-none text-black"
                  >
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B8AFF]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-[#6B8AFF] rounded-md hover:bg-[#5A75E6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B8AFF] disabled:opacity-50"
              >
                {mutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

