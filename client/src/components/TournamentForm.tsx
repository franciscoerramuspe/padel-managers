import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { TournamentFormat } from '@/types'
import { useState } from 'react'

const formatOptions = [
  { value: 'single_elimination', label: 'Eliminación Directa' },
  { value: 'round_robin', label: 'Liga (Todos contra Todos)' },
  { value: 'group_stage', label: 'Fase de Grupos' }
]

interface FormData {
  name: string;
  teams_limit: number;
  category: string;
  start_date: string;
  end_date: string;
  price: number;
  sign_up_limit_date: string;
  format: TournamentFormat;
  status: string;
}

export function TournamentForm({ 
  initialData,
  onSubmit,
  buttonText = 'Crear Torneo'
}: TournamentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    teams_limit: 2,
    category: '',
    start_date: '',
    end_date: '',
    price: 0,
    sign_up_limit_date: '',
    format: 'single_elimination',
    status: 'open',
    ...initialData
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate teams limit based on format
    if (formData.format === 'single_elimination' && !isPowerOfTwo(formData.teams_limit)) {
      alert('Para eliminación directa, el límite de equipos debe ser potencia de 2 (2, 4, 8, 16, etc.)');
      return;
    }

    if (formData.format === 'round_robin' && formData.teams_limit < 3) {
      alert('Para liga (todos contra todos), se necesitan al menos 3 equipos');
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Your existing form fields from create/page.tsx */}
      
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
        {formData.format === 'single_elimination' && (
          <p className="text-sm text-gray-500">
            El número de equipos debe ser potencia de 2 (2, 4, 8, 16, etc.)
          </p>
        )}
      </div>

      {/* Rest of your form */}
    </form>
  );
}

function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
} 