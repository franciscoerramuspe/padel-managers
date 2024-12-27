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
import { TournamentFormat } from '@/types/tournament'

interface FormData {
  name: string
  teams_limit: number
  category: string
  price: number
  start_date: string
  end_date: string
  sign_up_limit_date: string
  format: TournamentFormat
  status: string
}

export default function CreateTournamentPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    teams_limit: 0,
    category: '',
    price: 0,
    start_date: '',
    end_date: '',
    sign_up_limit_date: '',
    format: 'single_elimination',
    status: 'open'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to create tournament')
      }

      const tournament = await response.json()
      router.push(`/tournaments/${tournament.id}`)
    } catch (err) {
      setError('Failed to create tournament')
      console.error('Error:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create Tournament</CardTitle>
          <CardDescription>Set up a new tournament with your desired configuration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Tournament Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Tournament Format</Label>
            <Select
              value={formData.format}
              onValueChange={(value) => setFormData({ ...formData, format: value as TournamentFormat })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single_elimination">Single Elimination</SelectItem>
                <SelectItem value="round_robin">Round Robin</SelectItem>
                <SelectItem value="group_stage">Group Stage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teams_limit">Teams Limit</Label>
              <Input
                id="teams_limit"
                type="number"
                value={formData.teams_limit}
                onChange={(e) => setFormData({ ...formData, teams_limit: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sign_up_limit_date">Sign Up Limit Date</Label>
              <Input
                id="sign_up_limit_date"
                type="date"
                value={formData.sign_up_limit_date}
                onChange={(e) => setFormData({ ...formData, sign_up_limit_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Create Tournament
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

