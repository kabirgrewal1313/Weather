import { useState, useEffect } from "react";
import AuthPage from "./Auth/AuthPage";
import WeatherDashboard from "./Weather/WeatherDashboard";

const WeatherApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has a valid token
    const token = localStorage.getItem('weatherAppToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (token: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen weather-cloudy flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <WeatherDashboard onLogout={handleLogout} />
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
};

export default WeatherApp;