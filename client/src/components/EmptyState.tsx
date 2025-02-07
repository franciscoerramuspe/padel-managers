import Image from 'next/image';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <div className="relative w-64 h-64 mb-6">
        <Image
          src="/assets/court_padel.png"
          alt="No courts found"
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No hay canchas ingresadas aún
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Parece que aún no has agregado ninguna cancha. <br /> 
        Comienza agregando tu primera cancha para gestionar las canchas en los torneos.
      </p>
    </div>
  );
}