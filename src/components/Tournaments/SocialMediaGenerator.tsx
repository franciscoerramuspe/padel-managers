// components/Tournaments/SocialMediaGenerator.tsx
import { useState } from 'react';
import { Download, Share2, Image as ImageIcon, Calendar, MapPin, Trophy, DollarSign, Clock, Users, Instagram, Shield, Facebook, Twitter } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import Image from 'next/image';
import { Card } from "@/components/ui/card";

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
        // Hacer visible temporalmente el template para la captura
        template.style.display = 'block';
        template.style.position = 'fixed';
        template.style.top = '0';
        template.style.left = '0';
        template.style.zIndex = '-1000';

        // Esperar a que las imágenes se carguen
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(template, {
          scale: 2, // Mejor calidad
          useCORS: true, // Permitir imágenes cross-origin
          allowTaint: true,
          backgroundColor: null,
          logging: true, // Para debug
        });

        // Ocultar el template nuevamente
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
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Generador de Contenido Social</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">¿Qué es esto?</h3>
              <p className="text-sm text-blue-600">
                Genera automáticamente imágenes promocionales para tu torneo, 
                optimizadas para compartir en redes sociales.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Características del banner:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <ImageIcon className="h-4 w-4 text-green-500" />
                  Formato cuadrado (1080x1080px)
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  Optimizado para Instagram
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Download className="h-4 w-4 text-blue-500" />
                  Descarga instantánea
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Previsualización de datos</h3>
            <div className="space-y-3 text-sm">
              <p><span className="font-medium">Título:</span> {tournament.name}</p>
              <p><span className="font-medium">Fecha:</span> {new Date(tournament.start_date).toLocaleDateString()}</p>
              <p><span className="font-medium">Ubicación:</span> {tournamentInfo?.tournament_club_name}</p>
              <p><span className="font-medium">Inscripción:</span> ${tournamentInfo?.inscription_cost}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={generateImage}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 h-12"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generando imagen...
              </>
            ) : (
              <>
                <ImageIcon className="h-5 w-5" />
                Generar Banner para Redes Sociales
              </>
            )}
          </Button>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recomendaciones de uso:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-pink-500" />
                Ideal para feed de Instagram
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-blue-600" />
                Compatible con Facebook
              </li>
              <li className="flex items-center gap-2">
                <Twitter className="h-4 w-4 text-blue-400" />
                Perfecto para Twitter
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Template para la imagen */}
      <div id="social-media-template" className="hidden">
        <div className="w-[1080px] h-[1080px] relative bg-gradient-to-br from-blue-900 to-indigo-900">
          {/* Imagen de fondo con overlay gradiente */}
          <Image
            src="/assets/background2.png"
            alt="Background"
            fill
            className="object-cover mix-blend-overlay opacity-80"
            priority
            unoptimized
          />
          
          {/* Overlay gradiente adicional para mejorar legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col p-16">
            {/* Título principal */}
            <div>
              <h1 className="text-[120px] font-bold text-[#e2ff00] leading-tight tracking-tight">
                {tournament.name}
              </h1>
              <div className="mt-4">
                <div className="text-white text-2xl">
                  {tournament.category}
                </div>
              </div>
            </div>

            {/* Información principal */}
            <div className="mt-12 space-y-8">
              <div className="flex items-center gap-4 text-2xl font-bold text-white">
                <Calendar className="h-8 w-8 text-[#e2ff00]" />
                <p>{new Date(tournament.start_date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long'
                })} - {new Date(tournament.end_date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long'
                })}</p>
              </div>
              <div className="flex items-start gap-4 text-2xl text-white">
                <MapPin className="h-8 w-8 text-[#e2ff00] mt-1" />
                <div>
                  <p className="font-bold">{tournamentInfo?.tournament_club_name}</p>
                  <p className="text-2xl text-white mt-1">
                    {tournamentInfo?.tournament_address}
                  </p>
                </div>
              </div>
            </div>

            {/* Premios e Inscripción */}
            <div className="mt-auto space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <DollarSign className="h-7 w-7 text-[#e2ff00]" />
                      <p className="text-2xl font-bold text-white">
                        Inscripción: ${tournamentInfo?.inscription_cost}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-white" />
                      <p className="text-2xl text-white">
                        Hasta: {new Date(tournamentInfo?.signup_limit_date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#ff4444] rounded-lg p-4 inline-block shadow-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-white" />
                      <p className="text-xl font-bold text-white tracking-wide">CUPOS LIMITADOS</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="h-7 w-7 text-[#e2ff00]" />
                    <p className="text-2xl font-bold text-white">Premios</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xl text-white">
                      1° Lugar: ${tournamentInfo?.first_place_prize}
                    </p>
                    <p className="text-xl text-white">
                      2° Lugar: ${tournamentInfo?.second_place_prize}
                    </p>
                    <p className="text-xl text-white">
                      3° Lugar: ${tournamentInfo?.third_place_prize}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer con redes sociales */}
              <div className="flex justify-between items-center pt-6 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-[#e2ff00]" />
                  <p className="text-white/80">Organiza:</p>
                  <p className="text-xl font-bold text-white">RECREA</p>
                </div>
                <div className="flex items-center gap-3">
                  <Instagram className="h-6 w-6 text-[#e2ff00]" />
                  <p className="text-white/80">Síguenos en Instagram:</p>
                  <p className="text-xl font-bold text-white">@recreauy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}