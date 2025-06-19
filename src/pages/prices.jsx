import { useState, useEffect } from 'react';
import { FaLeaf, FaChartLine, FaSearch, FaSyncAlt, FaMapMarkerAlt, FaCity, FaCalendarAlt, FaExclamationTriangle, FaSeedling, FaInfoCircle } from 'react-icons/fa';
const categoryMap = {
  Grains: ['wheat', 'rice', 'maize', 'barley', 'jowar', 'bajra'],
  Vegetables: ['tomato', 'onion', 'potato', 'brinjal', 'cabbage', 'cauliflower'],
  Fruits: ['banana', 'apple', 'mango', 'grapes', 'orange', 'papaya'],
};
const prices = () => {
  const apiKey = "579b464db66ec23bdd0000013ffb60a2719d491b6526398c880f63a6";
  const baseUrl = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";
  
  const [allRecords, setAllRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Commodities');
  


  useEffect(() => {
    // Load saved data from localStorage if available
    const savedData = localStorage.getItem('agmarknetData');
    if (savedData) {
      setAllRecords(JSON.parse(savedData));
      setFilteredRecords(JSON.parse(savedData));
    }
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${baseUrl}?api-key=${apiKey}&format=json&limit=50`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const records = data.records || [];
      
      setAllRecords(records);
      setFilteredRecords(records);
      localStorage.setItem('agmarknetData', JSON.stringify(records));
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

const filterPrices = () => {
  const filtered = allRecords.filter(item => {
    const commodity = item.commodity?.toLowerCase().trim() || "";
    const market = item.market?.toLowerCase().trim() || "";
    const district = item.district?.toLowerCase().trim() || "";
    const state = item.state?.toLowerCase().trim() || "";

    const matchesSearch =
      commodity.includes(searchTerm.toLowerCase()) ||
      market.includes(searchTerm.toLowerCase()) ||
      district.includes(searchTerm.toLowerCase()) ||
      state.includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (activeFilter !== "All Commodities") {
      const keywords = categoryMap[activeFilter] || [];
      matchesFilter = keywords.some(keyword => commodity.includes(keyword));
    }

    return matchesSearch && matchesFilter;
  });

  setFilteredRecords(filtered);
};


  useEffect(() => {
    filterPrices();
  }, [searchTerm, activeFilter, allRecords]);

 const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  const [day, month, year] = dateString.split('/');
  const formatted = new Date(`${year}-${month}-${day}`); // Convert to ISO format

  if (isNaN(formatted)) return 'Invalid Date';

  return formatted.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};


  const filters = ['All Commodities', 'Grains', 'Vegetables', 'Fruits'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl text-green-800">
              <FaLeaf />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-900">AgriPrice Dashboard</h1>
              <p className="text-gray-600">Real-time crop prices from Agmarknet</p>
            </div>
          </div>
          <button 
            onClick={fetchPrices}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FaChartLine />
            Load Current Prices
          </button>
        </header>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent "
              placeholder="Search commodities, markets..."
            />
          </div>
          <button 
            onClick={fetchPrices}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter 
                  ? 'bg-green-700 text-white' 
                  : 'bg-white text-green-500 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-lg text-center">
            <div className="text-4xl mb-4">
              <FaExclamationTriangle className="inline-block" />
            </div>
            <h3 className="text-xl font-bold mb-2">Failed to load price data</h3>
            <p className="mb-4">{error}</p>
            <button 
              onClick={fetchPrices}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto transition-all duration-300"
            >
              <FaSyncAlt />
              Try Again
            </button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4 text-gray-300">
              {allRecords.length === 0 ? <FaSeedling /> : <FaInfoCircle />}
            </div>
            <h3 className="text-xl font-medium mb-2">
              {allRecords.length === 0 ? 'No price data loaded' : 'No matching prices found'}
            </h3>
            <p>
              {allRecords.length === 0 
                ? 'Click "Load Current Prices" to fetch the latest market rates' 
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-green-700"
              >
                <div className="bg-green-700 text-white p-4 flex justify-between items-center">
                  <div className="font-semibold text-lg">{item.commodity}</div>
                  <div className="font-bold">₹{item.modal_price}</div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-600 font-medium">Min Price:</span>
                    <span className="font-semibold text-black">₹{item.min_price}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-600 font-medium">Max Price:</span>
                    <span className="font-semibold text-black">₹{item.max_price}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600 font-medium">Modal Price:</span>
                    <span className="font-semibold text-green-700">₹{item.modal_price}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <FaMapMarkerAlt className="text-gray-400" />
                      {item.market}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <FaCity className="text-gray-400" />
                      {item.district}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-4">
                    <FaCalendarAlt className="text-gray-400" />
                    Last updated: {formatDate(item.arrival_date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default prices;