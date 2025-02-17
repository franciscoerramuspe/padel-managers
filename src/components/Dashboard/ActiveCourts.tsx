import Image from 'next/image';
import Link from 'next/link';

interface Court {
  id: string;
  name: string;
  photo_url: string;
}

interface ActiveCourtsProps {
  courts: Court[];
}

export const ActiveCourts = ({ courts }: ActiveCourtsProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Canchas</h2>
        <Link 
          href="/courts" 
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Ver todas
        </Link>
      </div>
      
      <div className="space-y-4">
        {courts.slice(0, 5).map((court) => (
          <div 
            key={court.id}
            className="flex items-center space-x-4"
          >
            <div className="relative w-10 h-10">
              <Image
                src={court.photo_url || '/assets/default-court.jpg'}
                alt={court.name}
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{court.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 