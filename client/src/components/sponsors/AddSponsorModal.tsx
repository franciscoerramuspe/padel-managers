"use client";

import { useState } from "react";
import { X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSponsors } from "@/hooks/useSponsors";
import { toast } from "@/components/ui/use-toast";

interface AddSponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSponsorModal({ isOpen, onClose }: AddSponsorModalProps) {
  const { createSponsor } = useSponsors();
  const [formData, setFormData] = useState({
    name: "",
    file: null as File | null
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no debe superar los 5MB");
        return;
      }
      setFormData(prev => ({ ...prev, file }));
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!formData.name || !formData.file) {
        throw new Error("El nombre y el logo son requeridos");
      }

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("file", formData.file);

      await createSponsor(submitData);
      
      toast({
        title: "Éxito",
        description: "Patrocinador creado correctamente",
      });
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el patrocinador");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Error al crear el patrocinador",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Añadir Patrocinador</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Nombre del Patrocinador</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ingrese el nombre"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Logo del Patrocinador</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="flex flex-col items-center">
                {previewUrl ? (
                  <div className="relative group">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-40 w-40 object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, file: null }));
                          setPreviewUrl("");
                        }}
                        className="text-white hover:text-red-400"
                      >
                        Cambiar imagen
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="w-full cursor-pointer">
                    <div className="flex flex-col items-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Click para subir o arrastrar imagen
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG (max. 5MB)
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}