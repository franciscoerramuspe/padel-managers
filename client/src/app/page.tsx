"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import GoogleButton from "../components/GoogleButton";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', formData);
  };

  return (
    <div className="min-h-screen relative">
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

            <GoogleButton className="w-full py-3 text-base bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors duration-300 shadow-sm rounded-lg" />

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
             
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
                <Image
                  src="/assets/logo_padel_manager.png"
                  alt="Tercer Tiempo"
                  width={300}
                  height={300}
                  className="mx-auto mb-12"
                />
                 <h1 className="text-3xl font-bold mb-6">Gestiona tu club de pádel</h1>
                <p className="text-lg mb-4">
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
