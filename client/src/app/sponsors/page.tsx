"use client";

import { useState } from "react";
import { ImageIcon, PlusCircle } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import AddSponsorModal from "@/components/Sponsors/AddSponsorModal";
import SponsorsGrid from "@/components/Sponsors/SponsorsGrid";

export default function SponsorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
          title="Patrocinadores"
          icon={<ImageIcon className="w-6 h-6" />}
          description="Administra los patrocinadores del club."
          button={
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#6B8AFF] text-white hover:bg-[#5A75E6]"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Añadir Patrocinador
            </Button>
          }
        />
        
        <div className="mt-8">
          <SponsorsGrid />
        </div>

        <AddSponsorModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
