"use client";

import { useState } from "react";
import { X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSponsors } from "@/hooks/useSponsors";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function AddSponsorModal({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        <DialogTitle className="text-gray-900 dark:text-white">Añadir Patrocinador</DialogTitle>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nombre del Patrocinador</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ingrese el nombre"
              className="mt-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            />
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-300">Logo del Patrocinador</Label>
            <div className="mt-2 mb-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <ImageIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Recomendación para la imagen
                  </h4>
                  <ul className="mt-1 text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• Tamaño recomendado: 1920 x 1080 píxeles</li>
                    <li>• Formato: PNG o JPG</li>
                    <li>• Máximo 5MB</li>
                  </ul>
                  <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                    Usar estas dimensiones asegurará que tu logo se vea perfectamente en el banner del cliente.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
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
                      <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Click para subir o arrastrar imagen
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
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
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">{error}</p>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}