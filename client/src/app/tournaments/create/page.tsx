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

  const handleTournamentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const token = localStorage.getItem("adminToken") // Assuming you store the token after login
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error creating tournament")
      }

      const data = await response.json()
      router.push(`/tournaments/${data.tournament.id}`)
    } catch (err: any) {
      setError(err.message || "Error creating tournament")
      console.error("Error:", err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <form onSubmit={handleTournamentSubmit}>
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

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
              onClick={handleTournamentSubmit}
            >
              Crear Torneo
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

