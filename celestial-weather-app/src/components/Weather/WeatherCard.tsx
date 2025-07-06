import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Cloud, Sun, Moon } from "lucide-react";

interface WeatherData {
  city: string;
  country: string;
  coordinates: { lat: number; lon: number };
  current_weather: {
    temperature: number;
    description: string;
    humidity: number;
    wind_speed: number;
  };
}

interface WeatherCardProps {
  weatherData: WeatherData;
}

const WeatherCard = ({ weatherData }: WeatherCardProps) => {
  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('sun') || desc.includes('clear')) {
      return <Sun className="w-16 h-16 text-sky-200 sun-glow" />;
    }
    if (desc.includes('cloud')) {
      return <Cloud className="w-16 h-16 text-white/80 cloud-float" />;
    }
    if (desc.includes('rain') || desc.includes('drizzle')) {
      return <Cloud className="w-16 h-16 text-blue-300" />;
    }
    if (desc.includes('night')) {
      return <Moon className="w-16 h-16 text-blue-200" />;
    }
    return <Cloud className="w-16 h-16 text-white/80" />;
  };

  return (
    <Card className="glass-card border-white/20 fade-in">
      <CardHeader>
        <CardTitle className="text-white text-xl">
          {weatherData.city}, {weatherData.country}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Weather Display */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {getWeatherIcon(weatherData.current_weather.description)}
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            {Math.round(weatherData.current_weather.temperature)}°C
          </div>
          <div className="text-white/80 text-lg capitalize">
            {weatherData.current_weather.description}
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-white/60 text-sm">Humidity</div>
            <div className="text-white text-lg font-semibold">
              {weatherData.current_weather.humidity}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-white/60 text-sm">Wind Speed</div>
            <div className="text-white text-lg font-semibold">
              {weatherData.current_weather.wind_speed} m/s
            </div>
          </div>
        </div>

        {/* Coordinates */}
        <div className="text-center pt-4 border-t border-white/20">
          <div className="text-white/60 text-sm">Coordinates</div>
          <div className="text-white text-sm">
            {weatherData.coordinates.lat.toFixed(2)}°, {weatherData.coordinates.lon.toFixed(2)}°
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;