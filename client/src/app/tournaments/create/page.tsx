"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Calendar, Trophy, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
      <div className="max-w-2xl mx-auto py-8">
        <form onSubmit={handleTournamentSubmit}>
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Trophy className="h-6 w-6" />
                Información Adicional del Torneo
              </CardTitle>
              <CardDescription className="text-blue-100">
                Complete la información adicional del torneo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="tournament_thumbnail">Imagen del Torneo</Label>
                <Input
                  key={fileInputKey}
                  id="tournament_thumbnail"
                  type="file"
                  accept="image/*"
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
                  className="cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={tournamentInfo.description}
                  onChange={(e) => setTournamentInfo({ ...tournamentInfo, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">Reglas</Label>
                <Input
                  id="rules"
                  value={tournamentInfo.rules}
                  onChange={(e) => setTournamentInfo({ ...tournamentInfo, rules: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tournament_location">Ubicación</Label>
                  <Input
                    id="tournament_location"
                    value={tournamentInfo.tournament_location}
                    onChange={(e) => setTournamentInfo({ ...tournamentInfo, tournament_location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tournament_club_name">Club</Label>
                  <Input
                    id="tournament_club_name"
                    value={tournamentInfo.tournament_club_name}
                    onChange={(e) => setTournamentInfo({ ...tournamentInfo, tournament_club_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tournament_address">Dirección</Label>
                <Input
                  id="tournament_address"
                  value={tournamentInfo.tournament_address}
                  onChange={(e) => setTournamentInfo({ ...tournamentInfo, tournament_address: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup_limit_date">Fecha Límite de Inscripción</Label>
                  <Input
                    id="signup_limit_date"
                    type="date"
                    value={tournamentInfo.signup_limit_date}
                    onChange={(e) => setTournamentInfo({ ...tournamentInfo, signup_limit_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inscription_cost">Costo de Inscripción</Label>
                  <Input
                    id="inscription_cost"
                    type="number"
                    value={tournamentInfo.inscription_cost}
                    onChange={(e) => setTournamentInfo({ ...tournamentInfo, inscription_cost: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Premios</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="1er Lugar"
                    value={tournamentInfo.first_place_prize}
                    onChange={(e) => setTournamentInfo({ ...tournamentInfo, first_place_prize: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="2do Lugar"
                    value={tournamentInfo.second_place_prize}
                    onChange={(e) => setTournamentInfo({ ...tournamentInfo, second_place_prize: e.target.value })}
                  />
                  <Input
                    placeholder="3er Lugar"
                    value={tournamentInfo.third_place_prize}
                    onChange={(e) => setTournamentInfo({ ...tournamentInfo, third_place_prize: e.target.value })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Finalizar Creación del Torneo
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <form onSubmit={handleFirstStep}>
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Crear Torneo
            </CardTitle>
            <CardDescription className="text-blue-100">Configure un nuevo torneo con sus preferencias.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg font-semibold">
                Nombre del Torneo
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                placeholder="Ingrese el nombre del torneo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-lg font-semibold">
                Categoría
              </Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 transition-colors">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-lg font-semibold">
                  Fecha de Inicio
                </Label>
                <div className="relative">
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-lg font-semibold">
                  Fecha de Finalización
                </Label>
                <div className="relative">
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Siguiente Paso
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

