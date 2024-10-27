import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <h1 className="text-6xl md:text-8xl font-extrabold text-white text-center mb-12 animate-fade-in-down">
        Padel Managers
      </h1>
      <Link href="/create-user" passHref>
        <button className="bg-white text-purple-600 text-2xl font-bold py-4 px-8 rounded-full shadow-lg hover:bg-purple-100 transition duration-300 ease-in-out transform hover:scale-105 animate-bounce">
          Create User
        </button>
      </Link>
      <Link href="/dashboard" passHref>
        <button className="bg-white text-purple-600 text-2xl font-bold py-4 px-8 rounded-full shadow-lg hover:bg-purple-100 transition duration-300 ease-in-out transform hover:scale-105 mt-4">
          Dashboard
        </button>
      </Link>
    </div>
  );
}
