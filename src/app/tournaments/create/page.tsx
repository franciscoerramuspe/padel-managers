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
import { TournamentInfo, FormData } from "@/types/tournament"

export default function CreateTournamentPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category_ids: [],
    start_date: '',
    end_date: '',
    status: 'draft'
  })
  const [tournamentInfo, setTournamentInfo] = useState<TournamentInfo>({
    time_slots: [],
    courts_available: [],
    description: '',
    rules: '',
    tournament_location: '',
    tournament_address: '',
    tournament_club_name: '',
    signup_limit_date: '',
    inscription_cost: 0,
    first_place_prize: '',
    second_place_prize: '',
    third_place_prize: ''
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
    
    // Validamos todo junto antes de enviar
    const errors = []
    
    if (!tournamentInfo.time_slots?.length) {
      errors.push("Debe agregar al menos un horario disponible")
    }

    if (!tournamentInfo.courts_available?.length) {
      errors.push("Debe seleccionar al menos una cancha disponible")
    }

    // Otras validaciones necesarias...

    // Si hay errores, mostramos el toast con todos los errores
    if (errors.length > 0) {
      toast({
        title: "Error",
        description: errors.join(". "),
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...tournamentInfo,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al crear el torneo')
      }

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
                tournamentInfo={tournamentInfo}
                setTournamentInfo={setTournamentInfo}
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