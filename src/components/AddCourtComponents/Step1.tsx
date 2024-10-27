import React, { useState } from 'react';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

interface Step1Props {
  courtData: {
    name: string;
    type: string;
    isCovered: boolean;
    image: File | null;
    subType: string;
  };
  setCourtData: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ courtData, setCourtData, onNext }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCourtData({ ...courtData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setCourtData({ ...courtData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setCourtData({ ...courtData, image: null });
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="courtName" className="block text-sm font-semibold text-white mb-1">Nombre de la cancha</label>
        <input
          type="text"
          placeholder="Introduce el nombre de la cancha"
          id="courtName"
          value={courtData.name}
          onChange={(e) => setCourtData({ ...courtData, name: e.target.value })}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-white-700 mb-2">Tipo de cancha</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="padel"
              checked={courtData.type === 'padel'}
              onChange={() => setCourtData({ ...courtData, type: 'padel', subType: '' })}
              className="form-radio text-blue-600"
            />
            <span className="ml-2 text-white">🎾 Padel</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="football"
              checked={courtData.type === 'football'}
              onChange={() => setCourtData({ ...courtData, type: 'football', subType: '' })}
              className="form-radio text-blue-600"
            />
            <span className="ml-2 text-white">⚽ Football</span>
          </label>
        </div>
      </div>

      {courtData.type === 'padel' && (
        <div>
          <label className="block text-sm font-semibold text-white-700 mb-2">Tipo de partido</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="1vs1"
                checked={courtData.subType === '1vs1'}
                onChange={() => setCourtData({ ...courtData, subType: '1vs1' })}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-white">1 vs 1</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="2vs2"
                checked={courtData.subType === '2vs2'}
                onChange={() => setCourtData({ ...courtData, subType: '2vs2' })}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-white">2 vs 2</span>
            </label>
          </div>
        </div>
      )}

      {courtData.type === 'football' && (
        <div>
          <label className="block text-sm font-semibold text-white-700 mb-2">Tipo de fútbol</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="futbol7"
                checked={courtData.subType === 'futbol7'}
                onChange={() => setCourtData({ ...courtData, subType: 'futbol7' })}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-white">Fútbol 7</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="futbol11"
                checked={courtData.subType === 'futbol11'}
                onChange={() => setCourtData({ ...courtData, subType: 'futbol11' })}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-white">Fútbol 11</span>
            </label>
          </div>
        </div>
      )}
      
      <div>
        <p className="text-sm font-semibold text-white mb-2">Selecciona si la cancha es techada o abierta.</p>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="techada"
              checked={courtData.isCovered}
              onChange={() => setCourtData({ ...courtData, isCovered: true })}
              className="form-radio text-blue-600"
            />
            <span className="ml-2 text-white">Techada</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="abierta"
              checked={!courtData.isCovered}
              onChange={() => setCourtData({ ...courtData, isCovered: false })}
              className="form-radio text-blue-600"
            />
            <span className="ml-2 text-white">Abierta</span>
          </label>
        </div>
      </div>
      
      <div>
        <label className="block text-lg font-semibold text-white mb-2">Imagen de la cancha</label>
        <p className="text-sm text-white mb-2">Sube una imagen de la cancha para que los usuarios puedan verla.</p>
        <div
          className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className="relative">
              <img src={previewUrl} alt="Court preview" className="max-h-48 rounded-md" />
              <button
                onClick={removeImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 hover:bg-red-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <div className="space-y-1 text-center">
              <FaCloudUploadAlt className="mx-auto h-12 w-12 text-white" />
              <div className="flex text-sm text-white p-2">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Subir un archivo</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                </label>
                <p className="pl-1">o arrastrar y soltar</p>
              </div>
              <p className="text-xs text-white">PNG, JPG, GIF hasta 10MB</p>
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={onNext}
        className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Step1;
