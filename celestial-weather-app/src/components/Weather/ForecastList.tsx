import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Thermometer } from "lucide-react";

interface ForecastItem {
  datetime: string;
  temp: number;
  description: string;
}

interface ForecastListProps {
  forecast: ForecastItem[];
}

const ForecastList = ({ forecast }: ForecastListProps) => {
  // Group forecast by date for 5-day view
  const groupedForecast = forecast.reduce((acc, item) => {
    const date = item.datetime.split(' ')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ForecastItem[]>);

  // Get next 24 hours for hourly forecast
  const hourlyForecast = forecast.slice(0, 8);

  // Get daily forecast (one per day)
  const dailyForecast = Object.entries(groupedForecast)
    .slice(0, 5)
    .map(([date, items]) => ({
      date,
      temp: Math.round(items.reduce((sum, item) => sum + item.temp, 0) / items.length),
      description: items[0].description,
      items
    }));

  const formatTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Hourly Forecast */}
      <Card className="glass-card border-white/20 fade-in">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Hourly Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {hourlyForecast.map((item, index) => (
              <div 
                key={index}
                className="text-center p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="text-white/60 text-sm mb-1">
                  {formatTime(item.datetime)}
                </div>
                <div className="text-white text-lg font-semibold mb-1">
                  {Math.round(item.temp)}°
                </div>
                <div className="text-white/70 text-xs capitalize">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      <Card className="glass-card border-white/20 fade-in">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            5-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dailyForecast.map((day, index) => (
              <div 
                key={day.date}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-white font-medium min-w-[80px]">
                    {index === 0 ? 'Today' : formatDate(day.date)}
                  </div>
                  <div className="text-white/70 capitalize">
                    {day.description}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-white/60" />
                  <span className="text-white font-semibold">
                    {day.temp}°C
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastList;