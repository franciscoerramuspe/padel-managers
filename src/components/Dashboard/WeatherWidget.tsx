"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Wind, Droplets, MapPin } from 'lucide-react';
import { getWeather, WeatherData } from '@/services/weather';
import { motion } from 'framer-motion';

// Definimos un enum o tipo para los diferentes climas
type WeatherType = 'sunny' | 'partlyCloudy' | 'rainy' | 'thunderstorm';
type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

// Función auxiliar para determinar qué imagen mostrar según el clima
function getWeatherImage(weatherType: WeatherType) {
  const images = {
    sunny: '/assets/sol.png',
    partlyCloudy: '/assets/solnube.png',
    rainy: '/assets/lluvia.png',
    thunderstorm: '/assets/lluviaelectrica.png'
  };

  return images[weatherType];
}

function getWeatherType(description: string): WeatherType {
  const description_lower = description.toLowerCase();
  
  if (description_lower.includes('tormenta') || description_lower.includes('thunder')) {
    return 'thunderstorm';
  }
  if (description_lower.includes('lluvia') || description_lower.includes('rain')) {
    return 'rainy';
  }
  if (description_lower.includes('nube') || description_lower.includes('cloud')) {
    return 'partlyCloudy';
  }
  return 'sunny';
}

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'night';
}

function getBackgroundStyle(timeOfDay: TimeOfDay) {
  const gradients = {
    morning: 'from-amber-100 via-sky-100 to-sky-200',
    day: 'from-sky-200 via-blue-100 to-blue-200',
    evening: 'from-orange-200 via-pink-100 to-purple-200',
    night: 'from-gray-800 via-gray-900 to-slate-900',
  };
  return gradients[timeOfDay];
}

function getTextColor(timeOfDay: TimeOfDay): string {
  return timeOfDay === 'night' ? 'text-gray-100' : 'text-gray-700';
}

function getTimeDescription(timeOfDay: TimeOfDay): string {
  const descriptions = {
    morning: 'Mañana',
    day: 'Mediodía',
    evening: 'Tarde',
    night: 'Noche',
  };
  return descriptions[timeOfDay];
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await getWeather();
        console.log('Weather data:', data);
        setWeather(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Error al cargar el clima');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Actualizar cada 30 minutos
    const weatherInterval = setInterval(fetchWeather, 30 * 60 * 1000);

    // Actualizar la hora del día cada minuto
    const timeInterval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60 * 1000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(timeInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse space-y-2">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Información no disponible
        </p>
      </div>
    );
  }

  const weatherType = getWeatherType(weather.description);
  const gradient = getBackgroundStyle(timeOfDay);
  const isNight = timeOfDay === 'night';
  const textColor = getTextColor(timeOfDay);
  const subTextColor = isNight ? 'text-gray-300' : 'text-gray-600';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`h-full w-full rounded-2xl bg-gradient-to-br ${gradient} p-6 relative overflow-hidden`}
    >
      {/* Overlay circular gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <span className={`text-sm font-medium ${textColor} flex items-center`}>
              <MapPin className="w-3.5 h-3.5 mr-1" />
              Montevideo, Uruguay.
            </span>
            <span className={`text-sm font-medium ${textColor}`}>
              {getTimeDescription(timeOfDay)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <Image
                src={getWeatherImage(weatherType)}
                alt={`Clima: ${weather.description}`}
                width={56}
                height={56}
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <div>
              <div className={`text-4xl font-bold ${textColor} tracking-tight`}>
                {weather.temp}°C
              </div>
              <p className={`text-sm font-medium ${subTextColor} capitalize`}>
                {weather.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <div className={`flex items-center text-sm ${textColor}`}>
            <span className="text-xs mr-2">Humedad</span>
            <Droplets className="h-3.5 w-3.5 text-blue-600 mr-1" />
            {weather.humidity}%
          </div>
          <div className={`flex items-center text-sm ${textColor}`}>
            <span className="text-xs mr-2">Viento</span>
            <Wind className="h-3.5 w-3.5 text-blue-600 mr-1" />
            {weather.windSpeed} km/h
          </div>
        </div>
      </div>
    </motion.div>
  );
} 