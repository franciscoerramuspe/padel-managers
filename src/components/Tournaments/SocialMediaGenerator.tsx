// components/Tournaments/SocialMediaGenerator.tsx
import { useState } from 'react';
import { Share2, Image as ImageIcon, Instagram, Facebook, Twitter } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import Image from 'next/image';

interface SocialMediaGeneratorProps {
  tournament: any;
  tournamentInfo: any;
}

export function SocialMediaGenerator({ tournament, tournamentInfo }: SocialMediaGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    setIsGenerating(true);
    try {
      const template = document.getElementById('social-media-template');
      if (template) {
        template.style.display = 'block';
        template.style.position = 'fixed';
        template.style.top = '0';
        template.style.left = '0';
        template.style.zIndex = '-1000';

        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(template, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
        });

        template.style.display = 'none';
        const image = canvas.toDataURL('image/png', 1.0);
        
        const link = document.createElement('a');
        link.download = `${tournament.name}-promo.png`;
        link.href = image;
        link.click();

        toast({
          title: "¡Imagen generada con éxito!",
          description: "La imagen se ha descargado automáticamente.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error al generar la imagen",
        description: "Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    }
    setIsGenerating(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
          <Share2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contenido Social</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Genera imágenes para redes sociales</p>
        </div>
      </div>

      {/* Plataformas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3">
          <Instagram className="h-5 w-5 text-pink-600 dark:text-pink-400" />
          <span className="text-sm font-medium text-pink-700 dark:text-pink-300">Instagram</span>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <Facebook className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Facebook</span>
        </div>
        <div className="flex items-center gap-2 bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3">
          <Twitter className="h-5 w-5 text-sky-500 dark:text-sky-400" />
          <span className="text-sm font-medium text-sky-700 dark:text-sky-300">Twitter</span>
        </div>
      </div>

      {/* Botón de generación */}
      <Button
        onClick={generateImage}
        disabled={isGenerating}
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white flex items-center justify-center gap-2 h-11 rounded-lg"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <ImageIcon className="h-5 w-5" />
            Generar Imagen
          </>
        )}
      </Button>

      {/* Template oculto para la generación */}
      <div id="social-media-template" className="hidden">
        <div className="w-[1080px] h-[1080px] relative bg-gradient-to-br from-blue-900 to-indigo-900">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 h-full flex flex-col p-16">
            <h1 className="text-7xl font-bold text-white mb-8">{tournament.name}</h1>
            <div className="text-3xl text-white/90 mb-4">{tournament.category}</div>
            <div className="text-2xl text-white/80 mb-8">
              {new Date(tournament.start_date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long'
              })}
            </div>
            <div className="mt-auto">
              <div className="text-4xl font-bold text-white mb-4">
                Premio: ${tournamentInfo?.first_place_prize}
              </div>
              <div className="text-xl text-white/90">
                Inscripción: ${tournamentInfo?.inscription_cost}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}