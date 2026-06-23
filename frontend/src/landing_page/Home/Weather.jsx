import React, { useState, useEffect } from "react";
import { makeAuthenticatedRequest } from "../../firebase/api";

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const getWeatherIcon = (code) => {
  // Map weather codes to our icons
  if (code >= 200 && code < 300) return CloudRainIcon; // Thunderstorm
  if (code >= 300 && code < 400) return CloudRainIcon; // Drizzle
  if (code >= 500 && code < 600) return CloudRainIcon; // Rain
  if (code >= 600 && code < 700) return CloudRainIcon; // Snow
  if (code >= 700 && code < 800) return CloudIcon; // Atmosphere
  if (code === 800) return SunIcon; // Clear
  return CloudIcon; // Clouds
};

const formatTime = (timestamp) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(new Date(timestamp * 1000));
};

const formatDay = (timestamp) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short'
  }).format(new Date(timestamp * 1000));
};

const SunIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const CloudIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>;
const CloudRainIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"></path><path d="M16 14v6"></path><path d="M8 14v6"></path><path d="M12 16v6"></path></svg>;
const WindIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>;
const SunriseIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="2" x2="12" y2="9"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="8 6 12 2 16 6"></polyline></svg>;
const ThermometerIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>;
const DropletsIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.7-3.3C8.27 7.81 7 6.23 7 4.5c0-1.1.9-2 2-2s2 .9 2 2c0 1.73-1.27 3.31-2.3 4.45-1.13 1.04-1.7 2.14-1.7 3.3z"></path><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.54 1.53 1 3.22 1 4.98 0 2.23-1.8 4.05-4 4.05-1.17 0-2.25-.5-3-1.3"></path></svg>;

const Weather = ({ location, farmId }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  const fetchWeather = async () => {
    if (!coordinates) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${WEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }

      const data = await response.json();
      setWeather(data);
      setError(null);
    } catch (err) {
      setError('Failed to load weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCoordinates = async () => {
      if (!location) return;

      try {
        // Try with district and state first for better accuracy
        const searchQuery = `${location.district}, ${location.state}, India`;
        const geocodeResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery)}&limit=1&appid=${WEATHER_API_KEY}`
        );

        if (!geocodeResponse.ok) {
          throw new Error('Failed to get location coordinates');
        }

        const locationData = await geocodeResponse.json();

        if (locationData.length > 0) {
          const coords = {
            lat: locationData[0].lat,
            lon: locationData[0].lon
          };
          setCoordinates(coords);
        } else {
          // If district search fails, try with state
          const stateQuery = `${location.state}, India`;
          const stateResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(stateQuery)}&limit=1&appid=${WEATHER_API_KEY}`
          );

          if (!stateResponse.ok) {
            throw new Error('Failed to get location coordinates for state');
          }

          const stateData = await stateResponse.json();
          if (stateData.length > 0) {
            const coords = {
              lat: stateData[0].lat,
              lon: stateData[0].lon
            };
            setCoordinates(coords);
          } else {
            throw new Error('Location not found');
          }
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to get location coordinates';
        console.error('Weather Error:', errorMessage, err);
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (location) {
      getCoordinates();
    }
  }, [location]);

  useEffect(() => {
    if (coordinates) {
      fetchWeather();
    }
  }, [coordinates]);

  useEffect(() => {
    const updateFarmWeather = async () => {
      if (weather && farmId && weather.list?.length) {
        const currentWeather = weather.list[0];

        const weatherData = {
          temperature: Math.round(currentWeather.main.temp),
          condition: currentWeather.weather[0].main,
          humidity: currentWeather.main.humidity,
          windSpeed: Math.round(currentWeather.wind.speed * 3.6),
          sunrise: weather.city.sunrise
        };

        try {
          await makeAuthenticatedRequest(
            `http://localhost:5000/farms/${farmId}/weather`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(weatherData)
            }
          );
        } catch (err) {
          console.error("Failed to update weather data: ", err);
        }
      }
    };

    updateFarmWeather();
  }, [weather, farmId]);

  if (!location) return <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">Please select a farm to view weather data.</div>;
  if (loading) return <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">Loading weather data...</div>;
  if (error) return <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-red-500">{error}</div>;
  if (!weather) return null;

  // Get current weather from the first item in the list
  const currentWeather = weather.list[0];

  // Get next 5 days forecast (every 24 hours)
  const forecastDays = weather.list
    .filter((item, index) => index % 8 === 0)
    .slice(0, 5)
    .map(forecast => ({
      day: formatDay(forecast.dt),
      Icon: getWeatherIcon(forecast.weather[0].id),
      temp: `${Math.round(forecast.main.temp_max)}°/${Math.round(forecast.main.temp_min)}°`,
      color: forecast.weather[0].id === 800 ? "text-amber-500" :
        forecast.weather[0].id >= 500 && forecast.weather[0].id < 600 ? "text-blue-500" :
          "text-slate-500"
    }));

  const weatherDetails = [
    { label: "Feels Like", value: `${Math.round(currentWeather.main.feels_like)}°`, Icon: ThermometerIcon },
    { label: "Humidity", value: `${currentWeather.main.humidity}%`, Icon: DropletsIcon },
    { label: "Wind", value: `${Math.round(currentWeather.wind.speed * 3.6)} km/h`, Icon: WindIcon },
    { label: "Sunrise", value: formatTime(weather.city.sunrise), Icon: SunriseIcon },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-slate-800">{weather.city.name}, {weather.city.country}</h2>
          <p className="text-slate-500">{new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          }).format(new Date(currentWeather.dt * 1000))}</p>
          <div className="flex items-end gap-2 mt-2">
            <p className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter">
              {Math.round(currentWeather.main.temp)}°C
            </p>
            <p className="text-lg sm:text-xl font-bold text-slate-500 pb-2">
              {currentWeather.weather[0].main}
            </p>
          </div>
        </div>
        <div className="text-amber-500 mt-4 sm:mt-0">
          {React.createElement(getWeatherIcon(currentWeather.weather[0].id), {
            className: "w-24 h-24 sm:w-32 sm:h-32"
          })}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-4">5-Day Forecast</h3>
        <div className="grid grid-cols-5 gap-1 sm:gap-4">
          {forecastDays.map(({ day, Icon, temp, color }) => (
            <div key={day} className="bg-slate-50 rounded-xl p-2 sm:p-4 flex flex-col items-center justify-center text-center space-y-1 sm:space-y-2">
              <p className="font-bold text-slate-600 text-xs sm:text-base">{day}</p>
              <Icon className={`w-6 h-6 sm:w-10 sm:h-10 ${color}`} />
              <p className="font-bold text-slate-800 text-xs sm:text-base">{temp}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-4">Today's Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {weatherDetails.map(({ label, value, Icon }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500 flex items-center gap-2 mb-1"><Icon className="w-4 h-4" />{label}</p>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
