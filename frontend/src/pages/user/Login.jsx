import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
const baseUrl = import.meta.env.VITE_API_BASE_URL;


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/api/auth/login`, formData);
      const user=response.data
      navigate('/')
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  };
  
  //google auth
  const handleLoginSuccess=async(credentialResponse)=>{
    const idToken=credentialResponse.credential;
    // Send Google id_token to your backend
    const res = await axios.post(`${baseUrl}/api/auth/google`, {idToken});
    console.log('res========',res)
    if(res){
    const yourJWT=res.data.token
     // Store your JWT (not the Google one)
    localStorage.setItem('token', yourJWT);
    navigate('/login')
      }
  }


  return (
    <>
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
            {loading ? 'loading':'Login Account'}
          </button>

          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span>OR</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <div>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log('Login Failed')}
          />
            </div>

          <p className="text-center text-sm text-gray-600">
            New to The App?{' '}
            <Link to='/register' className='text-blue-500'>SignUp</Link>
          </p>
        </form>
      </div>
    </main>
    </>
  );
};

export default Login;