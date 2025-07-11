import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { GalleryPreview } from './GalleryPreview';

interface GalleryUploadFormProps {
  leagueId: string;
  onUploadSuccess: () => void;
}

interface PreviewImage {
  file: File;
  preview: string;
  caption?: string;
}

export function GalleryUploadForm({ leagueId, onUploadSuccess }: GalleryUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPreviewImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop
  });

  const removeImage = (index: number) => {
    setPreviewImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const updateCaption = (index: number, caption: string) => {
    setPreviewImages(prev => {
      const newImages = [...prev];
      newImages[index] = { ...newImages[index], caption };
      return newImages;
    });
  };

  const uploadImages = async () => {
    if (previewImages.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor selecciona al menos una imagen"
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const totalImages = previewImages.length;
      let uploadedCount = 0;

      // Subir imágenes en lotes de 3 para no saturar la conexión
      for (let i = 0; i < previewImages.length; i += 3) {
        const batch = previewImages.slice(i, i + 3);
        await Promise.all(batch.map(async (image) => {
          const fileExt = image.file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${leagueId}/${fileName}`;

          // 1. Subir archivo a Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('league-gallery')
            .upload(filePath, image.file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) throw uploadError;

          // 2. Obtener URL pública
          const { data: { publicUrl } } = supabase.storage
            .from('league-gallery')
            .getPublicUrl(filePath);

          // 3. Crear entrada en la tabla league_gallery
          const { error: dbError } = await supabase
            .from('league_gallery')
            .insert({
              league_id: leagueId,
              image_url: publicUrl,
              caption: image.caption || null,
            });

          if (dbError) {
            // Si falla la inserción, eliminar la imagen subida
            await supabase.storage
              .from('league-gallery')
              .remove([filePath]);
            throw dbError;
          }

          uploadedCount++;
          setUploadProgress((uploadedCount / totalImages) * 100);
        }));
      }

      toast({
        title: "¡Éxito!",
        description: `${totalImages} ${totalImages === 1 ? 'imagen subida' : 'imágenes subidas'} correctamente`,
        className: "bg-green-500 text-white"
      });

      // Limpiar previsualizaciones
      previewImages.forEach(image => URL.revokeObjectURL(image.preview));
      setPreviewImages([]);
      onUploadSuccess();

    } catch (error) {
      console.error('Error general:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron subir las imágenes"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-700'}
          hover:border-primary hover:bg-primary/5`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="w-8 h-8 text-gray-400" />
          {isDragActive ? (
            <p>Suelta las imágenes aquí</p>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Arrastra imágenes aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG o WEBP (máx. 5MB por imagen)
              </p>
            </div>
          )}
        </div>
      </div>

      {previewImages.length > 0 && (
        <div className="space-y-4">
          <GalleryPreview
            images={previewImages}
            onRemove={removeImage}
            onCaptionChange={updateCaption}
          />

          <div className="flex items-center gap-4">
            <Button
              onClick={uploadImages}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subiendo... {Math.round(uploadProgress)}%
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Subir {previewImages.length} {previewImages.length === 1 ? 'imagen' : 'imágenes'}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 