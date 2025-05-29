import { useState } from 'react';
import { FaPaperclip} from 'react-icons/fa';
import { toast } from 'react-toastify';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import usePasswordVal from '../usePasswordVal';
//google button getting
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: 'male',
    file: null,
  });
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    //validating password
    if (name === 'password') {
      const validationMsg = usePasswordVal(value);
      setError(validationMsg);
      setIsPasswordValid(!validationMsg); 
    }
    if (name === 'confirmPassword') {
      if (!isPasswordValid) {
        setError('Enter a valid password first.');
        return;
      }

    //comparing password
      if (formData.password !== value) {
        setError('Passwords do not match');
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        toast.error('All fields are required for signup');
        setLoading(false);
        return;
      }

      //confirming password is valid
      const validationMsg = usePasswordVal(formData.password);
      if (validationMsg) {
        setError(validationMsg);
        setIsPasswordValid(false);
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${baseUrl}/api/auth/register`, formData);
      if (response) {
        //navigate to verify otp with formdata
        navigate('/verify-otp', {
            state: {
              formData
            }
         });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'error hapened' )
    } finally {
      setLoading(false);
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
    navigate('/')
      }
  }

  return (
    <>
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create Your Account</h2>

          <form onSubmit={handleSubmit} className="space-y-5 relative">
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

            <div className="relative">
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
              {error && (
                <div className="absolute left-0 top-full mt-1 bg-red-100 border border-red-400 text-red-700 text-sm rounded-md px-3 py-2 shadow-md z-10 w-full">
                  {error}
                  <div className="absolute top-0 left-6 -mt-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-red-100"></div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
                disabled={!isPasswordValid}
                style={{ backgroundColor: !isPasswordValid ? '#f5f5f5' : 'white' }}
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
              {!loading ? 'Create Account' : 'Loading...'}
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
              Already have an account?{' '}
              <Link to='/login' className='text-blue-500'>Log in</Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
};

export default Signup;
