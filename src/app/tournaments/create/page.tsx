"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trophy } from "lucide-react"
import { TournamentBasicInfo } from "@/components/Tournaments/create/TournamentBasicInfo"
import { TournamentDetailInfo } from "@/components/Tournaments/create/TournamentDetailInfo"
import { useCategories } from "@/hooks/useCategories"
import { useCourts } from "@/hooks/useCourts"
import Header from "@/components/Header"
import { toast } from "@/components/ui/use-toast"
import { TournamentFormData } from "@/types/tournament"
import { createTournament, setTournamentRequiredInfo } from "@/services/tournamentService"

export default function CreateTournamentPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const { categories, isLoading } = useCategories()
  const [formData, setFormData] = useState<TournamentFormData>({
    name: '',
    category_ids: [],
    categories: [],
    start_date: '',
    end_date: '',
    status: 'upcoming',
    courts_available: 2,
    time_slots: [],
    tournament_info: {
      description: '',
      rules: '',
      tournament_location: '',
      tournament_address: '',
      tournament_club_name: '',
      signup_limit_date: '',
      inscription_cost: 0,
      first_place_prize: '',
      second_place_prize: '',
      third_place_prize: '',
      tournament_thumbnail: ''
    }
  })

  const { courts, isLoading: courtsLoading } = useCourts()

  const handleFirstStep = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleTournamentSubmit = async (tournamentData: TournamentFormData) => {
    try {
      console.log('Datos del torneo a enviar:', tournamentData);
      
      const formattedTimeSlots = tournamentData.time_slots.map(slot => {
        const startHour = parseInt(slot.start);
        const endHour = parseInt(slot.end);
        return [startHour, endHour] as [number, number];
      });
      console.log('Time slots formateados:', formattedTimeSlots);

      const tournamentPayload = {
        name: tournamentData.name,
        category_id: tournamentData.category_ids[0],
        start_date: tournamentData.start_date,
        end_date: tournamentData.end_date,
        status: tournamentData.status,
        courts_available: 2,
        time_slots: formattedTimeSlots
      };
      console.log('Payload a enviar al backend:', tournamentPayload);

      const tournamentResponse = await createTournament(tournamentPayload);
      console.log('Respuesta del backend:', tournamentResponse);
      
      // Luego creamos la información adicional del torneo
      if (tournamentResponse.torneo?.id) {
        await setTournamentRequiredInfo(tournamentResponse.torneo.id, tournamentData.tournament_info);
      }

      toast({
        title: "Éxito",
        description: "Torneo creado correctamente",
      });
      router.push('/tournaments');
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Error desconocido',
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Cargando categorías...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <Header 
          title="Crear Nuevo Torneo"
          icon={<Trophy className="w-6 h-6 text-gray-900 dark:text-gray-100" />}
          description="Configure todos los detalles de su nuevo torneo."
        />
        
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            {step === 1 ? (
              <TournamentBasicInfo
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                onSubmit={handleFirstStep}
              />
            ) : (
              <TournamentDetailInfo
                tournament={formData}
                setTournament={setFormData}
                onSubmit={handleTournamentSubmit}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}