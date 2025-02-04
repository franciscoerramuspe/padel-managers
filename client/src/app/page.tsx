"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen";

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.user?.user_metadata?.role === 'admin') {
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminToken', data.session.access_token);
          localStorage.setItem('userName', data.user.user_metadata.first_name);
        }
        
        // Agregamos un pequeño delay para mostrar la animación
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push("/dashboard");
      } else {
        console.error('Error signing in:', response.statusText);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if we have a valid token
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Verify token validity with backend
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        if (response.ok) {
          router.push("/dashboard");
        } else {
          // If token is invalid, clear it
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdmin');
        }
      }).catch(() => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdmin');
      });
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', formData);
  };

  return (
    <div className="min-h-screen relative">
      {isLoading && <LoadingScreen />}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/intro.mp4" type="video/mp4" />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-900/40"></div>
      </div>

      {/* Content Container */}
      <div className="relative min-h-screen flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-8 bg-white/5 md:bg-slate-50">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold md:text-gray-800 text-white mb-8">¡Bienvenido!</h3>
              <p className="text-white md:text-gray-800 mb-8">Por favor, inicia sesión en tu cuenta.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium md:text-gray-800 text-white mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg text-sm text-gray-600 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ingresa tu correo electrónico"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium md:text-gray-800 text-white mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-sm border text-gray-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                onClick={handleLoginSubmit}
              >
                Iniciar sesión
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-blue-500 rounded-md text-white">O continúa con</span>
              </div>
            </div>


            <p className="text-center text-sm md:text-gray-800 text-white mt-8">
              ¿Tienes alguna consulta?
              <br />
              <a href="" className="font-medium md:text-blue-600 text-white font-bold hover:text-blue-500">
                Contactate con soporte.
              </a>
            </p>
          </div>
        </div>

        {/* Right Content - Hidden on mobile */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center">
          <div className="relative z-10 flex flex-col justify-center items-center p-8 w-full">
            <div className="text-center text-white max-w-lg mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
                <div className="relative w-32 h-32 mx-auto mb-8 bg-white rounded-full p-2 shadow-lg ring-4 ring-white/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white rounded-full"></div>
                  <Image
                    src="/assets/recrealogo.jpeg"
                    alt="Recrea Padel Club"
                    fill
                    className="object-contain p-2 rounded-full relative z-10"
                    style={{ 
                      objectFit: 'contain',
                      background: 'white',
                    }}
                  />
                </div>
                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Gestiona tu club de pádel
                </h1>
                <p className="text-lg mb-4 text-white/90">
                  Sistema integral para la gestión de canchas, reservas, usuarios y creación de torneos para tu club deportivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
