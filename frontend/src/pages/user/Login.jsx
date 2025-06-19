import { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
import axiosInstance from '../../api/axiosInstance';
import {useDispatch, useSelector} from 'react-redux'
import { setUser } from '../../features/auth/authSlice';
import AuthInput from '../../components/common/AuthInput';
import AuthLayout from '../../components/common/AuhLayout';
import AuthDivider from '../../components/common/AuthDivder';
import GoogleAuthButton from '../../components/common/GoogleAuthButton';
import MainThemeButton from '../../components/common/MainThemeButton';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const {isAuthenticated}=useSelector((state)=>state.auth)

  //if user is in it redirect to login page
  useEffect(()=>{
    if(isAuthenticated){
      navigate('/',{replace:true})
    }
  },[isAuthenticated,navigate])

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // handle submit
  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(`${baseUrl}/api/auth/login`, formData);
      //getting access token & user
      const token=response.data.accessToken
      const user=JSON.stringify(response.data.user)
      dispatch(setUser({token,user}))
      localStorage.setItem('accessToken',token)
      localStorage.setItem('user',user)
      toast.success(response.data.message)
      navigate('/')
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'error hapened' )
    }finally{
      setLoading(false)
    }
  };
  
  //google auth
  const handleLoginSuccess=async(credentialResponse)=>{
    const idToken=credentialResponse.credential;
    // Send Google id_token to your backend
    const res = await axiosInstance.post(`${baseUrl}/api/auth/google`, {idToken});

    const token=res.data.accessToken
    const user=JSON.stringify(res.data.user)
    dispatch(setUser(token,user))
    localStorage.setItem('accessToken',token)
    localStorage.setItem('user',user)
    toast.success('user register using google is successfull')
    navigate('/')
  }

  return (
    <>
        <AuthLayout title="Log in to Your Account">
        <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="Email"
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='your@email.com'
              width='w-full'
              Textcolor='text-gray-700'
              borderColor='border-gray-300'
            />

              <AuthInput
              label="Password"
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='••••••••'
              width='w-full'
              Textcolor='text-gray-700'
              borderColor='border-gray-300'
            />
              
            <div className="flex items-center justify-end">
              <Link 
                to="/reset-password" 
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

          <MainThemeButton 
          loading={loading}
          page='Login Account'
          width='w-full'
          type='submit'
          />

          <AuthDivider/>

          <GoogleAuthButton onSuccess={handleLoginSuccess} />

          <p className="text-center text-sm text-gray-600">
            New to The App?{' '}
            <Link to='/register' className='text-blue-500'>SignUp</Link>
          </p>
        </form>
        </AuthLayout>
    </>
  );
};

export default Login;