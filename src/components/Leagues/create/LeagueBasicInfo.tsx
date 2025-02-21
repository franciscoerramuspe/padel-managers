import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LeagueBasicInfoProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: string[];
  onSubmit: (data: any) => void;
}

export function LeagueBasicInfo({ formData, setFormData, categories, onSubmit }: LeagueBasicInfoProps) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-6">Información Básica de la Liga</h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Nombre de la Liga</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Liga Nocturna 4ta"
          />
        </div>

        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="start_date">Fecha de Inicio</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />
        </div>

        <div className="pt-6 flex justify-end">
          <Button onClick={() => onSubmit(formData)}>
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
} 