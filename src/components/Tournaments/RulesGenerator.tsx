import { useState, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { FileText, Download, Shield, Calendar, MapPin, Users, Trophy } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Tournament, TournamentInfo } from '@/types/tournament';

interface RulesGeneratorProps {
  tournament: Tournament;
  tournamentInfo: TournamentInfo;
}

export function RulesGenerator({ tournament, tournamentInfo }: RulesGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Memoizamos la imagen de fondo para evitar recargas innecesarias
  const backgroundImage = useMemo(() => {
    const img = new Image();
    img.src = '/assets/reglamento.png';
    return img;
  }, []);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const rules = tournamentInfo?.rules?.split('\n') || [];
      const rulesPerPage = 7;
      const totalPages = Math.ceil(rules.length / rulesPerPage);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Procesamiento en lotes para evitar bloquear el hilo principal
      for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        // Permitir que el navegador respire entre páginas
        if (pageNum > 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
          pdf.addPage();
        }

        const pageRules = rules.slice(
          pageNum * rulesPerPage,
          (pageNum + 1) * rulesPerPage
        );

        const template = document.createElement('div');
        template.id = `rules-template-${pageNum}`;
        template.style.cssText = 'position: absolute; left: -9999px; top: -9999px;';
        document.body.appendChild(template);

        // Renderizado optimizado con menos estilos y efectos
        template.innerHTML = `
          <div style="width: 210mm; height: 297mm; position: relative;">
            <div style="position: absolute; inset: 0; background-image: url('${backgroundImage.src}'); background-size: cover;"></div>
            <div style="position: relative; z-index: 10; padding: 48px; color: white;">
              ${pageNum === 0 ? `
                <div style="text-align: center; margin-bottom: 48px;">
                  <h1 style="font-size: 48px; font-weight: 900; color: white;">REGLAMENTO</h1>
                  <h2 style="font-size: 24px; color: #FCD34D; text-transform: uppercase;">DEL TORNEO</h2>
                </div>
              ` : ''}
              <div style="margin-top: 48px;">
                ${pageRules.map((rule, index) => `
                  <div style="display: flex; gap: 16px; background: rgba(37, 99, 235, 0.3); border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background: #3B82F6; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                      ${pageNum * rulesPerPage + index + 1}
                    </div>
                    <p style="font-size: 18px; margin: 0; color: white;">${rule}</p>
                  </div>
                `).join('')}
              </div>
              <div style="position: absolute; bottom: 48px; left: 48px; right: 48px;">
                <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 24px;">
                  <span style="font-weight: 500;">RECREA</span>
                  <span>Página ${pageNum + 1} de ${totalPages}</span>
                </div>
              </div>
            </div>
          </div>
        `;

        const canvas = await html2canvas(template, {
          scale: 2, // Reducimos la escala para mejor rendimiento
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          onclone: (clonedDoc) => {
            const clonedTemplate = clonedDoc.getElementById(`rules-template-${pageNum}`);
            if (clonedTemplate) clonedTemplate.style.display = 'block';
          }
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95); // Usando JPEG con compresión
        pdf.addImage(imgData, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        document.body.removeChild(template);
      }

      pdf.save(`${tournament.name}-reglamento.pdf`);
      toast({
        title: "¡PDF generado con éxito!",
        description: "El reglamento se ha descargado automáticamente.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error al generar el PDF",
        description: "Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    }
    setIsGenerating(false);
  };

  return (
    <>
      <Button 
        onClick={generatePDF}
        disabled={isGenerating}
        variant="outline" 
        className="flex items-center gap-2"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Descargar PDF
          </>
        )}
      </Button>

      {/* Template oculto para el PDF */}
      <div id="rules-template" className="hidden">
        <div className="w-[210mm] h-[297mm] relative">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(/assets/reglamento.png)',
            }}
          />

          {/* Contenido con overlay para mejor legibilidad */}
          <div className="relative z-10 p-12 text-white">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-6xl font-black tracking-tight mb-2 text-white">
                REGLAMENTO
              </h1>
              <h2 className="text-2xl font-medium text-yellow-400 uppercase tracking-wider">
                DEL TORNEO
              </h2>
            </div>

            {/* Reglas */}
            <div className="space-y-6 mt-12">
              {tournamentInfo?.rules?.split('\n').map((rule: string, index: number) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 bg-gradient-to-r from-blue-600/30 to-blue-400/10 
                           rounded-lg p-6 backdrop-blur-sm border-l-4 border-yellow-400 
                           transition-transform hover:scale-[1.02]"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br 
                                from-blue-500 to-blue-700 text-white flex items-center 
                                justify-center font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                  <p className="text-lg leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-12 left-12 right-12">
              <div className="flex items-center justify-between text-white/80 border-t border-white/20 pt-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-yellow-400" />
                  <span className="font-medium text-xl tracking-wide">RECREA</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm opacity-70">Documento Oficial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 