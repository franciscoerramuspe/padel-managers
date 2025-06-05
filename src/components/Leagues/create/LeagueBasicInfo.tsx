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
      <h2 className="text-lg font-semibold mb-6 text-foreground dark:text-foreground">Información Básica de la Liga</h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-foreground dark:text-foreground">Nombre de la Liga</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Liga Nocturna 4ta"
            className="bg-background dark:bg-background border-border"
          />
        </div>

        <div>
          <Label htmlFor="category" className="text-foreground dark:text-foreground">Categoría</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="bg-background dark:bg-background border-border">
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
          <Label htmlFor="start_date" className="text-foreground dark:text-foreground">Fecha de Inicio</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="bg-background dark:bg-background border-border"
          />
        </div>

        <div className="pt-6 flex justify-end">
          <Button onClick={() => onSubmit(formData)} className="bg-primary hover:bg-primary/90">
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
} 