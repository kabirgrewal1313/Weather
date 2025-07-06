import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, LogOut, Thermometer, Cloud, Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import WeatherCard from "./WeatherCard";
import ForecastList from "./ForecastList";
import WeatherBackground from "./WeatherBackground";

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
  forecast: Array<{
    datetime: string;
    temp: number;
    description: string;
  }>;
}

interface WeatherDashboardProps {
  onLogout: () => void;
}

const WeatherDashboard = ({ onLogout }: WeatherDashboardProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [plotUrl, setPlotUrl] = useState<string>("");
  const { toast } = useToast();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('weatherAppToken');
    return {
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchWeatherData = async (searchCity: string) => {
    if (!searchCity.trim()) {
      toast({
        title: "Error",
        description: "Please enter a city name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/weather?city=${encodeURIComponent(searchCity)}`,
        { headers: getAuthHeaders() }
      );

      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        
        // Fetch temperature plot
        const plotResponse = await fetch(
          `http://127.0.0.1:8000/weather/plot?city=${encodeURIComponent(searchCity)}`,
          { headers: getAuthHeaders() }
        );
        
        if (plotResponse.ok) {
          const plotBlob = await plotResponse.blob();
          const plotUrl = URL.createObjectURL(plotBlob);
          setPlotUrl(plotUrl);
        }

        toast({
          title: "Success",
          description: `Weather data loaded for ${data.city}`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.detail || "Failed to fetch weather data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  const handleLogout = () => {
    localStorage.removeItem('weatherAppToken');
    onLogout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Load default city on mount
  useEffect(() => {
    fetchWeatherData("Delhi");
  }, []);

  const getWeatherType = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('sun') || desc.includes('clear')) return 'sunny';
    if (desc.includes('rain') || desc.includes('drizzle')) return 'rainy';
    if (desc.includes('cloud')) return 'cloudy';
    if (desc.includes('night')) return 'night';
    return 'cloudy';
  };

  const weatherType = weatherData ? getWeatherType(weatherData.current_weather.description) : 'cloudy';

  return (
    <div className="min-h-screen relative">
      <WeatherBackground weatherType={weatherType} />
      
      <div className="relative z-10 p-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Cloud className="w-8 h-8" />
            Weather Dashboard
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="glass-card text-white border-white/20 hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 max-w-md">
            <Input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="glass-card text-white placeholder:text-white/70 border-white/20"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="glass-card hover:bg-white/20 text-white"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* Weather Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-lg">Loading weather data...</div>
          </div>
        ) : weatherData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Weather */}
            <div className="lg:col-span-1">
              <WeatherCard weatherData={weatherData} />
            </div>

            {/* Forecasts and Chart */}
            <div className="lg:col-span-2 space-y-6">
              {/* Temperature Chart */}
              {plotUrl && (
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Thermometer className="w-5 h-5" />
                      Temperature Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={plotUrl}
                      alt="Temperature Chart"
                      className="w-full h-auto rounded-lg"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Forecast */}
              <ForecastList forecast={weatherData.forecast} />
            </div>
          </div>
        ) : (
          <div className="text-center text-white/80">
            <p className="text-lg">Search for a city to see weather information</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;