import { useState } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
  uploaded_at: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  isAdmin?: boolean;
  onImageDelete?: () => void;
}

export function GalleryGrid({ images, isAdmin = false, onImageDelete }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (imageId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la imagen');
      }

      toast({
        title: "¡Éxito!",
        description: "Imagen eliminada correctamente",
        className: "bg-green-500 text-white"
      });

      onImageDelete?.();

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la imagen"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const slides = images.map(img => ({
    src: img.image_url,
    alt: img.caption
  }));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={image.id} className="relative group">
            <div 
              className="aspect-square relative overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image.image_url}
                alt={image.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-sm text-center px-2">
                  {image.caption || 'Sin descripción'}
                </p>
              </div>
            </div>
            
            {isAdmin && (
              <button
                onClick={() => handleDelete(image.id)}
                disabled={isDeleting}
                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        open={selectedImage !== null}
        close={() => setSelectedImage(null)}
        index={selectedImage || 0}
        slides={slides}
      />
    </>
  );
} 