import React from 'react';
import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';

interface Step3Props {
  courtData: {
    name: string;
    type: string;
    isCovered: boolean;
    image: File | null;
    availableTimeSlots: string[];
    prices: { [key: number]: number };
  };
  onSubmit: () => void;
  onPrevious: () => void;
}

const Step3: React.FC<Step3Props> = ({ courtData, onSubmit, onPrevious }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Resumen de la cancha</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 pr-4 ">
            {courtData.image && (
              <div className="mb-2">
                <Image
                  src={URL.createObjectURL(courtData.image)}
                  alt="Court preview"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{courtData.name}</h3>
            <p className="text-black mb-2">
              <span className="font-semibold">Tipo:</span> {courtData.type}
            </p>
            <p className="text-black mb-2">
              <span className="font-semibold">¿Es una cancha cubierta?:</span> {courtData.isCovered ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="md:w-1/2">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Horarios disponibles:</h4>
            <ul className="grid grid-cols-2 gap-2">
              {courtData.availableTimeSlots.map((slot) => (
                <li key={slot} className="flex items-center text-gray-600">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {slot}
                </li>
              ))}
            </ul>
          </div>
          
        </div>
        
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
      <div>
        <h4 className="text-xl font-semibold text-black mb-2">Precios:</h4>
        <ul className="grid grid-cols-2 gap-2">
          {Object.entries(courtData.prices).map(([duration, price]) => (
            <li key={duration} className="flex items-center justify-between text-black">
              <span>{duration} hora{parseFloat(duration) > 1 ? 's' : ''}</span>
              <span className="font-semibold text-green-600">${price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

        
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          className="bg-orange-500 text-white py-2 px-4 font-semibold rounded-md hover:bg-orange-500 transition-colors"
        >
          Anterior
        </button>
        <button
          onClick={onSubmit}
          className="bg-green-600 text-white py-2 px-6 font-semibold rounded-md hover:bg-green-600 transition-colors"
        >
          Confirmar y crear cancha
        </button>
      </div>
    </div>
  );
};

export default Step3;
