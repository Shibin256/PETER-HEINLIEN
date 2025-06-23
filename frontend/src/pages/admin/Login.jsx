import axios from 'axios';
import React, { useState } from 'react';
import { HiLockClosed, HiMail } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthInput from '../../components/common/AuthInput';
import axiosInstance from '../../api/axiosInstance';
import { setAdmin } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
const baseUrl = import.meta.env.VITE_API_BASE_URL;


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()
  const dispatch=useDispatch()

  //handling admin login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    try {
      const response = await axiosInstance.post(`${baseUrl}/api/auth/admin-login`, { email, password })
      console.log(response.data, 'admin login res')

      // settong access token to the local storage
      const token = response.data.accessToken
      const admin = JSON.stringify(response.data.user)
      console.log(token, 'admin login token========')
      dispatch(setAdmin({ token, admin }))
      localStorage.setItem('accessToken', token)
      localStorage.setItem('admin', admin)

      if (response) {
        toast.success(response.data.message)
        navigate('/admin/dashboard')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'error hapened')
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          Sign in to your administrator account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-500 text-white p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>

            <AuthInput
              label="Email"
              type='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='your@email.com'
              width='w-full'
              Textcolor='text-gray-300'
              bgcolor='bg-gray-700'
              borderColor='border-gray-600'
            />

            <AuthInput
              label="Password"
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              width='w-full'
              Textcolor='text-gray-300'
              bgcolor='bg-gray-700'
              borderColor='border-gray-600'

            />

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;