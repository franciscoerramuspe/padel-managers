"use client";

import { useSponsors } from "@/hooks/useSponsors";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SponsorsGrid() {
  const { sponsors, isLoading } = useSponsors();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!sponsors.length) {
    return (
      <EmptyState message="No hay patrocinadores registrados aún" />
    );
  }

  return (
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
                onClick={() => {/* TODO: Implementar edición */}}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-red-600"
                onClick={() => {/* TODO: Implementar eliminación */}}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 