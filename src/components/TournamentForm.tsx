import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TournamentFormat } from '@/types'

const formatOptions = [
  { value: 'single_elimination', label: 'Eliminación Directa' },
  { value: 'round_robin', label: 'Liga (Todos contra Todos)' },
  { value: 'group_stage', label: 'Fase de Grupos' }
]

export function TournamentForm({ 
  initialData,
  onSubmit,
  buttonText = 'Crear Torneo'
}: TournamentFormProps) {
  // ... existing code ...

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... other form fields ... */}
      
      <div className="space-y-2">
        <Label>Formato del Torneo</Label>
        <Select
          value={formData.format}
          onValueChange={(value) => setFormData({ ...formData, format: value as TournamentFormat })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el formato" />
          </SelectTrigger>
          <SelectContent>
            {formatOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.format === 'group_stage' && (
          <p className="text-sm text-gray-500">
            Mínimo 6 equipos recomendado para fase de grupos (2 grupos de 3)
          </p>
        )}
      </div>

      {/* ... rest of the form ... */}
    </form>
  )
} 