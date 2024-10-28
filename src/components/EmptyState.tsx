import Image from 'next/image';
import Link from 'next/link';

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
        Parece que aún no has agregado ninguna cancha. <br /> Comienza agregando tu primera cancha para gestionar las reservas.
      </p>
      <Link href="/add-court" passHref>
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
              clipRule="evenodd" 
            />
          </svg>
          Añadir primera cancha
        </button>
      </Link>
    </div>
  );
}