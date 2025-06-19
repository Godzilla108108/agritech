import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';


import { 
  FiLogOut, 
  FiTrendingUp, 
  FiDroplet, 
  FiSun, 
  FiAlertTriangle,
  FiCloudRain,
  FiWind,
  FiThermometer
} from 'react-icons/fi';
import { 
  FaLeaf, 
  FaSeedling, 
  FaChartLine, 
  FaShoppingCart,
  FaTractor,
  FaWater,
  FaTemperatureLow
} from 'react-icons/fa';
import { WiRaindrop } from 'react-icons/wi';
import { FiDollarSign } from 'react-icons/fi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weatherData, setWeatherData] = useState(null);
  const [marketTrends, setMarketTrends] = useState([]);
  const [soilData, setSoilData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'weather', message: 'Heavy rain expected in 48 hours', severity: 'high', icon: <FiCloudRain /> },
    { id: 2, type: 'market', message: 'Wheat prices up by 12% this week', severity: 'medium', icon: <FiTrendingUp /> },
    { id: 3, type: 'pest', message: 'Locust alert in neighboring districts', severity: 'critical', icon: <FaLeaf /> }
  ]);

  // Mock data fetch with realistic agricultural intervals
  useEffect(() => {
    const fetchFarmData = async () => {
      setIsLoading(true);
      
      // Simulate API calls with agricultural data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setWeatherData({
        temperature: 28.5,
        humidity: 72,
        rainfall: 18,
        windSpeed: 12,
        forecast: 'Scattered Thunderstorms',
        next24Hours: {
          temperature: [26, 27, 28, 27, 26, 25, 24, 25, 27, 28, 29, 30],
          rainfall: [0, 0, 2, 5, 8, 3, 0, 0, 0, 1, 0, 0]
        }
      });
      
      setMarketTrends([
        { crop: 'Wheat', price: 2150, change: 2.5, unit: 'quintal' },
        { crop: 'Rice', price: 1980, change: -0.8, unit: 'quintal' },
        { crop: 'Corn', price: 1850, change: 3.2, unit: 'quintal' },
        { crop: 'Soybean', price: 3450, change: 1.9, unit: 'quintal' }
      ]);
      
      setSoilData({
        moisture: 65,
        nitrogen: 42,
        phosphorus: 38,
        potassium: 55,
        ph: 6.8,
        lastTested: '3 days ago'
      });
      
      setIsLoading(false);
    };
    
    fetchFarmData();
    
    // Simulate real-time updates (every 5 minutes)
    const interval = setInterval(() => {
      fetchFarmData();
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const cropRecommendations = [
    { name: 'Wheat', suitability: 92, icon: <FaSeedling className="text-amber-500" /> },
    { name: 'Barley', suitability: 85, icon: <FaSeedling className="text-amber-400" /> },
    { name: 'Soybean', suitability: 78, icon: <FaSeedling className="text-green-500" /> },
    { name: 'Corn', suitability: 68, icon: <FaSeedling className="text-yellow-500" /> }
  ];

  const recentActivities = [
    { id: 1, action: 'Soil test completed', time: '2 hours ago', icon: <FaWater className="text-blue-500" /> },
    { id: 2, action: 'Crop health scan', time: '1 day ago', icon: <FaLeaf className="text-green-500" /> },
    { id: 3, action: 'Irrigation system activated', time: '1 day ago', icon: <FiDroplet className="text-blue-400" /> },
    { id: 4, action: 'Market analysis viewed', time: '2 days ago', icon: <FaChartLine className="text-purple-500" /> }
  ];

  // Animation variants for consistent motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const alertVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Sidebar Navigation */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="fixed inset-y-0 left-0 w-64 bg-green-800 text-white shadow-xl z-10"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="p-6 flex items-center space-x-2 cursor-pointer"
          onClick={() => setActiveTab('dashboard')}
        >
          <FaTractor className="h-8 w-8 text-green-300" />
          <h1 className="text-2xl font-bold">FarmPulse</h1>
        </motion.div>
        
        <nav className="mt-8">
         
{[
  { id: 'dashboard', icon: <FaChartLine />, label: 'Farm Dashboard' },
   { 
    id: 'prices', 
    icon: < FiDollarSign />, 
    label: 'Current Crop Rates',
    onClick: () => navigate('/prices')  // Add this line
  },
  { id: 'crops', icon: <FaSeedling />, label: 'Crop Advisor' },
  { 
    id: 'weather', 
    icon: <FiSun />, 
    label: 'Weather Station',
    onClick: () => navigate('/weather')  // Add this line
  },
  { id: 'irrigation', icon: <FiDroplet />, label: 'Irrigation' },
  { id: 'alerts', icon: <FiAlertTriangle />, label: 'Alerts' }
].map((item) => (
  <motion.button
    key={item.id}
    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center w-full px-6 py-3 text-left ${activeTab === item.id ? 'bg-green-700' : ''}`}
    onClick={item.onClick || (() => setActiveTab(item.id))}  // Modified this line
  >
    <span className="mr-3 text-lg">{item.icon}</span>
    <span className="text-lg">{item.label}</span>
  </motion.button>
))}
        </nav>
        
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="absolute bottom-0 w-full p-4 border-t border-green-700"
        >
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-2  text-white caret-black-200 hover:text-white"
          >
            <FiLogOut className="mr-2" />
            Sign Out
          </button>
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <div className="ml-64">
        {/* Top Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-sm"
        >
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'dashboard' && 'Farm Overview'}
              {activeTab === 'market' && 'Marketplace'}
              {activeTab === 'crops' && 'Crop Advisor'}
              {activeTab === 'weather' && 'Weather Station'}
              {activeTab === 'irrigation' && 'Irrigation Control'}
              {activeTab === 'alerts' && 'Farm Alerts'}
            </h2>
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 cursor-pointer"
              >
                <FiSun className="h-5 w-5" />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white cursor-pointer"
              >
                <span className="font-medium">JD</span>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-96"
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
            ) : (
              <motion.div
                key="content"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-6"
              >
                {activeTab === 'dashboard' && (
                  <>
                    {/* Weather Overview Card */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
                        <h3 className="text-lg font-semibold flex items-center">
                          <FiSun className="mr-2" />
                          Current Weather Conditions
                        </h3>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {weatherData && (
                          <>
                            <div className="space-y-4">
                              <div className="flex items-center">
                                <FiThermometer className="h-5 w-5 text-blue-500 mr-2" />
                                <div>
                                  <p className="text-sm text-gray-500">Temperature</p>
                                  <p className="text-xl font-bold">{weatherData.temperature}°C</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <WiRaindrop className="h-5 w-5 text-blue-400 mr-2" />
                                <div>
                                  <p className="text-sm text-gray-500">Humidity</p>
                                  <p className="text-xl font-bold">{weatherData.humidity}%</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center">
                                <FiCloudRain className="h-5 w-5 text-blue-500 mr-2" />
                                <div>
                                  <p className="text-sm text-gray-500">Rainfall</p>
                                  <p className="text-xl font-bold">{weatherData.rainfall}mm</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <FiWind className="h-5 w-5 text-blue-500 mr-2" />
                                <div>
                                  <p className="text-sm text-gray-500">Wind Speed</p>
                                  <p className="text-xl font-bold">{weatherData.windSpeed} km/h</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 flex flex-col justify-center">
                              <p className="text-blue-800 font-medium text-center">{weatherData.forecast}</p>
                              <p className="text-sm text-blue-600 text-center mt-1">Next 24 hours</p>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>

                    {/* Soil Health & Crop Recommendations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-4 text-white">
                          <h3 className="text-lg font-semibold flex items-center">
                            <FaWater className="mr-2" />
                            Soil Health Status
                          </h3>
                        </div>
                        <div className="p-6">
                          {soilData && (
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Moisture Level</span>
                                  <span className="text-sm text-gray-500">{soilData.moisture}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <motion.div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${soilData.moisture}%` }}
                                    transition={{ duration: 1 }}
                                  ></motion.div>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                  <p className="text-sm text-gray-500">Nitrogen</p>
                                  <p className="font-bold text-green-700">{soilData.nitrogen}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-gray-500">Phosphorus</p>
                                  <p className="font-bold text-green-700">{soilData.phosphorus}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-gray-500">Potassium</p>
                                  <p className="font-bold text-green-700">{soilData.potassium}</p>
                                </div>
                              </div>
                              <div className="pt-2 text-sm text-gray-500">
                                Last tested: {soilData.lastTested}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 text-shadow-black">
                          <h3 className="text-lg font-semibold flex items-center">
                            <FaSeedling className="mr-2" />
                            Recommended Crops
                          </h3>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {cropRecommendations.map((crop, index) => (
                              <motion.div 
                                key={index}
                                whileHover={{ scale: 1.01 }}
                                className="p-3 hover:bg-green-50 rounded-lg transition"
                              >
                                <div className="flex items-center">
                                  {crop.icon}
                                  <div className="ml-3 flex-1">
                                    <div className="flex justify-between">
                                      <span className="font-medium">{crop.name}</span>
                                      <span className="text-gray-600">{crop.suitability}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                      <motion.div 
                                        className="bg-green-600 h-2 rounded-full" 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${crop.suitability}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                      ></motion.div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Market Trends & Alerts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-4 text-white">
                          <h3 className="text-lg font-semibold flex items-center">
                            <FiTrendingUp className="mr-2" />
                            Market Trends
                          </h3>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {marketTrends.map((item, index) => (
                              <motion.div 
                                key={index}
                                whileHover={{ scale: 1.01 }}
                                className="flex justify-between items-center p-3 hover:bg-purple-50 rounded-lg transition"
                              >
                                <div>
                                  <p className="font-medium">{item.crop}</p>
                                  <p className="text-sm text-gray-500">per {item.unit}</p>
                                </div>
                                <div className="flex items-center">
                                  <span className="font-bold mr-2">₹{item.price}</span>
                                  <span className={`text-sm px-2 py-1 rounded-full ${item.change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {item.change > 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 text-black">
                          <h3 className="text-lg font-semibold flex items-center">
                            <FiAlertTriangle className="mr-2" />
                            Farm Alerts
                          </h3>
                        </div>
                        <div className="p-6">
                          <AnimatePresence>
                            {alerts.map(alert => (
                              <motion.div
                                key={alert.id}
                                variants={alertVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                whileHover="hover"
                                whileTap="tap"
                                className={`p-4 mb-3 rounded-lg flex items-start ${
                                  alert.severity === 'critical' ? 'bg-red-100 border-l-4 border-red-500 text-black':
                                  alert.severity === 'high' ? 'bg-orange-100 border-l-4 border-orange-500 text-black' :
                                  'bg-yellow-100 border-l-4 border-yellow-500 text-black'
                                }`}
                              >
                                <div className={`mr-3 mt-1 ${
                                  alert.severity === 'critical' ? 'text-red-600' :
                                  alert.severity === 'high' ? 'text-orange-600' :
                                  'text-yellow-600'
                                }`}>
                                  {alert.icon}
                                </div>
                                <div>
                                  <p className="font-medium">{alert.message}</p>
                                  <p className="text-sm text-black-600 mt-1">Click for details</p>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </div>

                    {/* Recent Activity */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-4 text-white">
                        <h3 className="text-lg font-semibold">Recent Farm Activity</h3>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {recentActivities.map(activity => (
                            <motion.div
                              key={activity.id}
                              whileHover={{ x: 5 }}
                              className="flex items-center p-3 border-b border-gray-100 last:border-0"
                            >
                              <div className="mr-3">
                                {activity.icon}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{activity.action}</p>
                                <p className="text-sm text-gray-500">{activity.time}</p>
                              </div>
                              <button className="text-green-600 hover:text-green-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}

                {activeTab === 'market' && (
                  <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-6">Farm Marketplace</h3>
                    <p className="text-gray-600">Coming soon - Connect with buyers and sellers in your region</p>
                  </motion.div>
                )}

                {activeTab === 'crops' && (
                  <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-6">Crop Advisor</h3>
                    <p className="text-gray-600">Coming soon - Get personalized crop recommendations</p>
                  </motion.div>
                )}

                {activeTab === 'weather' && (
                  <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-6">Weather Station</h3>
                    <p className="text-gray-600">Coming soon - Detailed weather forecasts and alerts</p>
                  </motion.div>
                )}

                {activeTab === 'irrigation' && (
                  <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-6">Irrigation Control</h3>
                    <p className="text-gray-600">Coming soon - Smart irrigation scheduling</p>
                  </motion.div>
                )}

                {activeTab === 'alerts' && (
                  <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-6">Farm Alerts</h3>
                    <div className="space-y-4">
                      {alerts.map(alert => (
                        <motion.div
                          key={alert.id}
                          whileHover={{ scale: 1.01 }}
                          className={`p-4 rounded-lg ${
                            alert.severity === 'critical' ? 'bg-red-50 border border-red-200 text-zinc-950' :
                            alert.severity === 'high' ? 'bg-orange-50 border border-orange-200 text-zinc-950' :
                            'bg-yellow-50 border border-yellow-200 text-zinc-950'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`mr-3 mt-1 ${
                              alert.severity === 'critical' ? 'text-red-600' :
                              alert.severity === 'high' ? 'text-orange-600' :
                              'text-yellow-600'
                            }`}>
                              {alert.icon}
                            </div>
                            <div>
                              <h4 className="font-bold">{alert.message}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {alert.severity === 'critical' ? 'Immediate action required' :
                                 alert.severity === 'high' ? 'Action recommended soon' :
                                 'Monitor situation'}
                              </p>
                              <button className="mt-2 text-sm text-green-600 hover:text-green-800 font-medium">
                                View details →
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;