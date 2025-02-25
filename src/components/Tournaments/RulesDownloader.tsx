import { FileText, Download, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { RulesGenerator } from './RulesGenerator';
import { Tournament } from '@/types/tournament';
import { TournamentInfo } from '@/types/tournament';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface RulesDownloaderProps {
  tournament: Tournament;
  tournamentInfo?: Partial<TournamentInfo>;
}

export function RulesDownloader({ tournament, tournamentInfo }: RulesDownloaderProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      // Simulación de generación de PDF
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Reglamento descargado",
        description: "El reglamento se ha descargado correctamente",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error al descargar",
        description: "No se pudo descargar el reglamento",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Descargar Reglamento</h2>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-medium text-gray-900 dark:text-white">Reglamento del Torneo</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Descarga el reglamento oficial del torneo en formato PDF.
          </p>
          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 