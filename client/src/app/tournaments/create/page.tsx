"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Calendar, Trophy, FileText, ScrollText, MapPin, Home, DollarSign, Medal, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from '@/lib/supabase'

interface Category {
  id: string
  name: string
}

interface FormData {
  name: string
  category_id: string
  start_date: string
  end_date: string
  status: "upcoming" | "in_progress" | "completed"
}

interface TournamentInfo {
  description: string
  rules: string
  tournament_location: string
  tournament_address: string
  tournament_club_name: string
  signup_limit_date: string
  inscription_cost: number
  first_place_prize: string
  second_place_prize?: string
  third_place_prize?: string
  tournament_thumbnail?: File
}

export default function CreateTournamentPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category_id: "",
    start_date: "",
    end_date: "",
    status: "upcoming",
  })
  const [step, setStep] = useState(1)
  const [tournamentInfo, setTournamentInfo] = useState<TournamentInfo>({
    description: "",
    rules: "",
    tournament_location: "",
    tournament_address: "",
    tournament_club_name: "",
    signup_limit_date: "",
    inscription_cost: 0,
    first_place_prize: "",
    second_place_prize: "",
    third_place_prize: "",
    tournament_thumbnail: undefined
  })
  const [fileInputKey, setFileInputKey] = useState(0)

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Error loading categories")
      }
    }

    fetchCategories()
  }, [])

  const handleFirstStep = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category_id || !formData.start_date || !formData.end_date) {
      setError("Todos los campos son requeridos")
      return
    }

    // Validar que la fecha de inicio sea anterior a la fecha de fin
    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      setError("La fecha de inicio debe ser anterior a la fecha de fin")
      return
    }

    setError("")
    setStep(2)
  }

  const uploadThumbnail = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${file.name}`
    
    const { error: uploadError, data } = await supabase.storage
      .from('tournament-thumbnails')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Error uploading thumbnail:', uploadError)
      return null
    }

    // Construir la URL usando la URL base correcta de Supabase
    const baseUrl = 'https://goipmracccjxjmhpizib.supabase.co'
    const publicUrl = `${baseUrl}/storage/v1/object/public/tournament-thumbnails/${fileName}`

    return publicUrl
  }

  const handleTournamentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const token = localStorage.getItem("adminToken")
      
      if (!token) {
        setError("No estás autenticado. Por favor, inicia sesión como administrador.")
        return
      }

      // Primero creamos el torneo básico
      const tournamentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      if (!tournamentResponse.ok) {
        const errorData = await tournamentResponse.json()
        throw new Error(errorData.message || "Error creating tournament")
      }

      const tournamentData = await tournamentResponse.json()
      const tournamentId = tournamentData.torneo.id

      // Si hay una imagen, la subimos primero
      let thumbnailUrl = null
      if (tournamentInfo.tournament_thumbnail) {
        try {
          const file = tournamentInfo.tournament_thumbnail
          const url = await uploadThumbnail(file)
          if (url) {
            thumbnailUrl = url
          }
        } catch (error) {
          console.error('Error al subir la imagen:', error)
          setError('Error al subir la imagen. Por favor, intente nuevamente.')
          return
        }
      }

      // Luego creamos la información adicional del torneo
      try {
        const infoData = {
          description: tournamentInfo.description,
          rules: tournamentInfo.rules,
          tournament_location: tournamentInfo.tournament_location,
          tournament_address: tournamentInfo.tournament_address,
          tournament_club_name: tournamentInfo.tournament_club_name,
          signup_limit_date: tournamentInfo.signup_limit_date,
          inscription_cost: tournamentInfo.inscription_cost,
          first_place_prize: tournamentInfo.first_place_prize,
          second_place_prize: tournamentInfo.second_place_prize,
          third_place_prize: tournamentInfo.third_place_prize,
          tournament_thumbnail: thumbnailUrl
        }

        console.log('Enviando datos al servidor:', infoData)

        const infoResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournamentId}/required-info`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(infoData)
          }
        )

        if (!infoResponse.ok) {
          const errorData = await infoResponse.json()
          throw new Error(errorData.message || "Error creating tournament info")
        }

        router.push('/tournaments')
      } catch (err) {
        console.error("Error completo:", err)
        setError(err instanceof Error ? err.message : "Error al crear el torneo")
      }
    } catch (err: any) {
      console.error("Error completo:", err)
      setError(err.message || "Error al crear el torneo")
    }
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <form onSubmit={handleTournamentSubmit} className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Trophy className="h-8 w-8" />
                Información Adicional del Torneo
              </h1>
              <p className="text-blue-100 mt-2">Complete los detalles adicionales para finalizar la creación del torneo.</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mx-8 mt-6">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            <div className="p-8 space-y-8">
              {/* Imagen del Torneo - UI Moderna */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    {tournamentInfo.tournament_thumbnail ? (
                      <div className="relative group">
                        <img
                          src={URL.createObjectURL(tournamentInfo.tournament_thumbnail)}
                          alt="Vista previa"
                          className="h-48 w-96 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setTournamentInfo(prev => ({ ...prev, tournament_thumbnail: undefined }))
                              setFileInputKey(prev => prev + 1)
                            }}
                            className="text-white hover:text-red-400"
                          >
                            Cambiar imagen
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          <p className="text-sm text-gray-600">Haga clic para subir o arrastre una imagen aquí</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG (MAX. 5MB)</p>
                        </div>
                        <Input
                          key={fileInputKey}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                setError("La imagen no debe superar los 5MB")
                                setFileInputKey(prev => prev + 1)
                                return
                              }
                              setTournamentInfo(prev => ({
                                ...prev,
                                tournament_thumbnail: file
                              }))
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Información Principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="description" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Descripción
                    </Label>
                    <textarea
                      id="description"
                      value={tournamentInfo.description}
                      onChange={(e) => setTournamentInfo({ ...tournamentInfo, description: e.target.value })}
                      required
                      className="mt-2 w-full h-32 p-3 text-lg border-2 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe el torneo..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="rules" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <ScrollText className="h-5 w-5 text-blue-600" />
                      Reglas
                    </Label>
                    <textarea
                      id="rules"
                      value={tournamentInfo.rules}
                      onChange={(e) => setTournamentInfo({ ...tournamentInfo, rules: e.target.value })}
                      required
                      className="mt-2 w-full h-32 p-3 text-lg border-2 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Establece las reglas del torneo..."
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tournament_location" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Ubicación
                      </Label>
                      <Input
                        id="tournament_location"
                        value={tournamentInfo.tournament_location}
                        onChange={(e) => setTournamentInfo({ ...tournamentInfo, tournament_location: e.target.value })}
                        required
                        className="mt-2 h-12 text-lg border-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tournament_club_name" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        Club
                      </Label>
                      <Input
                        id="tournament_club_name"
                        value={tournamentInfo.tournament_club_name}
                        onChange={(e) => setTournamentInfo({ ...tournamentInfo, tournament_club_name: e.target.value })}
                        required
                        className="mt-2 h-12 text-lg border-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tournament_address" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <Home className="h-5 w-5 text-blue-600" />
                      Dirección
                    </Label>
                    <Input
                      id="tournament_address"
                      value={tournamentInfo.tournament_address}
                      onChange={(e) => setTournamentInfo({ ...tournamentInfo, tournament_address: e.target.value })}
                      required
                      className="mt-2 h-12 text-lg border-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup_limit_date" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Fecha Límite
                      </Label>
                      <div className="relative mt-2">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="signup_limit_date"
                          type="date"
                          value={tournamentInfo.signup_limit_date}
                          onChange={(e) => setTournamentInfo({ ...tournamentInfo, signup_limit_date: e.target.value })}
                          required
                          className="h-12 text-lg pl-12 border-2"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="inscription_cost" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        Costo
                      </Label>
                      <div className="relative mt-2">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <Input
                          id="inscription_cost"
                          type="number"
                          value={tournamentInfo.inscription_cost}
                          onChange={(e) => setTournamentInfo({ ...tournamentInfo, inscription_cost: Number(e.target.value) })}
                          required
                          className="h-12 text-lg pl-12 border-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premios */}
              <div>
                <Label className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-blue-600" />
                  Premios
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="first_place" className="text-sm text-gray-600 flex items-center gap-2">
                      <Medal className="h-4 w-4 text-yellow-500" />
                      1er Lugar
                    </Label>
                    <Input
                      id="first_place"
                      value={tournamentInfo.first_place_prize}
                      onChange={(e) => setTournamentInfo({ ...tournamentInfo, first_place_prize: e.target.value })}
                      required
                      className="mt-1 h-12 text-lg border-2"
                      placeholder="Premio para el primer lugar"
                    />
                  </div>
                  <div>
                    <Label htmlFor="second_place" className="text-sm text-gray-600 flex items-center gap-2">
                      <Medal className="h-4 w-4 text-gray-400" />
                      2do Lugar
                    </Label>
                    <Input
                      id="second_place"
                      value={tournamentInfo.second_place_prize}
                      onChange={(e) => setTournamentInfo({ ...tournamentInfo, second_place_prize: e.target.value })}
                      className="mt-1 h-12 text-lg border-2"
                      placeholder="Premio para el segundo lugar"
                    />
                  </div>
                  <div>
                    <Label htmlFor="third_place" className="text-sm text-gray-600 flex items-center gap-2">
                      <Medal className="h-4 w-4 text-amber-700" />
                      3er Lugar
                    </Label>
                    <Input
                      id="third_place"
                      value={tournamentInfo.third_place_prize}
                      onChange={(e) => setTournamentInfo({ ...tournamentInfo, third_place_prize: e.target.value })}
                      className="mt-1 h-12 text-lg border-2"
                      placeholder="Premio para el tercer lugar"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700">
                Finalizar Creación del Torneo
              </Button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <form onSubmit={handleFirstStep} className="max-w-[1400px] mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Trophy className="h-8 w-8" />
              Crear Nuevo Torneo
            </h1>
            <p className="text-blue-100 mt-2">Configure todos los detalles de su nuevo torneo.</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mx-8 mt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Form Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-lg font-semibold text-gray-700">
                    Nombre del Torneo
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-2 h-12 text-lg border-2 text-black focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingrese el nombre del torneo"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-lg font-semibold text-gray-700">
                    Categoría
                  </Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger className="mt-2 h-12 text-sm border-2 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="start_date" className="text-lg font-semibold text-gray-700">
                    Fecha de Inicio
                  </Label>
                  <div className="relative mt-2">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                      className="h-12 text-lg pl-12 border-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="end_date" className="text-lg font-semibold text-gray-700">
                    Fecha de Finalización
                  </Label>
                  <div className="relative mt-2">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                      className="h-12 text-lg pl-12 border-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <Button type="submit" className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700">
                Siguiente Paso
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

