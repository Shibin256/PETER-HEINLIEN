import { useState } from 'react';
import { FaPaperclip, FaGoogle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword:'',
    phone: '',
    gender: 'male',
    file: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
              required
            />
          </div>
          
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <div className="flex items-center">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                  <span className="text-gray-500">
                    {formData.file ? formData.file.name : 'Choose file'}
                  </span>
                  <FaPaperclip className="text-gray-400" />
                </div>
                <input 
                  type="file" 
                  name="file"
                  onChange={handleChange}
                  className="hidden" 
                />
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 Enter your phone number"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="gender" 
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-300" 
                />
                <span>Male</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="gender" 
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-300" 
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-teal-700 text-white py-3 rounded-md hover:bg-teal-800 transition-colors font-medium"
             style={{ backgroundColor: '#266b7d' }}
          >
            Create Account
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
            Already have an account?{' '}
            <a href="#" className="text-teal-700 hover:underline">Log in</a>
          </p>
        </form>
      </div>
    </main>
    <Footer/>
    </>
  );
};

export default Signup;