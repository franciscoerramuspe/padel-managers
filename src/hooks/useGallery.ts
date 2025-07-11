import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface GalleryImage {
  id: string;
  league_id: string;
  image_url: string;
  caption: string;
  match_id: string | null;
  uploaded_at: string;
}

interface UploadResponse {
  message: string;
  photo: GalleryImage;
}

interface DeleteResponse {
  message: string;
}

const galleryKeys = {
  all: ['gallery'] as const,
  league: (leagueId: string) => [...galleryKeys.all, leagueId] as const,
};

export function useGallery(leagueId: string) {
  const queryClient = useQueryClient();

  const { data: images, isLoading, error } = useQuery({
    queryKey: galleryKeys.league(leagueId),
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gallery/${leagueId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      if (!response.ok) {
        throw new Error('Error al cargar las imágenes');
      }
      const data = await response.json();
      return data.photos as GalleryImage[];
    }
  });

  const uploadMutation = useMutation<UploadResponse, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gallery/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: galleryKeys.league(leagueId)
      });
    }
  });

  const deleteMutation = useMutation<DeleteResponse, Error, string>({
    mutationFn: async (imageId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gallery/${imageId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      if (!response.ok) {
        throw new Error('Error al eliminar la imagen');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: galleryKeys.league(leagueId)
      });
    }
  });

  return {
    images: images || [],
    isLoading,
    error,
    uploadImage: uploadMutation.mutateAsync,
    deleteImage: deleteMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
} 