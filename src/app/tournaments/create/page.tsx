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
import { TournamentInfo, TournamentFormData, TournamentBase } from "@/types/tournament"
import { createTournament } from "@/services/tournamentService"

export default function CreateTournamentPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<TournamentFormData>({
    name: '',
    category_id: '',
    start_date: '',
    end_date: '',
    status: 'upcoming',
    courts_available: 0,
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
  const { categories, loading, error: categoriesError } = useCategories()
  const { courts, isLoading: courtsLoading } = useCourts()

  const handleFirstStep = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleTournamentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await createTournament(formData)
      
      toast({
        title: "Éxito",
        description: "Torneo creado correctamente",
      })
      router.push('/tournaments')
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Error desconocido',
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Header 
          title="Crear Nuevo Torneo"
          icon={<Trophy className="w-6 h-6" />}
          description="Configure todos los detalles de su nuevo torneo."
        />
        
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg">
            {step === 1 ? (
              <TournamentBasicInfo
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                onSubmit={handleFirstStep}
              />
            ) : (
              <TournamentDetailInfo
                tournament={formData as TournamentBase & { tournament_info: TournamentInfo }}
                setTournament={(tournament) => setFormData(prev => ({ ...prev, tournament_info: tournament as unknown as TournamentInfo }))}
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