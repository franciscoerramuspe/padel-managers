'use client';

import React, { useState } from 'react';
import Step1 from '@/components/AddCourtComponents/Step1';
import Step2 from '@/components/AddCourtComponents/Step2';
import Step3 from '@/components/AddCourtComponents/Step3';
import Link from 'next/link';

interface CourtData {
  name: string;
  type: string;
  isCovered: boolean;
  image: File | null;
  availableTimeSlots: string[];
  subType: string;
}

export default function AddNewCourtPage() {
  const [step, setStep] = useState(1);
  const [courtData, setCourtData] = useState<CourtData>({
    name: '',
    type: 'padel',
    isCovered: false,
    image: null,
    availableTimeSlots: [],
  });

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Submitting court data:', courtData);
    // Redirect to courts page or show success message
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto bg-blue-600 rounded-lg shadow-lg p-6">
        <Link href="/courts" className="text-white hover:text-white mb-4 inline-block">
          ← Volver a canchas
        </Link>
        <h1 className="text-3xl font-bold text-white mb-6">Añadir nueva cancha</h1>
        
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= i ? 'bg-white text-blue-600 font-semibold' : 'bg-white text-blue-600 font-semibold'
                }`}
              >
                {i}
              </div>
            ))}
          </div>
          <div className="h-2 bg-white mt-4 rounded-full">
            <div
              className="h-full bg-green-600 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {step === 1 && (
          <Step1
            courtData={courtData}
            setCourtData={setCourtData}
            onNext={handleNext}
          />
        )}
        {step === 2 && (
          <Step2
            courtData={courtData}
            setCourtData={setCourtData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {step === 3 && (
          <Step3
            courtData={courtData}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
          />
        )}
      </div>
    </div>
  );
}