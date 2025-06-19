import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    farmType: '',
    location: '',
    acceptTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-green-50">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000')] bg-cover opacity-20"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-8 bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            <span className="inline-block mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            AgriTech Solutions
          </h1>
          <p className="text-green-700">Join our community of modern farmers</p>
        </div>

        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-green-700 hidden md:block">
              <div className="h-full bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000')] bg-cover bg-center"></div>
            </div>

            <div className="md:w-1/2 p-8 bg-white">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Your Account</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-800">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-800 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-800">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-800 bg-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="Phone" className="block text-sm font-medium text-gray-800">Phone</label>
                  <input
                    type="num"
                    id="phone"
                    name="phone"
                    value={formData.Phone}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-800 bg-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="ADHAR" className="block text-sm font-medium text-gray-800">ADHAR</label>
                  <input
                    type="text"
                    id="ADHAR"
                    name="ADHAR"
                    value={formData.ADHAR}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-800 bg-white"
                    required
                  />
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="acceptTerms" className="font-medium text-gray-800">
                      I agree to the <a href="#" className="text-green-600 hover:text-green-500">Terms and Conditions</a>
                    </label>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Register Now
                  </button>
                </div>
              </form>

              <div className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-700 bg-white p-4 rounded-lg">
          <p>© {new Date().getFullYear()} AgriTech Solutions. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
