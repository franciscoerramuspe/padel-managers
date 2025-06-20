const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const CITY = 'Montevideo,UY';

export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

export async function getWeather(): Promise<WeatherData> {
  if (!WEATHER_API_KEY) {
    console.error('OpenWeather API key is not defined');
    throw new Error('API key not configured');
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${WEATHER_API_KEY}&lang=es`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Weather API error:', errorData);
      throw new Error(`Error ${response.status}: ${errorData.message}`);
    }

    const data = await response.json();
    
    return {
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    // Retornar datos fallback en caso de error
    return {
      temp: 24,
      humidity: 65,
      windSpeed: 12,
      description: 'información no disponible',
      icon: '01d',
    };
  }
} 