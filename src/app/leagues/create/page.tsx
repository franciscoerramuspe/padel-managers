'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TableIcon } from 'lucide-react';
import Header from '@/components/Header';
import { LeagueBasicInfo } from '@/components/Leagues/create/LeagueBasicInfo';
import { LeagueScheduleInfo } from '@/components/Leagues/create/LeagueScheduleInfo';

const CATEGORIES = ['4ta', '5ta', '6ta', '7ta', 'Femenino A', 'Femenino B'];
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

export default function CreateLeaguePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    start_date: '',
    max_teams: 8,
    schedule: '',
    frequency: 'Quincenal',
    days_of_week: [],
    time_slots: ['22:30', '23:15', '00:00'],
    duration_months: 4
  });

  const handleFirstStep = (data: typeof formData) => {
    setFormData(data);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleCreateLeague = async () => {
    // TODO: Integrar con backend
    console.log('League data:', formData);
    router.push('/leagues');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <Header 
          title="Crear Nueva Liga"
          icon={<TableIcon className="w-6 h-6 text-foreground dark:text-foreground" />}
          description="Configure los detalles de su nueva liga."
        />
        
        <div className="mt-8">
          <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700">
            {step === 1 ? (
              <LeagueBasicInfo
                formData={formData}
                setFormData={setFormData}
                categories={CATEGORIES}
                onSubmit={handleFirstStep}
              />
            ) : (
              <LeagueScheduleInfo
                formData={formData}
                setFormData={setFormData}
                days={DAYS}
                onSubmit={handleCreateLeague}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 