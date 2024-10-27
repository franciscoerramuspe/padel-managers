import React from 'react';

interface Step2Props {
  courtData: {
    availableTimeSlots: string[];
    prices: { [key: number]: number };
  };
  setCourtData: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  onPrevious: () => void;
}

const Step2: React.FC<Step2Props> = ({ courtData, setCourtData, onNext, onPrevious }) => {
  const timeSlots = [
    '08:00 - 09:30', '09:30 - 11:00', '11:00 - 12:30', '12:30 - 14:00',
    '14:00 - 15:30', '15:30 - 17:00', '17:00 - 18:30', '18:30 - 20:00',
    '20:00 - 21:30', '21:30 - 23:00'
  ];

  return (
    <div className="space-y-4">
      <div className="border-2 border-white rounded-lg p-4">
        <label className="block text-lg font-semibold text-white mb-2">Horarios disponibles</label>
        <p className="text-sm text-white mb-2">Selecciona los horarios disponibles para la cancha.</p>
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((slot) => (
            <label key={slot} className="inline-flex items-center font-semibold bg-white p-2 rounded-md hover:bg-green-600 transition-colors">
              <input
                type="checkbox"
                value={slot}
                checked={courtData.availableTimeSlots.includes(slot)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCourtData({
                      ...courtData,
                      availableTimeSlots: [...courtData.availableTimeSlots, slot]
                    });
                  } else {
                    setCourtData({
                      ...courtData,
                      availableTimeSlots: courtData.availableTimeSlots.filter(s => s !== slot)
                    });
                  }
                }}
                className="form-checkbox h-4 w-4 text-green-600"
              />
              <span className="ml-2 text-sm text-black">{slot}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mt-6 border-2 border-white rounded-lg p-4">
        <label className="block text-lg font-semibold text-white mb-2">Precios por duración</label>
        <p className="text-sm text-white mb-2">Establece los precios para diferentes duraciones de reserva.</p>
        <div className="grid grid-cols-2 gap-4">
          {[1, 1.5, 2, 2.5, 3, 3.5].map((duration) => (
            <div key={duration} className="flex items-center">
              <span className="text-white text-sm font-semibold mr-2">{duration} hora{duration > 1 ? 's' : ''}</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={courtData.prices[duration] || ''}
                  onChange={(e) => {
                    const newPrices = { ...courtData.prices, [duration]: parseFloat(e.target.value) || 0 };
                    setCourtData({ ...courtData, prices: newPrices });
                  }}
                  className="w-full border border-gray-300 text-sm rounded-md px-3 py-2 pl-6 text-black"
                  placeholder="Precio"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="bg-orange-500 text-white py-2 font-semibold px-4 rounded-md hover:bg-orange-400 transition-colors"
        >
          Anterior
        </button>
        <button
          onClick={onNext}
          className="bg-blue-500 text-white py-2 px-4 font-semibold rounded-md hover:bg-blue-400 transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Step2;
