'use client';

import React, { useState } from 'react';
import Step1 from '@/components/AddCourtComponents/Step1';
import Step2 from '@/components/AddCourtComponents/Step2';
import Step3 from '@/components/AddCourtComponents/Step3';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface CourtData {
  name: string;
  type: string;
  isCovered: boolean;
  image: File | null;
  availableTimeSlots: string[];
  prices: { [key: number]: number };
  subType: string;
}

const uploadImage = async (file: File) => {
  try {
    const { data, error } = await supabase.storage
      .from('court-images')
      .upload(`courts/${Date.now()}-${file.name}`, file);

    if (error) throw error;
    
    // Get public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('court-images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return '';
  }
};

export default function AddNewCourtPage() {
  const [step, setStep] = useState(1);
  const [courtData, setCourtData] = useState<CourtData>({
    name: '',
    type: 'padel',
    isCovered: false,
    image: null,
    availableTimeSlots: [],
    prices: {},
  });

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/courts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: courtData.name,
          type: courtData.type,
          isCovered: courtData.isCovered,
          court_size: courtData.court_size, // Add default value
          hourly_rate: courtData.hourly_rate || 0,        // Add default value
          image: courtData.image ? await uploadImage(courtData.image) : '',
        }),
      });

      if (!response.ok) throw new Error('Failed to create court');
      
      // Redirect to courts page after successful creation
      window.location.href = '/courts';
    } catch (error) {
      console.error('Error creating court:', error);
    }
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
