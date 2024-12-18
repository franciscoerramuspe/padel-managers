'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Users, DollarSign, Tag, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface FormData {
  name: string
  teams_limit: number
  category: string
  price: number
  start_date: string
  end_date: string
  sign_up_limit_date: string
}

export default function CreateTournamentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    teams_limit: 2,
    category: '',
    price: 0,
    start_date: '',
    end_date: '',
    sign_up_limit_date: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          teams_limit: parseInt(formData.teams_limit.toString()),
          category: formData.category,
          start_date: formData.start_date,
          end_date: formData.end_date,
          price: parseInt(formData.price.toString()),
          sign_up_limit_date: formData.sign_up_limit_date,
          teams: [], // Initially empty
          players: [], // Initially empty
          time_constraints: [] // Initially empty
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error creating tournament')
      }

      router.push('/tournaments')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-3xl py-8 px-4">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Crear Nuevo Torneo</CardTitle>
          <CardDescription className="text-lg">
            Complete los detalles del torneo
          </CardDescription>
        </CardHeader>

        {error && (
          <Alert variant="destructive" className="mx-6 mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">
                  Nombre del Torneo
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre del torneo"
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="teams_limit" className="text-base flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Límite de Equipos
                  </Label>
                  <Input
                    id="teams_limit"
                    name="teams_limit"
                    type="number"
                    required
                    min="2"
                    value={formData.teams_limit}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-base flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Categoría
                  </Label>
                  <Select
                    name="category"
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange(value, 'category')}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st">Primera</SelectItem>
                      <SelectItem value="2nd">Segunda</SelectItem>
                      <SelectItem value="3rd">Tercera</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-base flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Precio
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start_date" className="text-base flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Fecha de Inicio
                  </Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date" className="text-base flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Fecha de Fin
                  </Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="sign_up_limit_date"
                  className="text-base flex items-center gap-2"
                >
                  <Calendar className="h-5 w-5" />
                  Fecha Límite de Inscripción
                </Label>
                <Input
                  id="sign_up_limit_date"
                  name="sign_up_limit_date"
                  type="date"
                  required
                  value={formData.sign_up_limit_date}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 text-lg font-medium bg-[#6B8AFF] hover:bg-[#5A75E6]"
              >
                {loading ? 'Creando...' : 'Crear Torneo'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="h-12 text-lg font-medium"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

