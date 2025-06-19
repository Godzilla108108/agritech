import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';         // ⬅️ Correct import
import Register from './pages/Register';   // ⬅️ Correct import
import Home from './pages/Home';
import Dashboard from './pages/Dashboard'; 
import Weather from './pages/Weather'; 
import Marketplace from './pages/Marketplace';
import Prices from './pages/Prices';


function App() {
  return (
 
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/weather" element={<Weather/>} />
         <Route path="/marketplace" element={<Marketplace/>} />
         <Route path="/prices" element={<Prices/>} />

      </Routes>
 
  );
}

export default App;
