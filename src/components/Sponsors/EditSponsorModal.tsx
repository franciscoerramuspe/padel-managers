"use client";

import { useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
}

interface EditSponsorModalProps {
  sponsor: Sponsor | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}

export default function EditSponsorModal({ 
  sponsor, 
  isOpen, 
  onClose, 
  onUpdate 
}: EditSponsorModalProps) {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(sponsor?.logo_url || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sponsor) {
      setName(sponsor.name);
      setPreviewUrl(sponsor.logo_url);
    }
  }, [sponsor]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("La imagen no debe superar los 5MB");
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsor) return;
    
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (file) {
        formData.append("file", file);
      }

      await onUpdate(sponsor.id, formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el patrocinador");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Patrocinador</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Patrocinador</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del patrocinador"
              required
            />
          </div>

          <div>
            <Label>Logo del Patrocinador</Label>
            <div className="mt-2 mb-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <ImageIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-800">
                    Recomendación para la imagen
                  </h4>
                  <ul className="mt-1 text-sm text-blue-700 space-y-1">
                    <li>• Tamaño recomendado: 1920 x 1080 píxeles</li>
                    <li>• Formato: PNG o JPG</li>
                    <li>• Máximo 5MB</li>
                  </ul>
                  <p className="mt-2 text-sm text-blue-600">
                    Usar estas dimensiones asegurará que tu logo se vea perfectamente en el banner del cliente.
                  </p>
                </div>
              </div>
            </div>

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
                          setFile(null);
                          setPreviewUrl(sponsor?.logo_url || "");
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

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 