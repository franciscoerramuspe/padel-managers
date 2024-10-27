import React from 'react';

interface Step2Props {
  courtData: {
    availableTimeSlots: string[];
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
    <div className="space-y-6">
      <div>
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