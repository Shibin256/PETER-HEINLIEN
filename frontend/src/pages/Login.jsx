import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission
  };

  return (
    <>
      <Navbar/>
    <main className="flex-grow flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create Your Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
              required
            />
          </div>

          
          <button 
            type="submit" 
            className="w-full bg-teal-700 text-white py-3 rounded-md hover:bg-teal-800 transition-colors font-medium"
             style={{ backgroundColor: '#266b7d' }}
          >
            Login Account
          </button>

          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span>OR</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <button 
            type="button"
            className="w-full flex items-center justify-center space-x-2 border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            <FaGoogle className="text-red-500" />
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-sm text-gray-600">
            New to The App?{' '}
            <a href="#" className="text-teal-700 hover:underline">SignUp</a>
          </p>
        </form>
      </div>
    </main>
    <Footer/>
    </>
  );
};

export default Login;