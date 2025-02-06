"use client";

import { useState } from "react";
import { useSponsors } from "@/hooks/useSponsors";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditSponsorModal from "./EditSponsorModal";
import { Sponsor } from "@/types/sponsor";

export default function SponsorsGrid() {
  const { sponsors, isLoading, deleteSponsor, updateSponsor } = useSponsors();
  const [sponsorToDelete, setSponsorToDelete] = useState<string | null>(null);
  const [sponsorToEdit, setSponsorToEdit] = useState<Sponsor | null>(null);

  const handleDelete = async () => {
    if (sponsorToDelete) {
      try {
        await deleteSponsor(sponsorToDelete);
      } catch (error) {
        console.error('Error deleting sponsor:', error);
      }
      setSponsorToDelete(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!sponsors.length) {
    return (
      <EmptyState message="No hay patrocinadores registrados aún" />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map((sponsor) => (
          <div 
            key={sponsor.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="relative h-40 w-full mb-4">
              <Image
                src={sponsor.logo_url}
                alt={sponsor.name}
                fill
                unoptimized
                className="object-contain rounded-lg"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {sponsor.name}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-blue-600"
                  onClick={() => setSponsorToEdit(sponsor)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-red-600"
                  onClick={() => setSponsorToDelete(sponsor.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!sponsorToDelete} onOpenChange={() => setSponsorToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El patrocinador será eliminado permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSponsorToDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditSponsorModal
        sponsor={sponsorToEdit}
        isOpen={!!sponsorToEdit}
        onClose={() => setSponsorToEdit(null)}
        onUpdate={updateSponsor}
      />
    </>
  );
} 