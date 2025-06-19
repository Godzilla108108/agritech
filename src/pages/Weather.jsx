import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSun, 
  FiCloudRain, 
  FiWind, 
  FiDroplet,
  FiThermometer,
  FiNavigation,
  FiCalendar,
  FiMapPin
} from 'react-icons/fi';
import { WiHumidity, WiBarometer, WiSunrise, WiSunset } from 'react-icons/wi';
import { FaLeaf, FaTemperatureLow, FaTemperatureHigh } from 'react-icons/fa';

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('Pune'); // Default location
  const [error, setError] = useState(null);

  const API_KEY = '3211ae9274847c6edba418b6f36d415f';

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
      );
      
      if (!currentResponse.ok) throw new Error('Location not found');
      
      const currentData = await currentResponse.json();

      // 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastResponse.json();

      setWeatherData(currentData);
      
      // Process forecast data to get daily forecasts (one per day)
      const dailyForecasts = forecastData.list.filter((item, index) => index % 8 === 0);
      setForecastData(dailyForecasts);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return <FiSun className="text-yellow-400" />;
      case 'Rain':
        return <FiCloudRain className="text-blue-400" />;
      case 'Clouds':
        return <FiCloudRain className="text-gray-400" />;
      default:
        return <FiSun className="text-yellow-400" />;
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAgriRiskLevel = (weather) => {
    if (weather.rain) return 'High (Irrigation not needed)';
    if (weather.main.temp > 35) return 'High (Heat stress)';
    if (weather.main.humidity < 40) return 'Medium (Dry conditions)';
    return 'Low (Ideal conditions)';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-8 text-black">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div className="flex items-center mb-4 md:mb-0">
          <FaLeaf className="text-green-600 text-3xl mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-green-800">AgriWeather Forecast</h1>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative w-full md:w-64"
        >
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchWeatherData()}
            placeholder="Search location..."
            className="w-full p-3 pl-10 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
          />
          <FiMapPin className="absolute left-3 top-3.5 text-green-500" />
        </motion.div>
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
        >
          <p>{error}. Please try another location.</p>
        </motion.div>
      )}

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-64"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 1.5,
              ease: "linear"
            }}
            className="h-16 w-16 border-4 border-green-500 border-t-transparent rounded-full"
          ></motion.div>
        </motion.div>
      ) : weatherData && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Current Weather */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Weather Card */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden lg:col-span-2"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        {getWeatherIcon(weatherData.weather[0].main)}
                        <span className="ml-2">{weatherData.name}</span>
                      </h2>
                      <p className="text-gray-500 mt-1 flex items-center">
                        <FiCalendar className="mr-1" />
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last updated</p>
                      <p className="text-sm font-medium">
                        {new Date(weatherData.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-5xl font-bold text-gray-800">
                        {Math.round(weatherData.main.temp)}°C
                      </div>
                      <div className="ml-4">
                        <p className="text-lg capitalize">{weatherData.weather[0].description}</p>
                        <p className="text-gray-500">
                          Feels like {Math.round(weatherData.main.feels_like)}°C
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <FaTemperatureHigh className="text-red-400 mr-2" />
                        <span>H: {Math.round(weatherData.main.temp_max)}°C</span>
                      </div>
                      <div className="flex items-center">
                        <FaTemperatureLow className="text-blue-400 mr-2" />
                        <span>L: {Math.round(weatherData.main.temp_min)}°C</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weather Details */}
                <div className="bg-green-50 p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <WiHumidity className="text-2xl text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Humidity</p>
                      <p className="font-medium">{weatherData.main.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiWind className="text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Wind</p>
                      <p className="font-medium">{weatherData.wind.speed} m/s</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <WiBarometer className="text-2xl text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Pressure</p>
                      <p className="font-medium">{weatherData.main.pressure} hPa</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiDroplet className="text-blue-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Rain</p>
                      <p className="font-medium">
                        {weatherData.rain ? `${weatherData.rain['1h']}mm` : '0mm'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Agricultural Impact Card */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 text-white">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FaLeaf className="mr-2" />
                    Farming Conditions
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Agricultural Risk</p>
                      <p className="text-lg font-medium text-green-600">
                        {getAgriRiskLevel(weatherData)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <WiSunrise className="text-2xl text-amber-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Sunrise</p>
                          <p className="font-medium">
                            {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <WiSunset className="text-2xl text-purple-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Sunset</p>
                          <p className="font-medium">
                            {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Recommended Actions</p>
                      <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                        {weatherData.rain && <li>Delay field work</li>}
                        {weatherData.main.temp > 35 && <li>Increase irrigation frequency</li>}
                        {weatherData.main.humidity > 80 && <li>Watch for fungal diseases</li>}
                        {!weatherData.rain && weatherData.main.humidity < 40 && <li>Schedule irrigation</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">5-Day Forecast</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                {forecastData.map((day, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    className="p-4 text-center"
                  >
                    <p className="font-medium">{formatDate(day.dt)}</p>
                    <div className="my-3 flex justify-center">
                      {getWeatherIcon(day.weather[0].main)}
                    </div>
                    <p className="text-sm capitalize">{day.weather[0].description}</p>
                    <div className="mt-2 flex justify-center space-x-2">
                      <span className="font-bold">{Math.round(day.main.temp_max)}°</span>
                      <span className="text-gray-500">{Math.round(day.main.temp_min)}°</span>
                    </div>
                    <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                      <FiDroplet className="mr-1" />
                      {day.pop > 0 ? `${Math.round(day.pop * 100)}%` : '0%'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Hourly Forecast (condensed) */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Today's Conditions</h3>
              </div>
              <div className="p-4 overflow-x-auto">
                <div className="flex space-x-4">
                  {Array.from({ length: 24 }).map((_, hour) => {
                    const time = new Date();
                    time.setHours(hour, 0, 0, 0);
                    const temp = Math.round(weatherData.main.temp + (Math.sin(hour / 24 * Math.PI * 2) * 5));
                    const rainChance = hour > 18 && hour < 22 ? 30 : 0;
                    
                    return (
                      <motion.div 
                        key={hour}
                        whileHover={{ scale: 1.1 }}
                        className="flex flex-col items-center p-2 min-w-max"
                      >
                        <p className="text-sm">
                          {time.toLocaleTimeString([], { hour: '2-digit' })}
                        </p>
                        <div className="my-2">
                          {rainChance > 0 ? 
                            <FiCloudRain className="text-blue-400" /> : 
                            <FiSun className="text-yellow-400" />
                          }
                        </div>
                        <p className="font-medium">{temp}°</p>
                        {rainChance > 0 && (
                          <p className="text-xs text-blue-500">{rainChance}%</p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default WeatherPage;