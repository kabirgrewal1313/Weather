import { Cloud, Sun, Moon } from "lucide-react";

interface WeatherBackgroundProps {
  weatherType: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

const WeatherBackground = ({ weatherType }: WeatherBackgroundProps) => {
  const getBackgroundClass = () => {
    switch (weatherType) {
      case 'sunny':
        return 'weather-sunny';
      case 'rainy':
        return 'weather-rainy';
      case 'night':
        return 'weather-night';
      default:
        return 'weather-cloudy';
    }
  };

  const renderAnimations = () => {
    switch (weatherType) {
      case 'sunny':
        return (
          <>
            <Sun className="absolute top-16 right-16 w-24 h-24 text-sky-200 sun-glow opacity-80" />
            <Cloud className="absolute top-32 left-16 w-20 h-20 text-white/40 cloud-float" />
            <Cloud className="absolute bottom-40 right-32 w-16 h-16 text-white/30 cloud-float" style={{ animationDelay: '3s' }} />
          </>
        );
      
      case 'cloudy':
        return (
          <>
            <Cloud className="absolute top-20 left-20 w-32 h-32 text-white/40 cloud-float" />
            <Cloud className="absolute top-16 right-24 w-24 h-24 text-white/30 cloud-float" style={{ animationDelay: '2s' }} />
            <Cloud className="absolute bottom-32 left-32 w-20 h-20 text-white/25 cloud-float" style={{ animationDelay: '4s' }} />
            <Cloud className="absolute bottom-40 right-40 w-28 h-28 text-white/35 cloud-float" style={{ animationDelay: '1s' }} />
          </>
        );
      
      case 'rainy':
        return (
          <>
            <Cloud className="absolute top-20 left-20 w-32 h-32 text-gray-300/60 cloud-float" />
            <Cloud className="absolute top-24 right-20 w-24 h-24 text-gray-300/50 cloud-float" style={{ animationDelay: '2s' }} />
            {/* Rain drops */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-4 bg-blue-200/60 rain-drop"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1.5 + Math.random()}s`
                }}
              />
            ))}
          </>
        );
      
      case 'night':
        return (
          <>
            <Moon className="absolute top-16 right-16 w-20 h-20 text-blue-200 opacity-80" />
            <Cloud className="absolute top-32 left-16 w-24 h-24 text-purple-200/30 cloud-float" />
            {/* Stars */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                  animation: `twinkle ${2 + Math.random() * 3}s infinite`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <div className={`fixed inset-0 ${getBackgroundClass()} transition-all duration-1000`} />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {renderAnimations()}
      </div>
      
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </>
  );
};

export default WeatherBackground;