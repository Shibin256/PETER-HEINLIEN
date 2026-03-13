import { useState } from 'react';
import { toast } from 'react-toastify';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { Link, useNavigate } from 'react-router-dom';
import usePasswordVal from '../../usePasswordVal';
//google button getting
import axiosInstance from '../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../features/auth/authSlice';
import { useEffect } from 'react';
import AuthInput from '../../components/common/AuthInput';
import AuthDivider from '../../components/common/AuthDivder';
import GoogleAuthButton from '../../components/common/GoogleAuthButton';
import MainThemeButton from '../../components/common/MainThemeButton';
import RadioGroup from '../../components/common/RadioGroup';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: 'male',
    file: null,
    ReferralCode: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    //removing saved values in the Otp verify page.
    localStorage.removeItem('otpExpiry');
    localStorage.removeItem('ResendCount');
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;

      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'password':
        const validationMsg = usePasswordVal(value);
        if (validationMsg) {
          error = validationMsg;
          setIsPasswordValid(false);
        } else {
          setIsPasswordValid(true);
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (formData.password !== value) {
          error = 'Passwords do not match';
        }
        break;

      case 'phone':
        if (!value) {
          error = 'Phone number is required';
        }else if (!/^\d{10}$/.test(value)) {
            error = 'Phone number must be 10 digits';
          } else if (value === '0000000000') {
            error = 'Phone number cannot be all zeros';
          } else if (!/^[6-9]\d{9}$/.test(value)) {
            error = 'Please enter a valid 10-digit phone number starting with 6-9';
          }
        
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate all required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordError = usePasswordVal(formData.password);
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordError) {
      newErrors.password = passwordError;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate phone if provided
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    } else if (formData.phone === '0000000000') {
      newErrors.phone = 'Phone number cannot be all zeros';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number starting with 6-9';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Validate field on change
    const fieldError = validateField(name, value);
    if (fieldError) {
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }

    // Special handling for password fields
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }

    if (name === 'confirmPassword' && formData.password) {
      const confirmError = validateField('confirmPassword', value);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${baseUrl}/api/auth/register`,
        formData
      );

      if (response) {
        toast.success(response.data.message);
        navigate('/verify-otp', {
          state: {
            formData,
          },
        });
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        error.response.data.errors.forEach((msg) => toast.error(msg));
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  //google auth
  const handleLoginSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    try {
      const res = await axiosInstance.post(`${baseUrl}/api/auth/google`, {
        idToken,
      });

      const token = res.data.accessToken;
      const user = JSON.stringify(res.data.user);
      dispatch(setUser(token, user));
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', user);
      toast.success('User registered using Google successfully');
      navigate('/');
    } catch (error) {
      toast.error('Google sign-in failed');
    }
  };

  return (
    <>
      <main className="flex-1 py-10 flex items-center justify-center py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 relative">
            <AuthInput
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              width="w-full"
              Textcolor="text-gray-700"
              borderColor={errors.name ? "border-red-500" : "border-gray-300"}
              error={errors.name}
              required={false}
            />

            <AuthInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              width="w-full"
              Textcolor="text-gray-700"
              borderColor={errors.email ? "border-red-500" : "border-gray-300"}
              error={errors.email}
              required={false}
            />

            <AuthInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              width="w-full"
              Textcolor="text-gray-700"
              borderColor={errors.password ? "border-red-500" : "border-gray-300"}
              error={errors.password}
              required={false}
            />

            <AuthInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              width="w-full"
              Textcolor="text-gray-700"
              borderColor={errors.confirmPassword ? "border-red-500" : "border-gray-300"}
              error={errors.confirmPassword}
              disabled={!isPasswordValid && formData.password.length > 0}
              required={false}
            />

            <AuthInput
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              width="w-full"
              Textcolor="text-gray-700"
              borderColor={errors.phone ? "border-red-500" : "border-gray-300"}
              error={errors.phone}
              required={false}
            />

            <AuthInput
              label="Referral Code"
              type="text"
              name="ReferralCode"
              value={formData.ReferralCode}
              onChange={handleChange}
              placeholder="Enter the referral code"
              width="w-full"
              Textcolor="text-gray-700"
              borderColor="border-gray-300"
              required={false}
            />

            <RadioGroup
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
              ]}
            />

            <MainThemeButton
              loading={loading}
              page="Create Account"
              width="w-full"
              type="submit"
            />

            <AuthDivider />

            <GoogleAuthButton onSuccess={handleLoginSuccess} />

            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                Already have an account?{' '}
                <Link to="/login" className="text-blue-500 hover:underline">
                  Log in
                </Link>
              </span>
              <span>
                <Link
                  to="/"
                  className="text-yellow-500 font-semibold hover:underline"
                >
                  Go to Home
                </Link>
              </span>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Signup;