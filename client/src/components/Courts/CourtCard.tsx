import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface CourtCardProps {
  id: string;
  name: string;
  photo_url: string;
  onDelete: (court: { id: string; name: string }) => void;
  onEdit: (court: { id: string; name: string; photo_url: string }) => void;
}

const DEFAULT_COURT_IMAGE = '/assets/default-court.jpg';

function getImageUrl(photoUrl: string | null) {
  if (!photoUrl) return DEFAULT_COURT_IMAGE;
  try {
    if (photoUrl.includes('supabase.co')) return photoUrl;
    return DEFAULT_COURT_IMAGE;
  } catch {
    return DEFAULT_COURT_IMAGE;
  }
}

export default function CourtCard({ id, name, photo_url, onDelete, onEdit }: CourtCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={photo_url}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-all duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit({ id, name, photo_url })}
            className="h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete({ id, name })}
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 