import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface GenerateMatchesButtonProps {
  leagueId: string;
  status: string;
  registeredTeams: number;
  maxTeams: number;
}

export function GenerateMatchesButton({ 
  leagueId, 
  status, 
  registeredTeams,
  maxTeams 
}: GenerateMatchesButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerateMatches = async () => {
    try {
      setIsLoading(true);

      // Validaciones del lado del cliente
      if (status !== 'Inscribiendo') {
        toast({
          title: "No se pueden generar partidos",
          description: "La liga ya no está en periodo de inscripción.",
          variant: "destructive",
        });
        return;
      }

      if (registeredTeams < 2) {
        toast({
          title: "No hay suficientes equipos",
          description: "Se necesitan al menos 2 equipos para generar partidos.",
          variant: "destructive",
        });
        return;
      }

      if (registeredTeams < maxTeams) {
        const confirmGenerate = window.confirm(
          'La liga aún no tiene todos los equipos registrados. ¿Deseas generar los partidos de igual manera?'
        );
        if (!confirmGenerate) {
          return;
        }
      }

      // Llamada al backend para generar los partidos
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leagues/${leagueId}/generate-standings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rounds: 1 // Por ahora hardcodeado a 1 ronda, podría ser configurable
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al generar los partidos');
      }

      toast({
        title: "¡Partidos generados!",
        description: "Los partidos han sido generados exitosamente.",
      });

      // Refrescar la página para mostrar los cambios
      router.refresh();

    } catch (error) {
      console.error('Error generating matches:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al generar los partidos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = status !== 'Inscribiendo' || registeredTeams < 2 || isLoading;

  return (
    <Button
      onClick={handleGenerateMatches}
      disabled={isDisabled}
      className="w-full md:w-auto flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Trophy className="h-5 w-5" />
      )}
      {isLoading ? 'Generando partidos...' : 'Generar Partidos'}
    </Button>
  );
} 