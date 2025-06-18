import React, { useState } from 'react'
import AuthLayout from '../../components/common/AuhLayout'
import AuthInput from '../../components/common/AuthInput'
import MainThemeButton from '../../components/common/MainThemeButton'
import { toast } from 'react-toastify'
const baseUrl = import.meta.env.VITE_API_BASE_URL;
import axiosInstance from '../../api/axiosInstance'
import { useNavigate } from 'react-router-dom'

const ForgotPass = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: ''
  })

  // handling input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

//handling submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      console.log('the response goint to send')
      const response = await axiosInstance.post(`${baseUrl}/api/auth/forgotpass`, { email: formData.email, })
      if (response) {
        toast.success(response.data.message)
        //naviagting to otp verification page with data
        navigate('/verify-otp-forgotpass', {
          state: {
            formData
          }
        });
      } else {
        toast.error('Otp sends failed. Please check your inputs.');
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'error hapened')
    }
    finally {
      setLoading(false)
    }

  }
  return (
    <div>
      <AuthLayout title="Forgot password">
        <form onSubmit={handleSubmit} >
          <AuthInput
            label="Email"
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Enter the email'
            width='w-full'
            Textcolor='text-gray-700'
            borderColor='border-gray-300'
          />
          <br />
          <MainThemeButton
            loading={loading}
            page='Submit'
            width='w-full'
            type='submit'
          />

        </form>
      </AuthLayout>
    </div>
  )
}

export default ForgotPass
